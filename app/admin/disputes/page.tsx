"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function AdminDisputesPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("admin.sidebar.disputes")} subtitle={t("admin.pages.disputesSubtitle")} />;
}
