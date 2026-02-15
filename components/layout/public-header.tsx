"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  const { t } = useTranslation();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-xl"
    >
      <div className="container-main flex h-[72px] items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {t("common.brand")}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#services">{t("header.services")}</a>
          <Link href="/auth">{t("header.login")}</Link>
          <Button asChild variant="accent" size="sm">
            <Link href="/app/become-sitter">{t("header.becomeSitter")}</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/auth">{t("header.startNow")}</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
