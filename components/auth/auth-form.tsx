"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ApiError } from "../../lib/api-client";
import { getMe, requestOtp, verifyOtp } from "../../services/auth-api";

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
    <section className="auth-shell">
      <article className="auth-showcase card">
        <div className="auth-top-chip">
          FA | +98
        </div>
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
        <ul className="auth-list">
          {t.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="auth-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1400&q=80"
            alt={t.imageAlt}
            className="auth-image"
            loading="lazy"
          />
        </div>
        <div className="auth-help-note">
          {t.trouble} <a className="auth-help-link" href="#">{t.support}</a>
        </div>
      </article>

      <article className="panel auth-panel">
        <div className="auth-brand-row">
          <div className="brand">{t.brand}</div>
          <Link href="/landing" className="btn btn-secondary">{t.backHome}</Link>
        </div>
        <div className="auth-card-title">{t.cardTitle}</div>
        {step === "phone" ? (
          <form onSubmit={handleRequestOtp} className="auth-form auth-form-wide">
            <label htmlFor="phone">{t.phoneLabel}</label>
            <div className="auth-phone-row">
              <select
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value)}
                className="text-input auth-country"
                aria-label="country code"
              >
                <option value="+98">+98</option>
                <option value="+90">+90</option>
                <option value="+971">+971</option>
                <option value="+44">+44</option>
              </select>
              <input
                id="phone"
                name="phone"
                type="text"
                className="text-input"
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            <div className="auth-actions-stack">
              <button type="submit" className="btn btn-primary auth-main-btn" disabled={loading}>
                {loading ? t.sending : t.sendCode}
              </button>
            </div>
            <div className="auth-or">
              <div className="auth-or-line" />
              <span>{t.or}</span>
              <div className="auth-or-line" />
            </div>
            <a href={googleLoginUrl} className="btn btn-accent auth-main-btn">
              {t.google}
            </a>
            <p className="auth-terms">{t.terms}</p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form auth-form-wide">
            <div className="auth-otp-title">{t.otpTitle}</div>
            <div className="auth-otp-subtitle">
              {t.otpSubtitle} <span className="auth-otp-phone">{maskedPhone}</span>
            </div>
            <label htmlFor="otp">{t.codeLabel}</label>
            <input
              id="otp"
              name="otp"
              type="text"
              className="text-input"
              placeholder={t.codePlaceholder}
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary auth-main-btn" disabled={loading}>
              {loading ? t.verifying : t.verify}
            </button>
            <div className="auth-otp-actions">
              <button type="button" className="link-button" onClick={handleResendOtp}>
                {t.resend}
              </button>
              <button
                type="button"
                className="link-button muted"
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

        {message ? <p className="note auth-note">{message}</p> : null}
      </article>
    </section>
  );
}
