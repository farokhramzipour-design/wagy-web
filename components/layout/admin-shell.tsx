"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppTranslation } from "@/lib/use-app-translation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useAppTranslation();

  const nav = [
    { href: "/admin/overview", label: t("admin.sidebar.overview") },
    { href: "/admin/users", label: t("admin.sidebar.users") },
    { href: "/admin/sitters", label: t("admin.sidebar.sitters") },
    { href: "/admin/bookings", label: t("admin.sidebar.bookings") },
    { href: "/admin/payments", label: t("admin.sidebar.payments") },
    { href: "/admin/disputes", label: t("admin.sidebar.disputes") },
    { href: "/admin/content", label: t("admin.sidebar.content") },
    { href: "/admin/settings", label: t("admin.sidebar.settings") }
  ];

  return (
    <div className="container py-6">
      <div className="grid gap-6 md:grid-cols-[240px,1fr]">
        <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-4 text-sm font-semibold text-amber-900">{t("admin.title")}</p>
          <div className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm",
                  pathname === item.href ? "bg-amber-200 text-amber-900" : "text-amber-800 hover:bg-amber-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
