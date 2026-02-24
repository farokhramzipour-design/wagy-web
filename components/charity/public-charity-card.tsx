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
import { CalendarDays, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const content = { en, fa };

interface PublicCharityCardProps {
  charityCase: CharityCase;
}

export function PublicCharityCard({ charityCase }: PublicCharityCardProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;

  const progress = calculateProgress(charityCase.collected_amount_minor, charityCase.target_amount_minor);
  const daysLeft = getDaysLeft(charityCase.expires_at);
  const isClosed = charityCase.status === "closed" || daysLeft <= 0;
  const isFunded = charityCase.collected_amount_minor >= charityCase.target_amount_minor;

  return (
    <Link href={`/charity/${charityCase.charity_case_id}`} className="block group h-full">
      <Card className="h-full overflow-hidden border-neutral-200 hover:border-rose-200 hover:shadow-lg transition-all duration-300 flex flex-col bg-white">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {charityCase.cover_image_url ? (
            <Image
              src={getImageUrl(charityCase.cover_image_url)}
              alt={charityCase.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              <Heart className="w-12 h-12 opacity-20" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            {isFunded && (
              <Badge variant="secondary" className="bg-emerald-500 text-white hover:bg-emerald-600 border-0 shadow-sm">
                {t.success}
              </Badge>
            )}
            {isClosed && !isFunded && (
              <Badge variant="secondary" className="bg-neutral-500 text-white hover:bg-neutral-600 border-0 shadow-sm">
                {t.closed}
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="p-5 pb-2 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-xl text-neutral-800 line-clamp-2 group-hover:text-rose-600 transition-colors">
              {charityCase.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <CalendarDays className="w-4 h-4" />
            <span>{daysLeft} {t.daysLeft}</span>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-neutral-600">{t.progress}</span>
                <span className="text-rose-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2.5 bg-neutral-100 [&>div]:bg-rose-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-neutral-500 text-xs mb-1">{t.collected}</span>
                <span className="font-bold text-emerald-600">
                  {formatCurrency(charityCase.collected_amount_minor, charityCase.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
                </span>
              </div>
              <div className="text-right rtl:text-left">
                <span className="block text-neutral-500 text-xs mb-1">{t.target}</span>
                <span className="font-bold text-neutral-800">
                  {formatCurrency(charityCase.target_amount_minor, charityCase.currency_code, lang === "fa" ? "fa-IR" : "en-US")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 mt-auto">
          <Button className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-semibold border-rose-100 border">
            {t.donate}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
