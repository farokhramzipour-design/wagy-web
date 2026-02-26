"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { LandingCharityCard } from "@/components/landing/landing-charity-card";
import { charityPublicApi } from "@/services/charity-public-api";
import { CharityCase } from "@/types/charity-public";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export function CharitySection() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;
  const [cases, setCases] = useState<CharityCase[]>([]);

  useEffect(() => {
    // Fetch limited number of cases for the landing page
    const fetchCases = async () => {
      // Mock data for landing page as requested
      const mockCases: CharityCase[] = [
        {
          charity_case_id: 101,
          title: "نجات گلدن رتریور آسیب‌دیده از تصادف جاده‌ای",
          status: "active",
          primary_media_id: 0,
          target_amount_minor: 50000000,
          collected_amount_minor: 12500000,
          remaining_minor: 37500000,
          progress_percent: 25,
          currency_code: "IRR",
          expires_at: new Date(Date.now() + 86400000 * 10).toISOString(),
          can_accept_donations: true,
          cover_image_url: "/images/charity-dog.jpg",
          province_id: 1,
          city_id: 1,
          location_text: "Tehran",
          incident_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          can_edit: false,
          can_delete: false,
          can_submit: false
        },
        {
          charity_case_id: 102,
          title: "درمان گربه خیابانی مبتلا به بیماری پارو ویروس",
          status: "active",
          primary_media_id: 0,
          target_amount_minor: 15000000,
          collected_amount_minor: 8000000,
          remaining_minor: 7000000,
          progress_percent: 53,
          currency_code: "IRR",
          expires_at: new Date(Date.now() + 86400000 * 5).toISOString(),
          can_accept_donations: true,
          cover_image_url: "/images/charity-cat.jpg",
          province_id: 1,
          city_id: 1,
          location_text: "Tehran",
          incident_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          can_edit: false,
          can_delete: false,
          can_submit: false
        }
      ];
      setCases(mockCases);
    };
    fetchCases();
  }, []);

  if (cases.length === 0) return null;

  return (
    <section className="py-20 bg-[#FFF8F8]">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          {/* Text Block - Right Aligned in RTL */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-medium">
              <Heart className="w-4 h-4 fill-rose-600" />
              <span>{t.pageTitle}</span>
            </div>
            <h2 className="text-3xl md:text-[32px] font-bold text-[#1A1A2E] leading-tight">
              {t.landing.title}
            </h2>
            <p className="text-lg text-gray-500">
              {t.landing.subtitle}
            </p>
          </div>
          
          {/* Button - Left Aligned in RTL */}
          <Link href="/charity">
            <Button className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white gap-2 h-12 px-8 rounded-full shadow-lg shadow-rose-200 transition-all hover:scale-105">
              {t.landing.cta}
              {lang === "fa" ? <ArrowRight className="rotate-180 w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((charityCase) => (
            <LandingCharityCard key={charityCase.charity_case_id} charityCase={charityCase} />
          ))}
        </div>
      </div>
    </section>
  );
}
