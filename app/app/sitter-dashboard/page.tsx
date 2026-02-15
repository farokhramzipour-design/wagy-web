"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";

export default function SitterDashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.sidebar.sitterDashboard")} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-6">{t("app.sitterDashboard.requests")}</CardContent></Card>
        <Card><CardContent className="p-6">{t("app.sitterDashboard.rating")}</CardContent></Card>
        <Card><CardContent className="p-6">{t("app.sitterDashboard.month")}</CardContent></Card>
      </div>
    </div>
  );
}
