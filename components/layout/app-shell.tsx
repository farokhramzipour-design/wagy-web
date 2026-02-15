"use client";

import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Home, Search, CalendarClock, MessageSquareText, PawPrint, CreditCard, UserCircle2, ShieldCheck, Clock3, BriefcaseBusiness, Inbox, ChartColumn, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const role = useAppStore((state) => state.role);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const sitterStatus = useAppStore((state) => state.sitterStatus);
  const isRtl = useAppStore((state) => state.language === "fa");

  const ownerItems: NavItem[] = [
    { href: "/app/dashboard", label: t("app.sidebar.dashboard"), icon: <Home className="h-4 w-4" /> },
    { href: "/app/search-sitters", label: t("app.sidebar.searchSitters"), icon: <Search className="h-4 w-4" /> },
    { href: "/app/bookings", label: t("app.sidebar.bookings"), icon: <CalendarClock className="h-4 w-4" /> },
    { href: "/app/messages", label: t("app.sidebar.messages"), icon: <MessageSquareText className="h-4 w-4" /> },
    { href: "/app/pets", label: t("app.sidebar.pets"), icon: <PawPrint className="h-4 w-4" /> },
    { href: "/app/payments", label: t("app.sidebar.payments"), icon: <CreditCard className="h-4 w-4" /> },
    { href: "/app/profile", label: t("app.sidebar.profile"), icon: <UserCircle2 className="h-4 w-4" /> }
  ];

  const sitterItems: NavItem[] = sitterStatus === "approved"
    ? [
        { href: "/app/sitter-dashboard", label: t("app.sidebar.sitterDashboard"), icon: <ShieldCheck className="h-4 w-4" /> },
        { href: "/app/availability", label: t("app.sidebar.availability"), icon: <Clock3 className="h-4 w-4" /> },
        { href: "/app/services-pricing", label: t("app.sidebar.servicesPricing"), icon: <BriefcaseBusiness className="h-4 w-4" /> },
        { href: "/app/sitter-requests", label: t("app.sidebar.requests"), icon: <Inbox className="h-4 w-4" /> },
        { href: "/app/earnings", label: t("app.sidebar.earnings"), icon: <ChartColumn className="h-4 w-4" /> },
        { href: "/app/reviews", label: t("app.sidebar.reviews"), icon: <Star className="h-4 w-4" /> }
      ]
    : [];

  if (role === "guest") return null;

  return (
    <div className={cn("min-h-screen", isRtl && "[direction:rtl]")}>
      <div className={cn("flex min-h-screen", isRtl && "flex-row-reverse")}>
        <aside className={cn("w-full md:w-[260px] border-border/80 bg-white/88 p-4 backdrop-blur md:block", isRtl ? "border-l" : "border-r")}>
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold">{t("common.brand")}</Link>
            <LanguageSwitcher />
          </div>
          <p className="mb-6 text-sm text-muted-foreground">{t("app.greeting", { name: user?.fullName ?? "" })}</p>
          <div className="space-y-1">
            {[...ownerItems, ...sitterItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-brand-light text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <Button variant="ghost" className="mt-4 w-full justify-start" onClick={logout}>
              {t("app.sidebar.logout")}
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
