"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/components/layout/page-title";
import { useSittersQuery } from "@/services/marketplace-service";

export default function SearchSittersPage() {
  const { t } = useTranslation();
  const { data } = useSittersQuery();

  return (
    <div>
      <PageTitle title={t("app.searchSitters.title")} />
      <Card className="mb-4">
        <CardContent className="grid gap-3 p-4 md:grid-cols-3">
          <Input placeholder={t("app.searchSitters.city")} />
          <Input placeholder={t("app.searchSitters.service")} />
          <Input placeholder={t("app.searchSitters.budget")} />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((sitter) => (
          <Card key={sitter.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{sitter.name}</span>
                {sitter.verified ? <Badge variant="success">{t("app.searchSitters.verified")}</Badge> : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{sitter.city}</p>
              <p className="text-sm text-muted-foreground">⭐ {sitter.rating}</p>
              <p className="text-sm text-muted-foreground">${sitter.pricePerNight}</p>
              <Button>{t("app.searchSitters.bookNow")}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
