"use client";

import { useAppStore } from "@/stores/app-store";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";

export default function BecomeSitterPage() {
  const { t } = useAppTranslation();
  const status = useAppStore((s) => s.sitterStatus);
  const setStatus = useAppStore((s) => s.setSitterStatus);

  const steps = [t("app.sitter.step1"), t("app.sitter.step2"), t("app.sitter.step3")];

  return (
    <>
      <PageHero title={t("app.sitter.title")} subtitle={t("app.sitter.subtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("common.status")}: {status === "draft" ? t("app.sitter.draft") : status === "pending_review" ? t("app.sitter.pending") : t("app.sitter.approved")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setStatus("draft")}>{t("app.sitter.draft")}</Button>
            <Button variant="outline" onClick={() => setStatus("pending_review")}>{t("app.sitter.pending")}</Button>
            <Button onClick={() => setStatus("approved")}>{t("app.sitter.submit")}</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
