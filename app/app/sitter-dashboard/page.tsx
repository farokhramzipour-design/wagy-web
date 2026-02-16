"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function SitterDashboardPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("app.sidebar.sitterDashboard")} subtitle={t("app.pages.sitterDashboardSubtitle")} />;
}
