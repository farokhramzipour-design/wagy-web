"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, MapPin } from "lucide-react";
import MapPicker from "@/components/map/map-picker";
import { useRouter } from "next/navigation";
import { createAddressClient, getAddressFromCoordinates, CreateAddressDto } from "@/services/address-api";
import { toast } from "sonner";

interface AddAddressDialogProps {
  t: any; // Translation object
}

export default function AddAddressDialog({ t }: AddAddressDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"map" | "form">("map");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateAddressDto>({
    country: "IR",
    province: "",
    city: "",
    postal_code: "",
    address_line1: "",
    address_line2: "",
    lat: 0,
    lng: 0,
    label: "",
    is_default: false,
  });

  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number } | null>(null);

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
      await createAddressClient(formData);
      toast.success(t.validation.success);
      setOpen(false);
      router.refresh();
      // Reset form
      setStep("map");
      setFormData({
        country: "IR",
        province: "",
        city: "",
        postal_code: "",
        address_line1: "",
        address_line2: "",
        lat: 0,
        lng: 0,
        label: "",
        is_default: false,
      });
      setTempLocation(null);
    } catch (error) {
      console.error("Failed to create address", error);
      toast.error(t.validation.error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closed
      setTimeout(() => {
        setStep("map");
        setFormData({
            country: "IR",
            province: "",
            city: "",
            postal_code: "",
            address_line1: "",
            address_line2: "",
            lat: 0,
            lng: 0,
            label: "",
            is_default: false,
          });
        setTempLocation(null);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
          <Plus className="w-4 h-4 mr-2" />
          {t.add}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "map" ? t.form.mapStep : t.form.detailsStep}
          </DialogTitle>
        </DialogHeader>

        {step === "map" ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">
              {loading ? "Loading address details..." : t.form.searchMap}
            </p>
            <div className="h-[400px] w-full relative">
               <MapPicker 
                 onLocationChange={handleMapChange} 
                 placeholder={t.form.searchMap}
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
                <Label htmlFor="label">{t.form.label}</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Home"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address_line1">{t.form.addressLine1}</Label>
                <Input
                  id="address_line1"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address_line2">{t.form.addressLine2}</Label>
                <Input
                  id="address_line2"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">
                  {t.form.postalCode} <span className="text-muted-foreground text-xs font-normal">({t.common?.optional || "Optional"})</span>
                </Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
               <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0ea5a4] focus:ring-[#0ea5a4]"
              />
              <Label htmlFor="is_default" className="font-normal cursor-pointer">
                {t.form.isDefault}
              </Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep("map")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.actions.cancel}
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#0ea5a4] hover:bg-[#0b7c7b]">
                {loading ? t.actions.saving : t.actions.save}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
