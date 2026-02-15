"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { Language } from "@/types";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const renderOption = (value: Language, label: string) => (
    <Button
      key={value}
      variant={language === value ? "default" : "ghost"}
      size="sm"
      onClick={() => setLanguage(value)}
      className={cn("h-8 rounded-full px-3 text-caption")}
      aria-label={`${t("common.language")}: ${label}`}
    >
      {value.toUpperCase()}
    </Button>
  );

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-white/80 p-1 backdrop-blur">
      {renderOption("en", t("common.english"))}
      {renderOption("fa", t("common.persian"))}
    </div>
  );
}
