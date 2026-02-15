"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.sidebar.reviews")} />
      <div className="space-y-3">
        <Card><CardContent className="p-6">{t("app.reviews.sample1")}</CardContent></Card>
        <Card><CardContent className="p-6">{t("app.reviews.sample2")}</CardContent></Card>
      </div>
    </div>
  );
}
