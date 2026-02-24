"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { PublicCharityCard } from "@/components/charity/public-charity-card";
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
      try {
        const data = await charityPublicApi.getCases();
        // Take top 3
        if (data && data.length > 0) {
          setCases(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch charity cases for landing page", error);
      }
    };
    fetchCases();
  }, []);

  if (cases.length === 0) return null;

  return (
    <section className="py-20 bg-rose-50/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-medium">
              <Heart className="w-4 h-4 fill-rose-600" />
              <span>{t.pageTitle}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 leading-tight">
              {t.landing.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {t.landing.subtitle}
            </p>
          </div>
          <Link href="/charity">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-rose-200">
              {t.landing.cta}
              {lang === "fa" ? <ArrowRight className="rotate-180 w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((charityCase) => (
            <PublicCharityCard key={charityCase.charity_case_id} charityCase={charityCase} />
          ))}
        </div>
      </div>
    </section>
  );
}
