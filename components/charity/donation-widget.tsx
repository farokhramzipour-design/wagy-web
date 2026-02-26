"use client";

import { toEnglishDigits } from "@/components/charity/charity-utils";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { charityPublicApi } from "@/services/charity-public-api";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const content = { en, fa };

interface DonationWidgetProps {
  caseId: number;
  currency?: string;
  isLoggedIn: boolean;
  className?: string;
}

export function DonationWidget({ caseId, currency = "IRR", isLoggedIn, className }: DonationWidgetProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;
  const router = useRouter();
  const pathname = usePathname();

  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Predefined amounts from HTML or logic (500k, 1m, 2m, 5m IRR)
  const predefinedAmounts = [500000, 1000000, 2000000, 5000000];

  const handleDonate = async () => {
    if (!isLoggedIn) {
      toast.error(t.loginToDonate);
      router.push(`/auth?next=${pathname}`);
      return;
    }

    const value = parseInt(amount, 10);
    if (!value || value <= 0) {
      toast.error(lang === "fa" ? "لطفا مبلغ معتبری وارد کنید" : "Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      await charityPublicApi.donate({
        charity_case_id: caseId,
        amount_minor: value,
        currency_code: currency,
      });
      toast.success(t.donationDialog.success);
      setAmount("");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.donationDialog.error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = toEnglishDigits(e.target.value).replace(/[^0-9]/g, "");
    setAmount(raw);
  };

  const displayValue = amount ? parseInt(amount).toLocaleString(lang === "fa" ? "fa-IR" : "en-US") : "";

  return (
    <div className={cn("bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm opacity-0 animate-[fadeUp_0.5s_0.2s_ease_both]", className)} style={{ animationFillMode: "both" }}>
      <h3 className="text-[17px] font-extrabold text-[#103745] mb-[18px] text-center">
        {lang === "fa" ? "مبلغ حمایت خود را وارد کنید" : "Enter donation amount"}
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-3.5">
        {predefinedAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setAmount(amt.toString())}
            className={cn(
              "py-[9px] px-1.5 border-[1.5px] rounded-[10px] bg-white text-[13px] font-bold cursor-pointer transition-all duration-200 text-center",
              amount === amt.toString()
                ? "border-[#0ea5a4] bg-[#e0f7f7] text-[#0b7c7b]"
                : "border-neutral-200 text-[#3d5a63] hover:border-[#0ea5a4] hover:bg-[#e0f7f7] hover:text-[#0b7c7b]"
            )}
          >
            {formatNumber(amt)}
          </button>
        ))}
      </div>

      <div className="relative mb-3.5">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          className="w-full h-12 border-[1.5px] border-neutral-200 rounded-xl pl-4 pr-[60px] text-base font-bold text-[#103745] text-right bg-[#f7fbfb] focus:outline-none focus:border-[#0ea5a4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,164,0.1)] transition-colors duration-200"
          placeholder="0"
          dir="ltr"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6b8a93] bg-white px-1.5 py-0.5 rounded-[5px] border border-neutral-200">
          {currency}
        </span>
      </div>

      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full h-[50px] bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] text-white border-none rounded-xl text-base font-extrabold cursor-pointer transition-all duration-200 shadow-[0_6px_20px_rgba(255,107,107,0.4)] hover:-translate-y-[2px] hover:shadow-[0_10px_28px_rgba(255,107,107,0.5)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? (lang === "fa" ? "در حال پردازش..." : "Processing...") : (lang === "fa" ? "پرداخت آنلاین" : "Donate Now")}
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-[#6b8a93]">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        <span>{lang === "fa" ? "پرداخت امن با زرین‌پال" : "Secure payment via ZarinPal"}</span>
      </div>
    </div>
  );
}
