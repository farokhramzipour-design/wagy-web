"use client";

import { CharityCaseForm } from "@/components/admin/charity/charity-case-form";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CharityCaseDetail } from "@/types/charity";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

const content = { en, fa };

interface EditCharityCaseWrapperProps {
  initialData: CharityCaseDetail;
  accessToken: string;
}

export function EditCharityCaseWrapper({ initialData, accessToken }: EditCharityCaseWrapperProps) {
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
            {t.editTitle}
          </h1>
          <p className="text-neutral-500">{t.editDesc}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <CharityCaseForm initialData={initialData} accessToken={accessToken} />
      </div>
    </div>
  );
}
