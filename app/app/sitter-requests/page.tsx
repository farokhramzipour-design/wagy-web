"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function SitterRequestsPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("app.sidebar.requests")} subtitle={t("app.pages.requestsSubtitle")} />;
}
