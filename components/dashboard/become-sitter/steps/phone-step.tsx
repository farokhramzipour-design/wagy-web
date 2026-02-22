"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { requestPhoneOtp, verifyPhoneOtp } from "@/services/profile-api";
import { ArrowRight, Loader2, Phone, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const content = { en, fa };

interface PhoneStepProps {
  token: string;
}

export function PhoneStep({ token }: PhoneStepProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = content[lang].becomeSitter.phonePage;

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error(t.errorRequest); // You might want a specific error for invalid phone format
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestPhoneOtp({ phone }, token);
      setStep("otp");
      setCountdown(response.expires_in || 120); // Default to 120s if not provided
      toast.success(response.message || t.success);
    } catch (error) {
      console.error("Failed to request OTP:", error);
      toast.error(t.errorRequest);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error(t.errorVerify);
      return;
    }

    setIsLoading(true);
    try {
      await verifyPhoneOtp({ phone, otp }, token);
      toast.success(t.success);
      router.push("/app/become-sitter");
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast.error(t.errorVerify);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setStep("phone");
    setOtp("");
    setCountdown(0);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t.inputLabel}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
                  <Input
                    id="phone"
                    placeholder={t.inputPlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 rtl:pr-9 rtl:pl-3 text-left dir-ltr"
                    dir="ltr"
                    type="tel"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                    {t.requestButton}
                  </>
                ) : (
                  <>
                    {t.requestButton}
                    <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="otp">{t.otpLabel}</Label>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground"
                    onClick={handleChangeNumber}
                    type="button"
                  >
                    {t.changeNumber}
                  </Button>
                </div>
                <Input
                  id="otp"
                  type="text"
                  dir="ltr"
                  placeholder={t.otpPlaceholder}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length <= 6) setOtp(value);
                  }}
                  className="text-center text-2xl tracking-[0.5em]"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                      {t.verifyButton}
                    </>
                  ) : (
                    t.verifyButton
                  )}
                </Button>

                {countdown > 0 ? (
                  <p className="text-xs text-center text-muted-foreground" dir="ltr">
                    {t.countdown.replace("{seconds}", formatTime(countdown))}
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={handleRequestOtp}
                    disabled={isLoading}
                  >
                    <RotateCcw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                    {t.resendButton}
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
