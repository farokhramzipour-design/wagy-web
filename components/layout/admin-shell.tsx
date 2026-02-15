"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";

export function AdminShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const logout = useAppStore((state) => state.logout);
  const navItems = [
    { href: "/admin/overview", key: "overview" },
    { href: "/admin/users", key: "users" },
    { href: "/admin/sitters", key: "sitters" },
    { href: "/admin/bookings", key: "bookings" },
    { href: "/admin/payments", key: "payments" },
    { href: "/admin/disputes", key: "disputes" },
    { href: "/admin/content", key: "content" },
    { href: "/admin/settings", key: "settings" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="w-full md:w-[260px] border-r border-border bg-[#0F172A] p-4 text-[#F8FAFC]">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/admin/overview" className="text-lg font-semibold">{t("admin.title")}</Link>
            <LanguageSwitcher />
          </div>
          <p className="mb-4 text-sm text-[#CBD5E1]">{t("admin.subtitle")}</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm",
                  pathname === item.href ? "bg-primary/20 text-white" : "text-[#CBD5E1] hover:bg-[#1E293B]"
                )}
              >
                {t(`admin.nav.${item.key}`)}
              </Link>
            ))}
            <Button variant="secondary" className="mt-4 w-full" onClick={logout}>
              {t("app.sidebar.logout")}
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
