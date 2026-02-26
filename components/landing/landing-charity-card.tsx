"use client";

import { calculateProgress, formatCurrency, getDaysLeft, getImageUrl } from "@/components/charity/charity-utils";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CharityCase } from "@/types/charity-public";
import { CalendarDays, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const content = { en, fa };

interface LandingCharityCardProps {
  charityCase: CharityCase;
}

export function LandingCharityCard({ charityCase }: LandingCharityCardProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;

  const progress = calculateProgress(charityCase.collected_amount_minor, charityCase.target_amount_minor);
  const daysLeft = getDaysLeft(charityCase.expires_at);
  const isClosed = charityCase.status === "closed" || daysLeft <= 0;
  const isFunded = charityCase.collected_amount_minor >= charityCase.target_amount_minor;

  // Determine status badge
  let statusBadge;
  if (isFunded) {
    statusBadge = (
      <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-0 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
        {t.success}
      </Badge>
    );
  } else if (isClosed) {
    statusBadge = (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        {t.closed}
      </Badge>
    );
  } else {
    statusBadge = (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {t.inProgress || "In Progress"}
      </Badge>
    );
  }

  return (
    <Link href={`/charity/${charityCase.charity_case_id}`} className="block group h-full">
      <div 
        className="bg-white rounded-2xl h-full flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      >
        {/* Top Image Area */}
        <div className="relative h-[220px] w-full overflow-hidden bg-gray-100">
          {charityCase.cover_image_url ? (
            <Image
              src={getImageUrl(charityCase.cover_image_url)}
              alt={charityCase.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <Heart className="w-16 h-16 opacity-20" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            {statusBadge}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow bg-white">
          {/* Title */}
          <h3 className="text-lg font-bold text-[#1A1A2E] text-right mb-3 line-clamp-1 group-hover:text-[#FF6B6B] transition-colors">
            {charityCase.title}
          </h3>

          {/* Days Remaining */}
          <div className="flex items-center justify-end gap-2 text-gray-400 text-sm mb-6">
            <span>{daysLeft} {t.daysLeft}</span>
            <CalendarDays className="w-4 h-4" />
          </div>

          {/* Progress Section */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#FF6B6B]">{progress}%</span>
              <span className="text-gray-400">{t.progress}</span>
            </div>
            {/* Custom Gradient Progress Bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#2EC4B6] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-right">
              <span className="block text-gray-400 text-xs mb-1">{t.target}</span>
              <span className="block text-gray-400 font-medium text-sm">
                {formatCurrency(charityCase.target_amount_minor, charityCase.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
              </span>
            </div>
            <div className="text-right border-r-2 border-gray-100 pr-4">
              <span className="block text-gray-400 text-xs mb-1">{t.collected}</span>
              <span className="block text-[#2EC4B6] font-bold text-sm">
                {formatCurrency(charityCase.collected_amount_minor, charityCase.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-auto">
            <Button 
              className={`w-full h-11 rounded-xl font-medium transition-all duration-200 
                ${progress === 0 
                  ? "bg-[#FF6B6B] hover:bg-[#ff5252] text-white border-0 shadow-md hover:shadow-lg" 
                  : "bg-transparent hover:bg-[#FF6B6B] text-[#FF6B6B] hover:text-white border border-[#FF6B6B]"
                }`}
            >
              {t.donate}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
