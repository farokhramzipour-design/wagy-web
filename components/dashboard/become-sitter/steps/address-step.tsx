"use client";

import MapPicker from "@/components/map/map-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAddressFromCoordinates } from "@/services/address-api";
import { submitProviderAddress } from "@/services/verification-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const addressSchema = z.object({
  postalCode: z.string().length(10, "کد پستی باید ۱۰ رقم باشد").regex(/^\d+$/, "فقط اعداد مجاز است"),
  addressLine1: z.string().min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),
  addressLine2: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export function AddressStep() {
  const router = useRouter();
  const [step, setStep] = useState<"map" | "form">("map");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      router.push("/app/become-sitter");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "خطا در ثبت آدرس");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">ثبت موقعیت مکانی</h1>
        <p className="text-muted-foreground">
          {step === "map"
            ? "لطفا موقعیت مکانی دقیق خود را روی نقشه انتخاب کنید."
            : "لطفا جزئیات آدرس خود را تکمیل کنید."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === "map" ? "انتخاب موقعیت روی نقشه" : "جزئیات آدرس"}
          </CardTitle>
          <CardDescription>
            {step === "map"
              ? "نقشه را جابجا کنید تا نشانگر روی محل دقیق شما قرار گیرد."
              : "آدرس پستی دقیق جهت نمایش به کاربران"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "map" ? (
            <div className="space-y-4">
              <div className="h-[400px] w-full relative rounded-md overflow-hidden border">
                <MapPicker
                  onLocationChange={handleLocationChange}
                  placeholder="جستجوی آدرس..."
                  initialLat={location?.lat}
                  initialLng={location?.lng}
                />
                {loading && (
                  <div className="absolute inset-0 bg-white/50 z-[1000] flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-sm font-medium text-slate-700">در حال دریافت آدرس...</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                disabled={!location || loading}
                onClick={handleConfirmLocation}
              >
                {loading ? "لطفا صبر کنید..." : "تایید موقعیت و ادامه"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">کد پستی (۱۰ رقم)</Label>
                <Input
                  id="postalCode"
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
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
                <Label htmlFor="addressLine1">آدرس دقیق</Label>
                <Input
                  id="addressLine1"
                  placeholder="مثال: تهران، خیابان آزادی..."
                  {...register("addressLine1")}
                />
                {errors.addressLine1 && (
                  <p className="text-sm text-red-500">{errors.addressLine1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">جزئیات بیشتر (اختیاری)</Label>
                <Input
                  id="addressLine2"
                  placeholder="مثال: پلاک ۱، واحد ۲"
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
                  <ArrowRight className="w-4 h-4 ml-2" />
                  بازگشت به نقشه
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "تأیید و ثبت نهایی"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
