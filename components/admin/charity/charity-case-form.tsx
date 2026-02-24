"use client";

import MapPicker from "@/components/map/map-picker";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api-client";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { City, getAddressFromCoordinates, getCities, getProvinces, Province } from "@/services/address-api";
import { adminCharityApi } from "@/services/admin-charity-api";
import { Media, uploadMedia } from "@/services/media-api";
import { CharityCaseDetail, CreateCharityCaseRequest } from "@/types/charity";
import { formatISO } from "date-fns";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface CharityCaseFormProps {
  initialData?: CharityCaseDetail;
  accessToken?: string;
}

export function CharityCaseForm({ initialData, accessToken }: CharityCaseFormProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.charity.form;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Location Data States
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
    province_id: initialData?.province_id || 0,
    city_id: initialData?.city_id || 0,
    location_text: initialData?.location_text || "",
    lat: (initialData as any)?.lat || 35.6892, // Default Tehran
    lng: (initialData as any)?.lng || 51.3890,
    incident_date: initialData?.incident_date || "",
    expires_at: initialData?.expires_at || "",
    media_ids: initialData?.media?.map(m => m.media_id) || [],
    primary_media_id: initialData?.media?.[0]?.media_id || 0, // Default to first or 0
  });

  // Initialize gallery images from initialData
  const [galleryImages, setGalleryImages] = useState<Media[]>(
    initialData?.media?.map(m => ({
      media_id: m.media_id,
      url: m.url,
      thumb_url: m.thumbnail_url || "",
      mime_type: m.type === "image" ? "image/jpeg" : "video/mp4", // approximation
      size_bytes: 0,
      width: 0,
      height: 0,
      created_at: ""
    })) || []
  );

  // Helper for image URLs
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Fetch Provinces on Mount (Default IR)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces("IR");
        setProvinces(data || []);
      } catch (error) {
        console.error("Failed to fetch provinces", error);
      }
    };
    fetchProvinces();
  }, []);

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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !accessToken) return;

    try {
      setUploading(true);
      const files = Array.from(e.target.files);

      // Upload in parallel
      const uploadPromises = files.map(file => uploadMedia(accessToken, file, "other"));
      const uploadedMedia = await Promise.all(uploadPromises);

      setGalleryImages(prev => [...prev, ...uploadedMedia]);
      setFormData(prev => {
        const newIds = uploadedMedia.map(m => m.media_id);
        const allIds = [...prev.media_ids, ...newIds];
        // If no primary set, set the first uploaded one as primary
        const primaryId = prev.primary_media_id || newIds[0];
        return {
          ...prev,
          media_ids: allIds,
          primary_media_id: primaryId
        };
      });

      toast.success("Images uploaded");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (mediaId: number) => {
    setGalleryImages(prev => prev.filter(m => m.media_id !== mediaId));
    setFormData(prev => {
      const newIds = prev.media_ids.filter(id => id !== mediaId);
      // If primary was removed, pick the first available or 0
      let newPrimaryId = prev.primary_media_id;
      if (prev.primary_media_id === mediaId) {
        newPrimaryId = newIds.length > 0 ? newIds[0] : 0;
      }
      return {
        ...prev,
        media_ids: newIds,
        primary_media_id: newPrimaryId
      };
    });
  };

  const setPrimaryImage = (mediaId: number) => {
    setFormData(prev => ({ ...prev, primary_media_id: mediaId }));
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

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>{t.provinceLabel || "Province"}</Label>
              <Select
                value={formData.province_id?.toString() || "0"}
                onValueChange={(v) => setFormData({ ...formData, province_id: Number(v), city_id: 0 })}
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
                onValueChange={(v) => setFormData({ ...formData, city_id: Number(v) })}
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
          {galleryImages.map((media) => (
            <div
              key={media.media_id}
              className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group cursor-pointer"
              onClick={() => setPrimaryImage(media.media_id)}
            >
              <img src={getImageUrl(media.url)} alt="Case media" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeGalleryImage(media.media_id);
                }}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {formData.primary_media_id === media.media_id && (
                <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs text-center py-1">
                  Primary
                </div>
              )}
            </div>
          ))}

          <div
            className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer"
            onClick={() => galleryInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 text-neutral-400" />
                <span className="text-sm text-neutral-500">{t.addImage || "Add Image"}</span>
              </>
            )}
            <input
              type="file"
              ref={galleryInputRef}
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
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
