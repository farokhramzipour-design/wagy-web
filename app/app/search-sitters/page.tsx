"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/layout/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryState } from "@/components/layout/query-state";
import { queryKeys } from "@/lib/queries";
import { useAppTranslation } from "@/lib/use-app-translation";
import { fetchSitters } from "@/services/query-service";

export default function SearchSittersPage() {
  const { t } = useAppTranslation();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.sitters, queryFn: fetchSitters });

  return (
    <>
      <PageHero title={t("app.sidebar.searchSitters")} subtitle={t("app.pages.searchSubtitle")} />
      <QueryState isLoading={isLoading} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((sitter) => (
          <Card key={sitter.id}>
            <CardHeader>
              <CardTitle>{sitter.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{sitter.city}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>⭐ {sitter.rating} ({sitter.reviews})</p>
              <p>${sitter.pricePerNight}</p>
              <p>{sitter.responseTime}</p>
              <div className="flex flex-wrap gap-2">
                {sitter.badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
