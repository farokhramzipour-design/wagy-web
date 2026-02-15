"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/layout/page-title";
import { useBookingsQuery } from "@/services/marketplace-service";

export default function BookingsPage() {
  const { t } = useTranslation();
  const { data } = useBookingsQuery();

  const labelMap = useMemo(
    () => ({
      upcoming: t("app.bookings.upcoming"),
      past: t("app.bookings.past"),
      request: t("app.bookings.requests")
    }),
    [t]
  );

  return (
    <div>
      <PageTitle title={t("app.bookings.title")} />
      <div className="space-y-3">
        {data?.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{booking.petName} • {t(`mocks.bookingServices.${booking.service}`)}</p>
                <p className="text-sm text-muted-foreground">{booking.sitterName}</p>
              </div>
              <p className="text-sm text-muted-foreground">{booking.startDate} → {booking.endDate}</p>
              <Badge variant="secondary">{labelMap[booking.status]}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
