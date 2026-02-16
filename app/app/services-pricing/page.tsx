"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function ServicesPricingPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("app.sidebar.servicesPricing")} subtitle={t("app.pages.servicesPricingSubtitle")} />;
}
