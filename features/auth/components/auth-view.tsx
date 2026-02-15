"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { authService, otpSchema, phoneSchema } from "@/services/auth-service";
import { useAppStore } from "@/stores/app-store";

type PhoneValues = z.infer<typeof phoneSchema>;
type OtpValues = z.infer<typeof otpSchema>;

export function AuthView() {
  const { t } = useTranslation();
  const router = useRouter();
  const loginAsUser = useAppStore((state) => state.loginAsUser);
  const loginAsAdmin = useAppStore((state) => state.loginAsAdmin);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [timer, setTimer] = useState(45);

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" }
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  });

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const id = setInterval(() => setTimer((sec) => sec - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const canResend = useMemo(() => timer <= 0, [timer]);

  const handlePhone = phoneForm.handleSubmit(async (values) => {
    await authService.requestOtp(values.phone);
    setTimer(45);
    setStep("otp");
  });

  const handleOtp = otpForm.handleSubmit(async (values) => {
    const result = await authService.verifyOtp(values.otp);
    if (result.ok) {
      loginAsUser();
      router.push("/app/dashboard");
    }
  });

  const handleGoogle = async () => {
    await authService.loginWithGoogle();
    loginAsUser();
    router.push("/app/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t("auth.title")}</CardTitle>
            <LanguageSwitcher />
          </div>
          <CardDescription>{t("auth.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <form className="space-y-3" onSubmit={handlePhone}>
              <label className="text-sm font-medium">{t("auth.phoneTitle")}</label>
              <Input {...phoneForm.register("phone")} placeholder={t("auth.phonePlaceholder")} />
              <Button className="w-full" type="submit">{t("auth.sendOtp")}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("otp")}>
                {t("auth.switchToOtp")}
              </Button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={handleOtp}>
              <label className="text-sm font-medium">{t("auth.otpTitle")}</label>
              <Input maxLength={6} {...otpForm.register("otp")} placeholder={t("auth.otpPlaceholder")} />
              <Button className="w-full" type="submit">{t("auth.verifyOtp")}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                {t("auth.switchToPhone")}
              </Button>
              <Button
                type="button"
                disabled={!canResend}
                variant="outline"
                className="w-full"
                onClick={() => setTimer(45)}
              >
                {canResend ? t("auth.resend") : t("auth.resendIn", { seconds: timer })}
              </Button>
            </form>
          )}

          <Button variant="secondary" className="w-full" onClick={handleGoogle}>
            {t("auth.google")}
          </Button>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={() => {
                loginAsUser();
                router.push("/app/dashboard");
              }}
            >
              {t("auth.demoUser")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                loginAsAdmin();
                router.push("/admin/overview");
              }}
            >
              {t("auth.demoAdmin")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
