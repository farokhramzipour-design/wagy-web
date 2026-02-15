"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/stores/app-store";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);

  return (
    <div>
      <PageTitle title={t("app.profile.title")} />
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2">
          <Input defaultValue={user?.fullName} placeholder={t("app.profile.fullName")} />
          <Input defaultValue={user?.phone} placeholder={t("app.profile.phone")} />
          <Input placeholder={t("app.profile.city")} />
          <div className="md:col-span-2">
            <Textarea placeholder={t("app.profile.bio")} />
          </div>
          <div className="md:col-span-2">
            <Button>{t("common.save")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
