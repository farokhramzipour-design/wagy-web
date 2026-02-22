"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ApiError } from "../../lib/api-client";
import { getMe, requestOtp, verifyOtp } from "../../services/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Check, KeyRound, Loader2, Phone, RefreshCw, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

type Props = {
  nextPath: string;
};

type Step = "phone" | "otp";

export function AuthForm({ nextPath }: Props) {
  const { setLang } = useLanguage();

  const t = {
    title: "خوشحالیم که برگشتی!",
    cardTitle: "ورود | ثبت‌نام",
    phoneLabel: "شماره موبایل",
    phonePlaceholder: "۹۱۲ ۱۲۳ ۴۵۶۷",
    sendCode: "ارسال کد تأیید",
    or: "یا",
    google: "ورود با حساب گوگل",
    terms: "با ورود به واگی، شرایط و قوانین استفاده را می‌پذیرم.",
    otpTitle: "تأیید شماره موبایل",
    otpSubtitle: "کد ۶ رقمی ارسال شده به شماره زیر را وارد کنید",
    codeLabel: "کد تأیید",
    codePlaceholder: "______",
    verify: "تأیید و ورود",
    resend: "ارسال مجدد کد",
    resendTimer: (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `ارسال مجدد (${mins}:${secs.toString().padStart(2, '0')})`;
    },
    editPhone: "ویرایش شماره",
    sending: "در حال ارسال...",
    verifying: "در حال بررسی...",
    otpSent: "کد تأیید با موفقیت ارسال شد",
    otpRequestFailed: "ارسال کد ناموفق بود",
    otpVerifyFailed: "کد وارد شده صحیح نیست",
    imageAlt: "مراقب در حال نگهداری از سگ"
  } as const;

  const [step, setStep] = useState<Step>("phone");
  const [countryCode] = useState("+98");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);
  
  const googleLoginUrl = useMemo(
    () => `/api/auth/google/login?next=${encodeURIComponent(nextPath)}`,
    [nextPath]
  );

  const normalizedPhone = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    const cleanDigits = digits.startsWith("0") ? digits.substring(1) : digits;
    return `${countryCode}${cleanDigits}`;
  }, [countryCode, phone]);

  const maskedPhone = useMemo(() => {
    const digits = submittedPhone.replace(/\D/g, "");
    if (!digits) return `${countryCode} ***`;
    return `${countryCode} *** ${digits.slice(-4)}`;
  }, [submittedPhone, countryCode]);

  useEffect(() => {
    setLang("fa");
  }, []);

  const handleRequestOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (!phone) return;
    
    setLoading(true);
    setMessage("");
    setMessageType("");
    try {
      const response = await requestOtp({ phone: normalizedPhone });
      setSubmittedPhone(normalizedPhone);
      setStep("otp");
      setResendTimer(120);
      setMessage(response.message || t.otpSent);
      setMessageType("success");
      // Auto focus OTP input logic could go here
    } catch (error) {
      const text = error instanceof ApiError ? `${t.otpRequestFailed} (${error.status})` : t.otpRequestFailed;
      setMessage(text);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (otp.length < 6) return;

    setLoading(true);
    setMessage("");
    setMessageType("");
    try {
      const token = await verifyOtp({ phone: submittedPhone, otp });
      setIsSuccess(true);
      
      let displayName = submittedPhone;
      let isAdmin = false;
      let adminRole: string | null = null;
      let isProvider = false;
      let phone: string | null = null;
      try {
        const me = await getMe(token.access_token);
        console.log("Me Response:", me); // Debugging
        displayName = me.phone_e164 || submittedPhone;
        isAdmin = me.is_admin;
        adminRole = me.admin_role?.toLowerCase() || null;
        isProvider = me.is_provider;
        phone = me.phone_e164 || submittedPhone;
      } catch (e) {
        console.error("Failed to fetch me:", e);
      }

      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: isAdmin ? "admin" : "user",
          name: displayName,
          isAdmin,
          adminRole,
          isProvider,
          phone,
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
      setMessageType("error");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!submittedPhone) return;
    setLoading(true);
    setMessage("");
    setMessageType("");
    try {
      const response = await requestOtp({ phone: submittedPhone });
      setResendTimer(120);
      setMessage(response.message || t.otpSent);
      setMessageType("success");
    } catch (error) {
      const text = error instanceof ApiError ? `${t.otpRequestFailed} (${error.status})` : t.otpRequestFailed;
      setMessage(text);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12 z-10 w-full px-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#123749] mb-3 tracking-tight">
          {t.title}
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full relative group perspective-1000">
        {/* Decorative elements behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#0e7c7b] to-[#123749] rounded-[30px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-[28px] shadow-2xl border border-white/50 w-full animate-in fade-in zoom-in-95 duration-500">
          
          {/* Avatar/Image floating at top center of card content */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden hidden sm:block z-20">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80"
              alt={t.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            {step === "phone" ? (
              <form onSubmit={handleRequestOtp} className="space-y-6 animate-in slide-in-from-right-8 duration-500 pt-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#123749] mb-1">{t.cardTitle}</h3>
                  <div className="h-1 w-12 bg-[#0e7c7b] rounded-full mx-auto" />
                </div>

                <div className="space-y-4">
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-focus-within/input:text-[#0e7c7b] transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="h-14 pr-10 pl-4 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-[#0e7c7b] focus:ring-[#0e7c7b]/20 transition-all font-medium text-lg placeholder:text-slate-400 text-left dir-ltr"
                      placeholder={t.phonePlaceholder}
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.startsWith("0")) {
                           setPhone(val.substring(1));
                        } else {
                           setPhone(val.slice(0, 10));
                        }
                      }}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className={cn(
                    "w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-[#0e7c7b]/20 bg-[#0e7c7b] hover:bg-[#0b6b6a] text-white transition-all active:scale-[0.98]",
                    loading && "opacity-80 cursor-not-allowed"
                  )}
                  disabled={loading || !phone || phone.length !== 10}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      {t.sendCode}
                      <ArrowLeft className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-medium">
                      {t.or}
                    </span>
                  </div>
                </div>

                <a href={googleLoginUrl} className="block w-full group/google">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-14 rounded-xl text-base font-medium border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5 group-hover/google:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {t.google}
                  </Button>
                </a>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-8 duration-500 pt-8">
                <div>
                   <h3 className="text-xl font-bold text-[#123749] mb-1">{t.otpTitle}</h3>
                   <div className="flex items-center gap-2 text-sm text-slate-500">
                     <span>{t.otpSubtitle}</span>
                   </div>
                   <div className="flex items-center gap-2 mt-2 bg-slate-50 p-2 rounded-lg w-fit border border-slate-100" dir="ltr">
                     <span className="font-bold text-[#0e7c7b] text-lg">{maskedPhone}</span>
                     <button
                        type="button"
                        className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-600"
                        onClick={() => {
                          setStep("phone");
                          setOtp("");
                          setMessage("");
                        }}
                        title={t.editPhone}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="relative group/input">
                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-focus-within/input:text-[#0e7c7b] transition-colors">
                        <KeyRound className="w-5 h-5" />
                     </div>
                     <Input
                       id="otp"
                       name="otp"
                       type="text"
                       inputMode="numeric"
                       className="h-14 text-center text-3xl tracking-[0.5em] rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-[#0e7c7b] focus:ring-[#0e7c7b]/20 transition-all font-bold text-[#123749] placeholder:text-slate-300 placeholder:tracking-[0.2em]"
                       placeholder={t.codePlaceholder}
                       value={otp}
                       onChange={(e) => {
                         const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                         setOtp(val);
                       }}
                       maxLength={6}
                       required
                       autoFocus
                     />
                   </div>
                </div>

                <Button 
                  type="submit" 
                  className={cn(
                    "w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-[#0e7c7b]/20 bg-[#0e7c7b] hover:bg-[#0b6b6a] text-white transition-all active:scale-[0.98]",
                    loading && "opacity-80 cursor-not-allowed",
                    isSuccess && "bg-green-600 hover:bg-green-600 shadow-green-600/20"
                  )}
                  disabled={loading || otp.length < 6}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isSuccess ? (
                    <div className="flex items-center gap-2">
                       <Check className="w-6 h-6" />
                       {t.verify}
                    </div>
                  ) : (
                    t.verify
                  )}
                </Button>

                <div className="flex justify-center">
                  <button 
                    type="button" 
                    className={cn(
                      "flex items-center gap-2 text-[#0e7c7b] text-sm font-semibold hover:bg-[#0e7c7b]/5 px-3 py-2 rounded-lg transition-colors",
                      (loading || resendTimer > 0) && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={handleResendOtp}
                    disabled={loading || resendTimer > 0}
                  >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin", resendTimer > 0 && "hidden")} />
                    {resendTimer > 0 ? t.resendTimer(resendTimer) : t.resend}
                  </button>
                </div>
              </form>
            )}
            
            {/* Message Display */}
            {message && !isSuccess ? (
               <div className={cn(
                 "mt-6 p-4 rounded-xl text-sm flex items-center justify-center gap-2 font-medium border animate-in fade-in slide-in-from-top-2",
                 messageType === "success" 
                   ? "bg-green-50 text-green-700 border-green-100" 
                   : "bg-red-50 text-red-600 border-red-100"
               )}>
                 <div className={cn(
                   "w-1.5 h-1.5 rounded-full",
                   messageType === "success" ? "bg-green-500" : "bg-red-500"
                 )} />
                 {message}
               </div>
            ) : null}

             {/* Footer Terms */}
            <div className="mt-8 text-center">
               <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                 با ورود به واگی،{" "}
                 <Link href="/terms" className="text-[#0e7c7b] hover:underline font-medium">
                   شرایط و قوانین استفاده
                 </Link>{" "}
                 را می‌پذیرم.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
