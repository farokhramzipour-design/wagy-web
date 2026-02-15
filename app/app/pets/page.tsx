"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PetsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageTitle title={t("app.pets.title")} action={<Button>{t("app.pets.addPet")}</Button>} />
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-2">
          <Input placeholder={t("app.pets.petName")} />
          <Input placeholder={t("app.pets.petType")} />
          <div className="md:col-span-2">
            <Textarea placeholder={t("app.pets.notes")} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
