"use client";

import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function PaymentsPage() {
  const { t } = useAppTranslation();

  return (
    <>
      <PageHero title={t("app.sidebar.payments")} subtitle={t("app.pages.paymentsSubtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("app.sidebar.payments")}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">$190</CardContent>
      </Card>
    </>
  );
}
