"use client";

import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/lib/use-app-translation";

export function LanguageSwitcher() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const { t } = useAppTranslation();

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-white/80 p-1 backdrop-blur">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        aria-label={`${t("common.language")}: ${t("common.english")}`}
      >
        {t("common.english")}
      </Button>
      <Button
        variant={language === "fa" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("fa")}
        aria-label={`${t("common.language")}: ${t("common.persian")}`}
      >
        {t("common.persian")}
      </Button>
    </div>
  );
}
