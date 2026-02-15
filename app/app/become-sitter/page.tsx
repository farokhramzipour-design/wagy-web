"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/stores/app-store";

export default function BecomeSitterPage() {
  const { t } = useTranslation();
  const sitterStatus = useAppStore((state) => state.sitterStatus);
  const setSitterStatus = useAppStore((state) => state.setSitterStatus);

  const statusMap = {
    draft: t("app.becomeSitter.statusDraft"),
    pending_review: t("app.becomeSitter.statusPending"),
    approved: t("app.becomeSitter.statusApproved")
  };

  return (
    <div>
      <PageTitle title={t("app.becomeSitter.title")} description={t("app.becomeSitter.subtitle")} />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{t("common.status")}</span>
            <Badge variant={sitterStatus === "approved" ? "success" : "secondary"}>{statusMap[sitterStatus]}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setSitterStatus("draft")}>{t("app.becomeSitter.statusDraft")}</Button>
          <Button variant="outline" onClick={() => setSitterStatus("pending_review")}>{t("app.becomeSitter.statusPending")}</Button>
          <Button variant="outline" onClick={() => setSitterStatus("approved")}>{t("app.becomeSitter.statusApproved")}</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("app.becomeSitter.step1")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder={t("app.profile.fullName")} />
            <Input placeholder={t("app.profile.city")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("app.becomeSitter.step2")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder={t("app.searchSitters.service")} />
            <Input placeholder={t("app.searchSitters.budget")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("app.becomeSitter.step3")}</CardTitle>
            <CardDescription>{t("app.becomeSitter.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea placeholder={t("app.profile.bio")} />
            <Button className="w-full">{t("app.becomeSitter.submit")}</Button>
          </CardContent>
        </Card>
      </div>

      {sitterStatus === "approved" ? (
        <Card className="mt-4 border-success/30 bg-[hsl(var(--success-bg))]">
          <CardHeader>
            <CardTitle>{t("app.becomeSitter.approvedTitle")}</CardTitle>
            <CardDescription>{t("app.becomeSitter.approvedDescription")}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}
