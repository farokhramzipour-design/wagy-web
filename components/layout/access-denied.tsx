"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AccessDeniedCard() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="items-center text-center">
          <div className="rounded-full bg-muted p-3">
            <ShieldX className="h-6 w-6" />
          </div>
          <CardTitle>{t("common.friendlyDeniedTitle")}</CardTitle>
          <CardDescription>{t("common.friendlyDeniedDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/">{t("common.backHome")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
