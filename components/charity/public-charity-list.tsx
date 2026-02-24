"use client";

import { PublicCharityCard } from "@/components/charity/public-charity-card";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { charityPublicApi } from "@/services/charity-public-api";
import { CharityCase } from "@/types/charity-public";
import { Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const content = { en, fa };

export function PublicCharityList() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;

  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<CharityCase[]>([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await charityPublicApi.getCases();
      setCases(data || []);
    } catch (error) {
      console.error("Failed to fetch cases", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-rose-50 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-100/50 via-transparent to-transparent opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-rose-600 text-sm font-bold shadow-sm mb-6 animate-fade-in-up">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>{t.pageTitle}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight leading-tight">
            {t.landing.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {cases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((charityCase) => (
              <PublicCharityCard key={charityCase.charity_case_id} charityCase={charityCase} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-neutral-100">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">{t.noCases}</h3>
            <p className="text-neutral-500">{t.listDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
