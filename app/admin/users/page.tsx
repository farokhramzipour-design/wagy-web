"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/layout/page-hero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useAppTranslation } from "@/lib/use-app-translation";
import { queryKeys } from "@/lib/queries";
import { fetchAdminUsers } from "@/services/query-service";

export default function AdminUsersPage() {
  const { t } = useAppTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data } = useQuery({ queryKey: queryKeys.adminUsers, queryFn: fetchAdminUsers });

  const pageSize = 3;
  const filtered = useMemo(
    () => (data || []).filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [data, search]
  );
  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHero title={t("admin.sidebar.users")} subtitle={t("admin.pages.usersSubtitle")} />
      <Input placeholder={t("common.search")} value={search} onChange={(e) => setSearch(e.target.value)} />
      <Card className="overflow-hidden p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.table.name")}</TableHead>
              <TableHead>{t("admin.table.role")}</TableHead>
              <TableHead>{t("admin.table.city")}</TableHead>
              <TableHead>{t("admin.table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>{"<"}</Button>
        <span className="text-sm text-muted-foreground">{t("admin.table.page")} {page}/{maxPage}</span>
        <Button variant="outline" onClick={() => setPage((p) => Math.min(maxPage, p + 1))}>{">"}</Button>
      </div>
    </>
  );
}
