"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminKpisQuery } from "@/services/admin-service";

export default function AdminOverviewPage() {
  const { t } = useTranslation();
  const { data } = useAdminKpisQuery();

  const cards = [
    { key: "revenue", value: data?.revenue ?? "-" },
    { key: "activeUsers", value: data?.activeUsers ?? "-" },
    { key: "activeSitters", value: data?.activeSitters ?? "-" },
    { key: "openDisputes", value: data?.openDisputes ?? "-" }
  ];

  return (
    <div>
      <PageTitle title={t("admin.nav.overview")} description={t("admin.subtitle")} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.key}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{t(`admin.kpi.${card.key}`)}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{card.value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
