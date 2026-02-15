"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.payments.title")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("app.payments.method")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t("app.payments.cardHint")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("app.payments.history")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t("app.payments.historyHint")}</CardContent>
        </Card>
      </div>
    </div>
  );
}
