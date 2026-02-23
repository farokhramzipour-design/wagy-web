"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { adminCharityApi } from "@/services/admin-charity-api";
import { adminApi } from "@/services/admin-api";
import { CharityCaseDetail, CreateCharityCaseRequest } from "@/types/charity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Image as ImageIcon, Trash2, Plus, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import MapPicker from "@/components/map/map-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { getAddressFromCoordinates, getCountries, getProvinces, getCities, Country, Province, City } from "@/services/address-api";
import { formatISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const content = { en, fa };

interface CharityCaseFormProps {
  initialData?: CharityCaseDetail;
}

export function CharityCaseForm({ initialData }: CharityCaseFormProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.charity.form;
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Location Data States
  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  
  // Date states
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(
    initialData?.incident_date ? new Date(initialData.incident_date) : undefined
  );
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    initialData?.expires_at ? new Date(initialData.expires_at) : undefined
  );

  const [formData, setFormData] = useState<CreateCharityCaseRequest>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    target_amount_minor: initialData?.target_amount_minor || 0,
    currency_code: initialData?.currency_code || "IRR",
    country_code: initialData?.province_id ? "IR" : "IR",
    province_id: initialData?.province_id || 0,
    city_id: initialData?.city_id || 0,
    location_text: initialData?.location_text || "",
    lat: (initialData as any)?.lat || 35.6892, // Default Tehran
    lng: (initialData as any)?.lng || 51.3890,
    incident_date: initialData?.incident_date || "",
    expires_at: initialData?.expires_at || "",
    media_ids: initialData?.media?.map(m => m.media_id) || [],
  });
  
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialData?.media?.map(m => m.url) || []);

  // Fetch Countries on Mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data || []);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch Provinces when Country Changes
  useEffect(() => {
    if (!formData.country_code) {
      setProvinces([]);
      return;
    }
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces(formData.country_code);
        setProvinces(data || []);
      } catch (error) {
        console.error("Failed to fetch provinces", error);
      }
    };
    fetchProvinces();
  }, [formData.country_code]);

  // Fetch Cities when Province Changes
  useEffect(() => {
    if (!formData.province_id) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const data = await getCities(formData.province_id);
        setCities(data || []);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    fetchCities();
  }, [formData.province_id]);

  const handleLocationChange = async (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
    
    // Reverse geocode to get location text if empty or to update it
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      if (address.address_line1) {
        setFormData(prev => ({ 
          ...prev, 
          location_text: address.address_line1 || "",
        }));
      }
    } catch (error) {
      console.error("Failed to reverse geocode", error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      const res = await adminApi.uploadMedia(file, "charity_case");
      
      setFormData(prev => ({ 
        ...prev, 
        media_ids: [...(prev.media_ids || []), res.media_id] 
      }));
      setMediaUrls(prev => [...prev, res.url]);
      
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media_ids: prev.media_ids?.filter((_, i) => i !== index)
    }));
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format dates
    const incidentDateStr = incidentDate ? formatISO(incidentDate) : "";
    const expiresAtStr = expiresAt ? formatISO(expiresAt) : "";
    
    const submitData: CreateCharityCaseRequest = {
      ...formData,
      incident_date: incidentDateStr,
      expires_at: expiresAtStr,
      currency_code: "IRR", // Hardcoded as requested
    };
    
    try {
      if (initialData) {
        // Update logic
        await adminCharityApi.updateCase(initialData.charity_case_id, {
          title: submitData.title,
          description: submitData.description,
          location_text: submitData.location_text,
          incident_date: submitData.incident_date,
          expires_at: submitData.expires_at,
          media_ids: submitData.media_ids,
          lat: submitData.lat,
          lng: submitData.lng,
          country_code: submitData.country_code,
          province_id: submitData.province_id,
          city_id: submitData.city_id,
        });
      } else {
        // Create logic
        await adminCharityApi.createCase(submitData);
      }
      
      toast.success(t.success);
      router.push("/app/charity");
      router.refresh();
    } catch (error) {
      console.error("Submit failed", error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.titleLabel || "Title"}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder={t.titlePlaceholder || "Enter case title"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_amount">{t.targetAmountLabel || "Target Amount (IRR)"}</Label>
            <Input
              id="target_amount"
              type="number"
              value={formData.target_amount_minor}
              onChange={(e) => setFormData({ ...formData, target_amount_minor: Number(e.target.value) })}
              required
              min="0"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label>{t.incidentDateLabel || "Incident Date (Start)"}</Label>
              <DatePicker 
                date={incidentDate} 
                setDate={setIncidentDate} 
                locale={lang as "en" | "fa"} 
                placeholder={t.selectDate || "Select date"}
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t.expiresAtLabel || "Expires At (End)"}</Label>
              <DatePicker 
                date={expiresAt} 
                setDate={setExpiresAt} 
                locale={lang as "en" | "fa"} 
                placeholder={t.selectDate || "Select date"}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label>{t.countryLabel || "Country"}</Label>
              <Select 
                value={formData.country_code} 
                onValueChange={(v) => setFormData({...formData, country_code: v, province_id: 0, city_id: 0})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectCountry || "Select Country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.country_code} value={c.country_code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t.provinceLabel || "Province"}</Label>
              <Select 
                value={formData.province_id?.toString() || "0"} 
                onValueChange={(v) => setFormData({...formData, province_id: Number(v), city_id: 0})}
                disabled={!formData.country_code}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectProvince || "Select Province"} />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.province_id} value={p.province_id.toString()}>
                      {lang === 'fa' ? p.name_fa : p.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t.cityLabel || "City"}</Label>
              <Select 
                value={formData.city_id?.toString() || "0"} 
                onValueChange={(v) => setFormData({...formData, city_id: Number(v)})}
                disabled={!formData.province_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectCity || "Select City"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.city_id} value={c.city_id.toString()}>
                      {lang === 'fa' ? c.name_fa : c.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_text">{t.locationLabel || "Location Address"}</Label>
            <Textarea
              id="location_text"
              value={formData.location_text}
              onChange={(e) => setFormData({ ...formData, location_text: e.target.value })}
              placeholder={t.locationPlaceholder || "Full address..."}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.mapLabel || "Select Location on Map"}</Label>
            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-neutral-200">
              <MapPicker 
                onLocationChange={handleLocationChange}
                initialLat={formData.lat || 35.6892}
                initialLng={formData.lng || 51.3890}
              />
            </div>
            <p className="text-xs text-neutral-500">
              Selected: {formData.lat?.toFixed(6)}, {formData.lng?.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t.descriptionLabel || "Description"}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="min-h-[150px]"
          placeholder={t.descriptionPlaceholder || "Detailed description of the case..."}
        />
      </div>

      <div className="space-y-4">
        <Label>{t.mediaLabel || "Gallery Images"}</Label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaUrls.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group">
              <img src={url} alt={`Case image ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            ) : (
              <div className="text-center text-neutral-500">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">{t.addImage || "Add Image"}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          {t.cancel || "Cancel"}
        </Button>
        <Button type="submit" disabled={loading} className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t.submit || "Save Case"}
        </Button>
      </div>
    </form>
  );
}
