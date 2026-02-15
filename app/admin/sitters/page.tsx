"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/admin/admin-table";
import { PageTitle } from "@/components/layout/page-title";
import { useAdminSittersQuery } from "@/services/admin-service";

export default function AdminSittersPage() {
  const { t } = useTranslation();
  const { data } = useAdminSittersQuery();

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    city: row.city,
    submittedAt: row.submittedAt
  }));

  return (
    <div>
      <PageTitle title={t("admin.nav.sitters")} />
      <AdminTable
        columns={[t("admin.tables.name"), t("admin.tables.city"), t("admin.tables.submittedAt")]}
        rows={rows}
        actions={() => (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">{t("admin.tables.approve")}</Button>
            <Button size="sm" variant="outline">{t("admin.tables.reject")}</Button>
          </div>
        )}
      />
    </div>
  );
}
