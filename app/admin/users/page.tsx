"use client";

import { useTranslation } from "react-i18next";
import { AdminTable } from "@/components/admin/admin-table";
import { PageTitle } from "@/components/layout/page-title";
import { useAdminUsersQuery } from "@/services/admin-service";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const { data } = useAdminUsersQuery();

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    role: t(`mocks.adminRoles.${row.role}`),
    city: row.city
  }));

  return (
    <div>
      <PageTitle title={t("admin.nav.users")} />
      <AdminTable
        columns={[t("admin.tables.name"), t("admin.tables.role"), t("admin.tables.city")]}
        rows={rows}
      />
    </div>
  );
}
