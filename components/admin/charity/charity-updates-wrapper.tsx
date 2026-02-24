"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { CharityCaseUpdate } from "@/types/charity";
import { ArrowLeft, List, Plus } from "lucide-react";
import Link from "next/link";
import { CharityUpdatesList } from "./charity-updates-list";

const content = { en, fa };

interface CharityUpdatesWrapperProps {
  charityCaseId: number;
  updates: CharityCaseUpdate[];
}

export function CharityUpdatesWrapper({ charityCaseId, updates }: CharityUpdatesWrapperProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).dashboard.charity;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/app/charity">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
              <List className="w-6 h-6 text-[#0ea5a4]" />
              {t.updatesTitle || "Case Updates"}
            </h1>
            <p className="text-neutral-500">{t.updatesDesc || "Track recent developments and fund usage"}</p>
          </div>
        </div>

        <Link href={`/app/charity/${charityCaseId}/update`}>
          <Button className="bg-[#0ea5a4] hover:bg-[#0b7c7b] gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            {t.addUpdate || "Add Update"}
          </Button>
        </Link>
      </div>

      <CharityUpdatesList updates={updates} />
    </div>
  );
}
