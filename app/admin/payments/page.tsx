"use client";

import { useTranslation } from "react-i18next";
import { ComingSoonPage } from "@/components/admin/coming-soon-page";

export default function AdminPaymentsPage() {
  const { t } = useTranslation();
  return <ComingSoonPage title={t("admin.nav.payments")} />;
}
