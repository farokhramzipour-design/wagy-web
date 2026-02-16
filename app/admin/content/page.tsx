"use client";
import { PageHero } from "@/components/layout/page-hero";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function AdminContentPage() {
  const { t } = useAppTranslation();
  return <PageHero title={t("admin.sidebar.content")} subtitle={t("admin.pages.contentSubtitle")} />;
}
