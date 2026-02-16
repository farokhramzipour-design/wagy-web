"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function AdminSettingsPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("admin.sidebar.settings")} subtitle={t("admin.pages.settingsSubtitle")} />;
}
