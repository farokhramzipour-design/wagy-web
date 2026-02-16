"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function AvailabilityPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("app.sidebar.availability")} subtitle={t("app.pages.availabilitySubtitle")} />;
}
