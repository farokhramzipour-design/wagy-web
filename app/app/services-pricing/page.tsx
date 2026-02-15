"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ServicesPricingPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.sidebar.servicesPricing")} />
      <Card>
        <CardContent className="space-y-3 p-6">
          <Input placeholder={t("app.searchSitters.service")} />
          <Input placeholder={t("app.searchSitters.budget")} />
          <Button>{t("common.save")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
