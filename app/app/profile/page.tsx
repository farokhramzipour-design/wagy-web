"use client";

import { useAppStore } from "@/stores/app-store";
import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function ProfilePage() {
  const { t } = useAppTranslation();
  const user = useAppStore((s) => s.user);

  return (
    <>
      <PageHero title={t("app.sidebar.profile")} subtitle={t("app.pages.profileSubtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{user?.fullName ?? ""}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{user?.phone ?? ""}</p>
          <p>{user?.id ?? ""}</p>
        </CardContent>
      </Card>
    </>
  );
}
