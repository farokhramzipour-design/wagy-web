"use client";

import { useTranslation } from "react-i18next";
import { PageTitle } from "@/components/layout/page-title";
import { AdminTable } from "@/components/admin/admin-table";

export default function AdminBookingsPage() {
  const { t } = useTranslation();
  const rows = [
    { id: "1", name: "Luna", role: t("mocks.adminRoles.boarding"), city: t("mocks.adminStatuses.upcoming") },
    { id: "2", name: "Max", role: t("mocks.adminRoles.walking"), city: t("mocks.adminStatuses.past") }
  ];

  return (
    <div>
      <PageTitle title={t("admin.nav.bookings")} />
      <AdminTable columns={[t("admin.tables.name"), t("admin.tables.role"), t("common.status")]} rows={rows} />
    </div>
  );
}
