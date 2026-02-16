"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ApiError } from "../../lib/api-client";
import { getMe, requestOtp, verifyOtp } from "../../services/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  nextPath: string;
};

type Step = "phone" | "otp";

export function AuthForm({ nextPath }: Props) {
  const t = {
    brand: "واگی",
    title: "خوشحالیم که برگشتی!",
    subtitle: "شماره موبایل رو وارد کن تا رمز یکبارمصرف برات ارسال بشه.",
    cardTitle: "ورود با شماره موبایل",
    phoneLabel: "شماره موبایل",
    phonePlaceholder: "مثلاً ۹۱۲ ۱۲۳ ۴۵۶۷",
    sendCode: "ارسال کد تأیید",
    or: "یا",
    google: "ورود با گوگل",
    terms: "با ادامه، شما با قوانین و سیاست حریم خصوصی ما موافقت می‌کنید.",
    trouble: "مشکلی در ورود داری؟",
    support: "پشتیبانی",
    otpTitle: "کد تأیید را وارد کنید",
    otpSubtitle: "کد ۶ رقمی به این شماره ارسال شد:",
    codeLabel: "کد تأیید",
    codePlaceholder: "کد ۶ رقمی",
    verify: "تأیید و ادامه",
    resend: "ارسال مجدد کد",
    editPhone: "ویرایش شماره",
    sending: "در حال ارسال...",
    verifying: "در حال تایید...",
    backHome: "بازگشت به خانه",
    points: [
      "پروفایل مراقبین تاییدشده",
      "پرداخت امن در پلتفرم",
      "پشتیبانی پاسخگو ۲۴/۷"
    ],
    imageAlt: "مراقب در حال نگهداری از سگ",
    otpSent: "کد تایید ارسال شد.",
    otpRequestFailed: "ارسال کد تایید ناموفق بود",
    otpVerifyFailed: "تایید کد ناموفق بود"
  } as const;

  const [step, setStep] = useState<Step>("phone");
  const [countryCode, setCountryCode] = useState("+98");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const googleLoginUrl = useMemo(
    () => `/api/auth/google/login?next=${encodeURIComponent(nextPath)}`,
    [nextPath]
  );
  const normalizedPhone = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    return `${countryCode}${digits}`;
  }, [countryCode, phone]);
  const maskedPhone = useMemo(() => {
    const digits = submittedPhone.replace(/\D/g, "");
    if (!digits) return `${countryCode} ***`;
    return `${countryCode} *** ${digits.slice(-4)}`;
  }, [submittedPhone, countryCode]);

  useEffect(() => {
    localStorage.setItem("waggy_lang", "fa");
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
  }, []);

  const handleRequestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await requestOtp({ phone: normalizedPhone });
      setSubmittedPhone(normalizedPhone);
      setStep("otp");
      setMessage(response.message || t.otpSent);
    } catch (error) {
      const text = error instanceof ApiError ? `${t.otpRequestFailed} (${error.status})` : t.otpRequestFailed;
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = await verifyOtp({ phone: submittedPhone, otp });
      let displayName = submittedPhone;
      try {
        const me = await getMe(token.access_token);
        displayName = me.phone_e164 || submittedPhone;
      } catch {
        // Keep phone as fallback name when /me is unavailable
      }

      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "user",
          name: displayName,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          access_expires_in: token.expires_in
        })
      });

      if (!sessionResponse.ok) {
        throw new Error("Failed to create local session");
      }

      window.location.href = nextPath;
    } catch (error) {
      const text = error instanceof ApiError ? `${t.otpVerifyFailed} (${error.status})` : t.otpVerifyFailed;
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!submittedPhone) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await requestOtp({ phone: submittedPhone });
      setMessage(response.message || t.otpSent);
    } catch (error) {
      const text = error instanceof ApiError ? `${t.otpRequestFailed} (${error.status})` : t.otpRequestFailed;
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-[18px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4 items-stretch">
      <article className="relative grid content-start gap-3 rounded-[26px] overflow-hidden bg-[#f6fbfb] p-6 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(14,165,164,0.16),rgba(255,255,255,0)_56%),radial-gradient(100%_100%_at_100%_100%,rgba(255,107,107,0.1),rgba(255,255,255,0)_44%)]">
        <div className="inline-flex items-center justify-center w-fit px-3 py-1.5 rounded-full bg-[#0e7c7b] text-white text-xs font-semibold">
          FA | +98
        </div>
        <h2 className="mt-1.5 text-4xl leading-tight text-[#123749] font-bold rtl:text-[36px]">{t.title}</h2>
        <p className="text-neutral-600 m-0">{t.subtitle}</p>
        <ul className="mt-1 ps-[18px] text-neutral-600 list-none">
          {t.points.map((point) => (
            <li key={point} className="mt-1.5 relative before:content-['•'] before:absolute before:-right-4 before:text-neutral-400">{point}</li>
          ))}
        </ul>
        <div className="mt-2">
          <img
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1400&q=80"
            alt={t.imageAlt}
            className="w-full h-[250px] object-cover rounded-[14px] border border-[#d8e6e8] block lg:h-[210px]"
            loading="lazy"
          />
        </div>
        <div className="mt-2 text-sm text-neutral-600">
          {t.trouble} <a className="text-primary font-semibold hover:underline" href="#">{t.support}</a>
        </div>
      </article>

      <article className="bg-white rounded-[26px] p-6 border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between gap-2.5 mb-2.5">
          <div className="text-[22px] font-bold tracking-tight text-neutral-800">{t.brand}</div>
          <Link href="/landing">
            <Button variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
              {t.backHome}
            </Button>
          </Link>
        </div>
        <div className="text-sm font-medium text-neutral-600 mb-4">{t.cardTitle}</div>
        {step === "phone" ? (
          <form onSubmit={handleRequestOtp} className="grid gap-3 max-w-none">
            <Label htmlFor="phone" className="text-sm text-neutral-600 font-normal">{t.phoneLabel}</Label>
            <div className="flex flex-col lg:flex-row gap-2">
              <select
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value)}
                className="w-full lg:w-[110px] h-auto p-3 text-sm rounded-[12px] border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-150"
                aria-label="country code"
              >
                <option value="+98">+98</option>
                <option value="+90">+90</option>
                <option value="+971">+971</option>
                <option value="+44">+44</option>
              </select>
              <Input
                id="phone"
                name="phone"
                type="text"
                className="h-auto p-3 rounded-[12px] border-neutral-200 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:ring-4"
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            <div className="mt-1.5 grid gap-2.5">
              <Button type="submit" className="w-full h-auto min-h-[44px] rounded-[12px] text-sm font-medium py-3 px-5 shadow-sm bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? t.sending : t.sendCode}
              </Button>
            </div>
            <div className="my-2 flex items-center gap-2.5 text-neutral-400 text-xs">
              <div className="h-px flex-1 bg-neutral-200" />
              <span>{t.or}</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>
            <a href={googleLoginUrl}>
              <Button variant="default" className="w-full h-auto min-h-[44px] rounded-[12px] text-sm font-medium py-3 px-5 shadow-sm bg-accent hover:bg-accent/90 text-white">
                {t.google}
              </Button>
            </a>
            <p className="mt-1 text-neutral-400 text-xs leading-relaxed">{t.terms}</p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="grid gap-3 max-w-none">
            <div className="text-xl font-bold text-neutral-800">{t.otpTitle}</div>
            <div className="text-sm text-neutral-600">
              {t.otpSubtitle} <span className="font-semibold text-neutral-800 ltr:inline-block">{maskedPhone}</span>
            </div>
            <Label htmlFor="otp" className="text-sm text-neutral-600 font-normal">{t.codeLabel}</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              className="h-auto p-3 rounded-[12px] border-neutral-200 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:ring-4"
              placeholder={t.codePlaceholder}
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
            />
            <Button type="submit" className="w-full h-auto min-h-[44px] rounded-[12px] text-sm font-medium py-3 px-5 shadow-sm bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? t.verifying : t.verify}
            </Button>
            <div className="mt-1 flex items-center justify-between">
              <button type="button" className="bg-transparent border-0 text-primary p-0 cursor-pointer text-sm font-medium hover:underline" onClick={handleResendOtp}>
                {t.resend}
              </button>
              <button
                type="button"
                className="bg-transparent border-0 text-neutral-600 p-0 cursor-pointer text-sm font-medium hover:underline"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
              >
                {t.editPhone}
              </button>
            </div>
          </form>
        )}

        {message ? <p className="mt-3.5 text-sm text-neutral-600">{message}</p> : null}
      </article>
    </section>
  );
}
