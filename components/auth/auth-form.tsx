"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ApiError } from "../../lib/api-client";
import { getMe, requestOtp, verifyOtp } from "../../services/auth-api";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";

type Props = {
  nextPath: string;
};

type Lang = "en" | "fa";

const content = { en, fa };

export function AuthForm({ nextPath }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const googleLoginUrl = useMemo(
    () => `/api/auth/google/login?next=${encodeURIComponent(nextPath)}`,
    [nextPath]
  );
  const t = useMemo(() => content[lang].auth, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem("waggy_lang");
    if (saved === "fa" || saved === "en") {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("waggy_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  const handleRequestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await requestOtp({ phone });
      setOtpRequested(true);
      setMessage(response.message || t.messages.otpSent);
    } catch (error) {
      const text = error instanceof ApiError ? `${t.messages.otpRequestFailed} (${error.status})` : t.messages.otpRequestFailed;
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
      const token = await verifyOtp({ phone, otp });
      let displayName = phone;
      try {
        const me = await getMe(token.access_token);
        displayName = me.phone_e164 || phone;
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
      const text = error instanceof ApiError ? `${t.messages.otpVerifyFailed} (${error.status})` : t.messages.otpVerifyFailed;
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell">
      <article className="auth-showcase card">
        <div className="lang-switch" role="group" aria-label="language">
          <button className={lang === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "fa" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("fa")}>FA</button>
        </div>
        <h2>{t.showcase.title}</h2>
        <p>{t.showcase.subtitle}</p>
        <ul className="auth-list">
          {t.showcase.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="auth-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1400&q=80"
            alt={t.showcase.imageAlt}
            className="auth-image"
            loading="lazy"
          />
        </div>
      </article>

      <article className="panel auth-panel">
        <div className="auth-brand-row">
          <Link href="/" className="brand">Waggy</Link>
          <Link href="/" className="btn btn-secondary">{t.backHome}</Link>
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>

        {!otpRequested ? (
          <form onSubmit={handleRequestOtp} className="auth-form auth-form-wide">
            <label htmlFor="phone">{t.phoneLabel}</label>
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
            <div className="auth-actions-stack">
              <button type="submit" className="btn btn-primary auth-main-btn" disabled={loading}>
                {loading ? t.sending : t.requestOtp}
              </button>
              <a href={googleLoginUrl} className="btn btn-accent auth-main-btn">
                {t.google}
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form auth-form-wide">
            <label htmlFor="otp">{t.otpLabel}</label>
            <input
              id="otp"
              name="otp"
              type="text"
              className="text-input"
              placeholder={t.otpPlaceholder}
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
            />
            <div className="auth-actions-stack">
              <button type="submit" className="btn btn-primary auth-main-btn" disabled={loading}>
                {loading ? t.verifying : t.verifyOtp}
              </button>
              <button
                type="button"
                className="btn btn-secondary auth-main-btn"
                onClick={() => {
                  setOtpRequested(false);
                  setOtp("");
                }}
              >
                {t.changePhone}
              </button>
            </div>
          </form>
        )}

        {message ? <p className="note auth-note">{message}</p> : null}
      </article>
    </section>
  );
}
