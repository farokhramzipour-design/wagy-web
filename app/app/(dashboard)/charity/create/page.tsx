"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { CharityCaseForm } from "@/components/admin/charity/charity-case-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function CreateCharityCasePage() {
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.charity;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/app/charity">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            {t.createTitle}
          </h1>
          <p className="text-neutral-500">{t.createDesc}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <CharityCaseForm />
      </div>
    </div>
  );
}
