"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";

export function ComingSoonPage({ title }: { title: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={title} />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">{t("common.comingSoon")}</CardContent>
      </Card>
    </div>
  );
}
