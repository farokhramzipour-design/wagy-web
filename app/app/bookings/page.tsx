"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { queryKeys } from "@/lib/queries";
import { useAppTranslation } from "@/lib/use-app-translation";
import { fetchBookings } from "@/services/query-service";

export default function BookingsPage() {
  const { t } = useAppTranslation();
  const [status, setStatus] = useState<"upcoming" | "past" | "request">("upcoming");
  const { data } = useQuery({ queryKey: queryKeys.bookings, queryFn: fetchBookings });

  const filtered = useMemo(() => data?.filter((item) => item.status === status) || [], [data, status]);

  const filters: Array<{ key: "upcoming" | "past" | "request"; label: string }> = [
    { key: "upcoming", label: t("app.bookingsStatus.upcoming") },
    { key: "past", label: t("app.bookingsStatus.past") },
    { key: "request", label: t("app.bookingsStatus.request") }
  ];

  return (
    <>
      <PageHero title={t("app.sidebar.bookings")} subtitle={t("app.pages.bookingsSubtitle")} />
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button key={filter.key} variant={status === filter.key ? "default" : "outline"} onClick={() => setStatus(filter.key)}>
            {filter.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4">
        {filtered.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.petName}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1 text-sm text-muted-foreground md:grid-cols-4">
              <p>{item.sitterName}</p>
              <p>{item.service}</p>
              <p>{item.dateRange}</p>
              <p>${item.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
