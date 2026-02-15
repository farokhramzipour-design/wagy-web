"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SitterRequestsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.sidebar.requests")} />
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <p>{t("app.sitterRequests.sampleRequest")}</p>
          <div className="flex gap-2">
            <Button variant="secondary">{t("admin.tables.approve")}</Button>
            <Button variant="outline">{t("admin.tables.reject")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
