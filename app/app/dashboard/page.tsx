"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingsQuery, useChatsQuery } from "@/services/marketplace-service";
import { useAppStore } from "@/stores/app-store";

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);
  const bookingsQuery = useBookingsQuery();
  const chatsQuery = useChatsQuery();

  const stats = [
    { label: t("app.dashboard.activeBookings"), value: bookingsQuery.data?.filter((b) => b.status === "upcoming").length ?? 0 },
    { label: t("app.dashboard.messages"), value: chatsQuery.data?.reduce((a, c) => a + c.unread, 0) ?? 0 },
    { label: t("app.dashboard.savedSitters"), value: 5 },
    { label: t("app.dashboard.spend"), value: "$860" }
  ];

  return (
    <div>
      <PageTitle title={t("app.dashboard.title")} description={t("app.greeting", { name: user?.fullName ?? "" })} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{item.value}</CardContent>
          </Card>
        ))}
      </div>

      {!user?.isSitter ? (
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>{t("app.ownerCtaTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{t("app.ownerCtaDescription")}</p>
            <Button asChild variant="accent">
              <Link href="/app/become-sitter">{t("app.ownerCtaButton")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
