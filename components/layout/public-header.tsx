"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useAppTranslation } from "@/lib/use-app-translation";

export function PublicHeader() {
  const { t } = useAppTranslation();

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {t("common.brand")}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#services">{t("nav.services")}</a>
          <a href="#become">{t("nav.becomeSitter")}</a>
          <Link href="/auth">{t("nav.login")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Button asChild size="sm">
              <Link href="/auth">{t("nav.findSitter")}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
