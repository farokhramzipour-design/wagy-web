"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function AdminPaymentsPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("admin.sidebar.payments")} subtitle={t("admin.pages.paymentsSubtitle")} />;
}
