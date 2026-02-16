"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function EarningsPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("app.sidebar.earnings")} subtitle={t("app.pages.earningsSubtitle")} />;
}
