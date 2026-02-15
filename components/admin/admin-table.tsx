"use client";

import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminTableProps {
  columns: string[];
  rows: Array<Record<string, string>>;
  actions?: (row: Record<string, string>) => ReactNode;
}

export function AdminTable({ columns, rows, actions }: AdminTableProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  const filtered = rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(filter.toLowerCase()));
  const pageSize = 5;
  const pagedRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-3">
      <Input placeholder={t("admin.tables.filter")} value={filter} onChange={(e) => setFilter(e.target.value)} />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
            {actions ? <TableHead>{t("common.actions")}</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedRows.map((row) => (
            <TableRow key={row.id}>
              {Object.entries(row)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <TableCell key={key}>{value}</TableCell>
                ))}
              {actions ? <TableCell>{actions(row)}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setPage((v) => Math.max(1, v - 1))}>{t("admin.tables.prev")}</Button>
        <Button variant="outline" onClick={() => setPage((v) => v + 1)}>{t("admin.tables.next")}</Button>
      </div>
    </div>
  );
}
