"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";

export default function AvailabilityPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.sidebar.availability")} />
      <Card><CardContent className="p-6">{t("app.availability.placeholder")}</CardContent></Card>
    </div>
  );
}
