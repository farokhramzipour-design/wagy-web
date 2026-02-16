"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";
import { queryKeys } from "@/lib/queries";
import { fetchAdminKpis } from "@/services/query-service";

export default function AdminOverviewPage() {
  const { t } = useAppTranslation();
  const { data } = useQuery({ queryKey: queryKeys.adminKpis, queryFn: fetchAdminKpis });

  const cards = [
    { title: t("admin.kpi.revenue"), value: data?.revenue ?? "-" },
    { title: t("admin.kpi.activeUsers"), value: data?.activeUsers ?? "-" },
    { title: t("admin.kpi.pendingReviews"), value: data?.pendingReviews ?? "-" },
    { title: t("admin.kpi.openDisputes"), value: data?.openDisputes ?? "-" }
  ];

  return (
    <>
      <PageHero title={t("admin.sidebar.overview")} subtitle={t("admin.pages.overviewSubtitle")} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{card.value}</CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
