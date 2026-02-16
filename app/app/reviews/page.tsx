"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function ReviewsPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("app.sidebar.reviews")} subtitle={t("app.pages.reviewsSubtitle")} />;
}
