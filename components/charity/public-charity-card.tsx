"use client";

import { calculateProgress, formatCurrency, getDaysLeft, getImageUrl } from "@/components/charity/charity-utils";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CharityCase } from "@/types/charity-public";
import { CalendarDays, Heart, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const content = { en, fa };

interface PublicCharityCardProps {
  charityCase: CharityCase;
  featured?: boolean;
  index?: number;
}

export function PublicCharityCard({ charityCase, featured = false, index = 0 }: PublicCharityCardProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;
  const common = (content[lang] as any).common;

  const progress = calculateProgress(charityCase.collected_amount_minor, charityCase.target_amount_minor);
  const daysLeft = getDaysLeft(charityCase.expires_at);
  const isClosed = charityCase.status === "closed" || daysLeft <= 0;
  const isFunded = charityCase.collected_amount_minor >= charityCase.target_amount_minor;
  const isUrgent = charityCase.is_urgent;

  // Generate a consistent gradient style based on index
  const gradientStyles = [
    "from-[#e0f7f7] to-[#b2ebf2]", // style-1
    "from-[#fce4ec] to-[#f48fb1]", // style-2
    "from-[#e3f2fd] to-[#90caf9]", // style-3
    "from-[#fff3e0] to-[#ffcc80]", // style-4
    "from-[#f3e5f5] to-[#ce93d8]", // style-5
  ];
  const gradientStyle = gradientStyles[index % gradientStyles.length];

  return (
    <Link 
      href={`/charity/${charityCase.charity_case_id}`} 
      className={cn(
        "bg-white rounded-[20px] border border-[#dce6e8] overflow-hidden transition-all duration-300 text-inherit flex flex-col shadow-[0_1px_4px_rgba(0,0,0,0.06),0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-[#0ea5a4]/20 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both",
        featured ? "md:col-span-2 md:flex-row" : ""
      )}
      style={{ animationDelay: `${0.3 + (index * 0.05)}s` }}
    >
      {/* Card Image */}
      <div className={cn(
        "relative overflow-hidden shrink-0",
        featured ? "w-full md:w-[340px] h-[220px] md:h-auto md:min-h-[280px]" : "w-full h-[210px]",
        !charityCase.cover_image_url && `bg-gradient-to-br ${gradientStyle}`
      )}>
        {charityCase.cover_image_url ? (
          <Image
            src={getImageUrl(charityCase.cover_image_url)}
            alt={charityCase.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-64 transition-transform duration-400 hover:scale-105">
            <span className="text-6xl">🐾</span>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 items-end">
          {isUrgent && (
             <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[20px] bg-[#ff6b6b]/15 text-[#ff5252] border border-[#ff6b6b]/25 backdrop-blur-sm">
               ⚡ {t.urgent}
             </span>
          )}
          {isFunded ? (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[20px] bg-[#0ea5a4]/12 text-[#0b7c7b] border border-[#0ea5a4]/25 backdrop-blur-sm">
              ✓ {t.success}
            </span>
          ) : !isClosed ? (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[20px] bg-emerald-600/15 text-emerald-600 border border-emerald-600/25 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.active}
            </span>
          ) : (
             <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[20px] bg-neutral-500/15 text-neutral-600 border border-neutral-500/25 backdrop-blur-sm">
               {t.closed}
             </span>
          )}
        </div>

        {featured && (
          <span className="absolute top-3.5 left-3.5 bg-gradient-to-br from-[#f59e0b] to-[#ef4444] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-[20px] tracking-wide">
            ⭐ {t.featured}
          </span>
        )}

        <span className="absolute bottom-3.5 left-3.5 bg-[#103745]/75 backdrop-blur-md text-white/90 text-[11px] font-bold px-2.5 py-1 rounded-[20px] flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {daysLeft} {t.daysLeft}
        </span>
      </div>

      {/* Card Body */}
      <div className={cn(
        "p-5 flex flex-col flex-1",
        featured ? "md:p-7 md:justify-center" : ""
      )}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0ea5a4] bg-[#e0f7f7] px-2.5 py-0.5 rounded-[20px] mb-2.5 w-fit">
          🐾 {charityCase.category?.name || t.category}
        </span>
        
        <h3 className={cn(
          "font-extrabold text-[#103745] leading-snug mb-2 transition-colors duration-200 group-hover:text-[#0b7c7b]",
          featured ? "text-xl" : "text-base"
        )}>
          {charityCase.title}
        </h3>
        
        <p className={cn(
          "text-[#6b8a93] leading-relaxed mb-4 flex-1 overflow-hidden",
          featured ? "text-[14.5px] line-clamp-3" : "text-[13.5px] line-clamp-2"
        )}>
          {charityCase.description}
        </p>

        {/* Progress */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-extrabold text-[#ff6b6b]">{progress}% {t.funded}</span>
            <span className="text-[12px] font-semibold text-[#6b8a93]">
              {t.goal}: {formatCurrency(charityCase.target_amount_minor, charityCase.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
            </span>
          </div>
          <div className="h-[7px] bg-[#f0f4f5] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-l from-[#ff6b6b] to-[#2EC4B6] transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[12px] text-[#6b8a93] flex items-center gap-1">
              <Users className="w-3 h-3" />
              {charityCase.donations_count || 0} {t.supporters}
            </span>
            <span className="text-[13px] font-extrabold text-[#0b7c7b]">
              {formatCurrency(charityCase.collected_amount_minor, charityCase.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
            </span>
          </div>
        </div>

        <button className={cn(
          "w-full p-2.5 rounded-xl border-none font-bold text-sm cursor-pointer transition-all duration-200 mt-1",
          isClosed && !isFunded 
            ? "bg-[#e0f7f7] text-[#0b7c7b] border-[1.5px] border-[#0ea5a4]/20"
            : "bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] text-white shadow-[0_4px_14px_rgba(255,107,107,0.3)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(255,107,107,0.45)]"
        )}>
          {isClosed ? (isFunded ? t.success : t.closed) : t.donateNow}
        </button>
      </div>
    </Link>
  );
}