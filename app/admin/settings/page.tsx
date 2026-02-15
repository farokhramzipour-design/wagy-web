"use client";

import { useTranslation } from "react-i18next";
import { ComingSoonPage } from "@/components/admin/coming-soon-page";

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  return <ComingSoonPage title={t("admin.nav.settings")} />;
}
