"use client";

import MapPicker from "@/components/map/map-picker";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { getAddressFromCoordinates } from "@/services/address-api";
import { submitProviderAddress } from "@/services/verification-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const content = { en, fa };

export interface AddressStepProps {
  redirectPath?: string;
  title?: string;
}

export function AddressStep({ redirectPath = "/app/become-sitter", title }: AddressStepProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter.addressPage;

  const [step, setStep] = useState<"map" | "form">("map");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addressSchema = useMemo(() => z.object({
    postalCode: z.string()
      .length(10, t.fields.postalCode.errorLength)
      .regex(/^\d+$/, t.fields.postalCode.errorNumeric),
    addressLine1: z.string().min(5, t.fields.addressLine1.errorMin),
    addressLine2: z.string().optional(),
  }), [t]);

  type AddressFormValues = z.infer<typeof addressSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleConfirmLocation = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);
    try {
      const details = await getAddressFromCoordinates(location.lat, location.lng);

      if (details.postal_code) setValue("postalCode", details.postal_code);
      if (details.address_line1) setValue("addressLine1", details.address_line1);
      // address_line2 usually not returned by reverse geocoding, but just in case
      if (details.address_line2) setValue("addressLine2", details.address_line2);

      setStep("form");
    } catch (err) {
      console.error("Failed to get address details", err);
      // Allow proceeding even if reverse geocoding fails
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AddressFormValues) => {
    if (!location) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitProviderAddress({
        postal_code: data.postalCode,
        country: "Iran",
        address_line1: data.addressLine1,
        address_line2: data.addressLine2 || "",
        lat: location.lat,
        lng: location.lng,
      });

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title || t.title}</h1>
        <p className="text-muted-foreground">
          {step === "map" ? t.mapDesc : t.formDesc}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === "map" ? t.mapTitle : t.formTitle}
          </CardTitle>
          <CardDescription>
            {step === "map" ? t.mapInstruction : t.formInstruction}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "map" ? (
            <div className="space-y-4">
              <div className="h-[400px] w-full relative rounded-md overflow-hidden border">
                <MapPicker
                  onLocationChange={handleLocationChange}
                  placeholder={t.searchPlaceholder}
                  initialLat={location?.lat}
                  initialLng={location?.lng}
                />
                {loading && (
                  <div className="absolute inset-0 bg-white/50 z-[1000] flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-sm font-medium text-slate-700">{t.loadingAddress}</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                disabled={!location || loading}
                onClick={handleConfirmLocation}
              >
                {loading ? t.loading : t.confirmLocation}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t.fields.postalCode.label}</Label>
                <Input
                  id="postalCode"
                  placeholder={t.fields.postalCode.placeholder}
                  className="text-left dir-ltr tracking-widest"
                  maxLength={10}
                  inputMode="numeric"
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">{t.fields.addressLine1.label}</Label>
                <Input
                  id="addressLine1"
                  placeholder={t.fields.addressLine1.placeholder}
                  {...register("addressLine1")}
                />
                {errors.addressLine1 && (
                  <p className="text-sm text-red-500">{errors.addressLine1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">{t.fields.addressLine2.label}</Label>
                <Input
                  id="addressLine2"
                  placeholder={t.fields.addressLine2.placeholder}
                  {...register("addressLine2")}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("map")}
                  disabled={submitting}
                >
                  <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
                  {t.backToMap}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t.submit}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
