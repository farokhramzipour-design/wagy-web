"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";
import { googleLoginStub, requestOtpStub, verifyOtpStub } from "@/services/auth-service";
import { useAppStore } from "@/stores/app-store";

const phoneSchema = z.object({
  phone: z.string().min(8)
});

const otpSchema = z.object({
  code: z.string().length(6)
});

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useAppTranslation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [timer, setTimer] = useState(60);
  const loginAsUser = useAppStore((s) => s.loginAsUser);
  const loginAsAdmin = useAppStore((s) => s.loginAsAdmin);

  const safeNext = useMemo(() => {
    const next = params.get("next");
    if (!next) return "/app/dashboard";
    if (!next.startsWith("/")) return "/app/dashboard";
    return next;
  }, [params]);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" }
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" }
  });

  useEffect(() => {
    if (step !== "otp") return;
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [step, timer]);

  const establishSession = async (payload: { role: "user" | "admin"; name: string; token: string; refreshToken: string }) => {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: payload.role,
        name: payload.name,
        access_token: payload.token,
        refresh_token: payload.refreshToken,
        access_expires_in: 3600
      })
    });

    if (!response.ok) throw new Error("SESSION_FAILED");

    if (payload.role === "admin") {
      loginAsAdmin();
      router.push("/admin/overview");
      return;
    }

    loginAsUser();
    router.push(safeNext);
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    await requestOtpStub(values);
    setPhone(values.phone);
    setStep("otp");
    setTimer(60);
  };

  const onOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    const result = await verifyOtpStub({ phone, code: values.code });
    await establishSession(result);
  };

  const onGoogle = async () => {
    const result = await googleLoginStub();
    await establishSession(result);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.title")}</CardTitle>
        <CardDescription>{t("auth.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "phone" ? (
          <form className="space-y-3" onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
            <label className="text-sm">{t("auth.phoneLabel")}</label>
            <Input placeholder={t("auth.phonePlaceholder")} {...phoneForm.register("phone")} />
            <Button className="w-full" type="submit">
              {t("auth.requestOtp")}
            </Button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
            <label className="text-sm">{t("auth.otpLabel")}</label>
            <Input maxLength={6} placeholder={t("auth.otpPlaceholder")} {...otpForm.register("code")} />
            <Button className="w-full" type="submit">
              {t("auth.verifyOtp")}
            </Button>
            {timer > 0 ? (
              <p className="text-center text-xs text-muted-foreground">{t("auth.resendIn", { seconds: timer })}</p>
            ) : (
              <Button type="button" variant="ghost" className="w-full" onClick={() => setTimer(60)}>
                {t("auth.resend")}
              </Button>
            )}
          </form>
        )}

        <Button variant="secondary" className="w-full" onClick={onGoogle}>
          {t("auth.google")}
        </Button>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => establishSession({ role: "user", name: "Behnam", token: "demo-user", refreshToken: "demo" })}
          >
            {t("auth.switchOwner")}
          </Button>
          <Button
            variant="outline"
            onClick={() => establishSession({ role: "admin", name: "Admin Jane", token: "demo-admin", refreshToken: "demo" })}
          >
            {t("auth.switchUser")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
