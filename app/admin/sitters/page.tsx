"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";
import { queryKeys } from "@/lib/queries";
import { fetchAdminUsers } from "@/services/query-service";

export default function AdminSittersPage() {
  const { t } = useAppTranslation();
  const { data } = useQuery({ queryKey: queryKeys.adminUsers, queryFn: fetchAdminUsers });
  const sitters = (data || []).filter((user) => user.role === "sitter");

  return (
    <>
      <PageHero title={t("admin.sidebar.sitters")} subtitle={t("admin.pages.sittersSubtitle")} />
      <Card className="overflow-hidden p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.table.name")}</TableHead>
              <TableHead>{t("admin.table.city")}</TableHead>
              <TableHead>{t("admin.table.status")}</TableHead>
              <TableHead>{t("admin.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sitters.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm">{t("admin.table.approve")}</Button>
                  <Button size="sm" variant="outline">{t("admin.table.reject")}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
