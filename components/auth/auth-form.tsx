"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ApiError } from "../../lib/api-client";
import { getMe, requestOtp, verifyOtp } from "../../services/auth-api";

type Props = {
  nextPath: string;
};

export function AuthForm({ nextPath }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const googleLoginUrl = useMemo(
    () => `/api/auth/google/login?next=${encodeURIComponent(nextPath)}`,
    [nextPath]
  );

  const handleRequestOtp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await requestOtp({ phone });
      setOtpRequested(true);
      setMessage(response.message || "OTP sent.");
    } catch (error) {
      const text = error instanceof ApiError ? `OTP request failed (${error.status})` : "OTP request failed";
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
      const text = error instanceof ApiError ? `OTP verify failed (${error.status})` : "OTP verify failed";
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h1>Welcome back</h1>
      <p>Quick sign-in, warm support, and trusted care for your best friend.</p>

      {!otpRequested ? (
        <form onSubmit={handleRequestOtp} className="auth-form">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            className="text-input"
            placeholder="+989121234567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Request OTP"}
            </button>
            <a href={googleLoginUrl} className="btn btn-accent">
              Continue with Google
            </a>
            <Link href="/" className="btn btn-secondary">
              Back Home
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="auth-form">
          <label htmlFor="otp">OTP code</label>
          <input
            id="otp"
            name="otp"
            type="text"
            className="text-input"
            placeholder="123456"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            required
          />
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setOtpRequested(false);
                setOtp("");
              }}
            >
              Change phone
            </button>
          </div>
        </form>
      )}

      {message ? <p className="note">{message}</p> : null}
    </section>
  );
}
