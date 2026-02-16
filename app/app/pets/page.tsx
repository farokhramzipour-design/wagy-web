"use client";

import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function PetsPage() {
  const { t } = useAppTranslation();

  return (
    <>
      <PageHero title={t("app.sidebar.pets")} subtitle={t("app.pages.petsSubtitle")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Milo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Dog • Medium • Friendly</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Luna</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Cat • Small • Calm</CardContent>
        </Card>
      </div>
    </>
  );
}
