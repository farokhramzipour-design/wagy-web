"use client";

import { CharityUpdateForm } from "@/components/admin/charity/charity-update-form";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

const content = { en, fa };

interface AddUpdateWrapperProps {
  charityCaseId: number;
  accessToken: string;
}

export function AddUpdateWrapper({ charityCaseId, accessToken }: AddUpdateWrapperProps) {
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
            <MessageSquarePlus className="w-6 h-6 text-[#0ea5a4]" />
            {t.addUpdate}
          </h1>
          <p className="text-neutral-500">{t.addUpdateDesc}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <CharityUpdateForm charityCaseId={charityCaseId} accessToken={accessToken} />
      </div>
    </div>
  );
}
