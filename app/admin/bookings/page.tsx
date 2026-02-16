"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function AdminBookingsPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("admin.sidebar.bookings")} subtitle={t("admin.pages.bookingsSubtitle")} />;
}
