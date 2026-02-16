"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAppTranslation } from "@/lib/use-app-translation";
import { queryKeys } from "@/lib/queries";
import { fetchBookings } from "@/services/query-service";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/page-hero";

export default function DashboardPage() {
  const { t } = useAppTranslation();
  const sitterStatus = useAppStore((s) => s.sitterStatus);
  const { data } = useQuery({ queryKey: queryKeys.bookings, queryFn: fetchBookings });

  return (
    <>
      <PageHero title={t("app.dashboard.title")} subtitle={t("app.pages.bookingsSubtitle")} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("app.dashboard.summary1")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{data?.filter((item) => item.status === "upcoming").length ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("app.dashboard.summary2")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">3</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("app.dashboard.summary3")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">5</CardContent>
        </Card>
      </div>

      {sitterStatus !== "approved" ? (
        <Card className="border-primary/30 bg-secondary">
          <CardHeader>
            <CardTitle>{t("app.ownerCta")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/app/become-sitter">{t("app.ownerCtaButton")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
