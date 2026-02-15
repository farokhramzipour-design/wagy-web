"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EarningsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.sidebar.earnings")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("app.sidebar.earnings")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/15 to-brand-light/80" />
        </CardContent>
      </Card>
    </div>
  );
}
