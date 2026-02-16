"use client";

import Link from "next/link";
import { useAppTranslation } from "@/lib/use-app-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  const { t } = useAppTranslation();

  return (
    <main className="container py-10">
      <Card className="mx-auto max-w-xl text-center">
        <CardHeader>
          <CardTitle>{t("accessDenied.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">{t("accessDenied.description")}</p>
          <Button asChild>
            <Link href="/app/dashboard">{t("accessDenied.cta")}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
