"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppTranslation } from "@/lib/use-app-translation";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAppTranslation();
  const user = useAppStore((s) => s.user);
  const sitterStatus = useAppStore((s) => s.sitterStatus);
  const logout = useAppStore((s) => s.logout);

  const nav = [
    { href: "/app/dashboard", label: t("app.sidebar.dashboard") },
    { href: "/app/search-sitters", label: t("app.sidebar.searchSitters") },
    { href: "/app/bookings", label: t("app.sidebar.bookings") },
    { href: "/app/messages", label: t("app.sidebar.messages") },
    { href: "/app/pets", label: t("app.sidebar.pets") },
    { href: "/app/payments", label: t("app.sidebar.payments") },
    { href: "/app/profile", label: t("app.sidebar.profile") },
    { href: "/app/become-sitter", label: t("app.sidebar.becomeSitter") }
  ];

  const sitterNav =
    sitterStatus === "approved"
      ? [
          { href: "/app/sitter-dashboard", label: t("app.sidebar.sitterDashboard") },
          { href: "/app/availability", label: t("app.sidebar.availability") },
          { href: "/app/services-pricing", label: t("app.sidebar.servicesPricing") },
          { href: "/app/sitter-requests", label: t("app.sidebar.requests") },
          { href: "/app/earnings", label: t("app.sidebar.earnings") },
          { href: "/app/reviews", label: t("app.sidebar.reviews") }
        ]
      : [];

  const doLogout = async () => {
    logout();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="container py-6">
      <div className="grid gap-6 md:grid-cols-[250px,1fr]">
        <aside className="rounded-2xl border bg-white/80 p-4 backdrop-blur">
          <p className="mb-4 text-sm text-muted-foreground">{t("app.greeting", { name: user?.fullName || "" })}</p>
          <div className="space-y-1">
            {[...nav, ...sitterNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm transition",
                  pathname === item.href ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Button className="mt-4 w-full" variant="outline" onClick={doLogout}>
            {t("app.sidebar.logout")}
          </Button>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
