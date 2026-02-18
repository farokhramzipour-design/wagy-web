"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, MapPin } from "lucide-react";
import MapPicker from "@/components/map/map-picker";
import { useRouter } from "next/navigation";
import { updateAddressClient, getAddressFromCoordinates, CreateAddressDto, Address } from "@/services/address-api";
import { toast } from "sonner";

interface EditAddressDialogProps {
  t: any; // Translation object
  address: Address;
}

export default function EditAddressDialog({ t, address }: EditAddressDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"map" | "form">("form");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateAddressDto>({
    country: address.country_code || "IR",
    province: String(address.province_id) || "",
    city: String(address.city_id) || "",
    postal_code: address.postal_code || "",
    address_line1: address.address_line1 || "",
    address_line2: address.address_line2 || "",
    lat: address.lat,
    lng: address.lng,
    label: address.label,
    is_default: address.is_default,
  });

  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number } | null>({
    lat: address.lat,
    lng: address.lng
  });

  const handleMapChange = (lat: number, lng: number) => {
    setTempLocation({ lat, lng });
  };

  const handleConfirmLocation = async () => {
    if (!tempLocation) return;
    
    setLoading(true);
    try {
      // Mock reverse geocoding
      const addressDetails = await getAddressFromCoordinates(tempLocation.lat, tempLocation.lng);
      setFormData((prev) => ({
        ...prev,
        ...addressDetails,
        lat: tempLocation.lat,
        lng: tempLocation.lng,
      }));
      setStep("form");
    } catch (error) {
      console.error("Failed to get address details", error);
      toast.error(t.validation.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.label?.trim()) {
      toast.error(t.validation.labelRequired);
      return;
    }
    
    if (!formData.address_line1?.trim()) {
      toast.error(t.validation.addressRequired || "Address line 1 is required");
      return;
    }

    setLoading(true);
    try {
      await updateAddressClient(address.address_id, formData);
      toast.success(t.validation?.updateSuccess || "Address updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update address", error);
      toast.error(t.validation?.error || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closed
      setTimeout(() => {
        setStep("form");
        setFormData({
          country: address.country_code || "IR",
          province: String(address.province_id) || "",
          city: String(address.city_id) || "",
          postal_code: address.postal_code || "",
          address_line1: address.address_line1 || "",
          address_line2: address.address_line2 || "",
          lat: address.lat,
          lng: address.lng,
          label: address.label,
          is_default: address.is_default,
        });
        setTempLocation({ lat: address.lat, lng: address.lng });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "map" ? t.form.mapStep : (t.form?.editTitle || "Edit Address")}
          </DialogTitle>
        </DialogHeader>

        {step === "map" ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">
              {loading ? (t.form?.loadingAddress || "Loading address details...") : t.form.searchMap}
            </p>
            <div className="h-[400px] w-full relative">
               <MapPicker 
                 onLocationChange={handleMapChange} 
                 placeholder={t.form.searchMap}
                 initialLat={formData.lat}
                 initialLng={formData.lng}
               />
               {loading && (
                 <div className="absolute inset-0 bg-white/50 z-[1000] flex items-center justify-center">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                 </div>
               )}
            </div>
            
            <Button 
              className="w-full bg-[#0ea5a4] hover:bg-[#0b7c7b]" 
              disabled={!tempLocation || loading}
              onClick={handleConfirmLocation}
            >
              {loading ? t.actions.saving : t.form.confirmLocation}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-label">{t.form.label}</Label>
                <Input
                  id="edit-label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder={t.form?.labelPlaceholder || "e.g. Home"}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-address_line1">{t.form.addressLine1}</Label>
                <Input
                  id="edit-address_line1"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-address_line2">{t.form.addressLine2}</Label>
                <Input
                  id="edit-address_line2"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-postal_code">
                  {t.form.postalCode} <span className="text-muted-foreground text-xs font-normal">({t.common?.optional || "Optional"})</span>
                </Label>
                <Input
                  id="edit-postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
               <input
                type="checkbox"
                id="edit-is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0ea5a4] focus:ring-[#0ea5a4]"
              />
              <Label htmlFor="edit-is_default" className="font-normal cursor-pointer">
                {t.form.isDefault}
              </Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep("map")}>
                <MapPin className="w-4 h-4 mr-2" />
                {t.form.changeLocation || "Change Location"}
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
                {loading ? t.actions.saving : (t.actions.update || "Update")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
