"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { SessionData } from "@/lib/session";
import { cn } from "@/lib/utils";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { ProfileMeResponse } from "@/services/profile-api";
import {
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  PawPrint,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const content = { en, fa };

interface SidebarProps {
  session?: SessionData | null;
  profile?: ProfileMeResponse | null;
  className?: string;
  onLinkClick?: () => void;
}

export function DashboardSidebarNav({ session, profile, className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const t = content[lang].dashboard.nav;
  const tOverview = content[lang].dashboard.overview;
  const tPromo = (content[lang] as any).dashboard.promo?.becomeSitter;

  const isAdmin = session?.isAdmin ?? false;
  const isSitter = profile?.is_provider && profile?.provider_is_active;

  const links = [
    {
      href: "/app/dashboard",
      label: t.overview,
      icon: LayoutDashboard
    },
    {
      href: "/app/pets",
      label: t.pets,
      icon: PawPrint
    },
    {
      href: "/app/orders",
      label: t.orders,
      icon: ShoppingBag
    },
    {
      href: "/app/addresses",
      label: t.addresses,
      icon: MapPin
    },
    {
      href: "/app/transactions",
      label: t.transactions,
      icon: CreditCard
    },
    {
      href: "/app/chat",
      label: t.chat || "Messages",
      icon: MessageSquare
    },
    {
      href: "/app/charity",
      label: (content[lang] as any).dashboard.charity?.title || "Charity",
      icon: Heart
    },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <div className="p-4 space-y-1 flex-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-neutral-100 space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onLinkClick}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mb-2"
          >
            <ShieldAlert className="w-4 h-4" />
            {tOverview.adminPanel}
          </Link>
        )}

        {isSitter && (
          <Link
            href="/app/sitter-settings"
            onClick={onLinkClick}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {t.sitterSettings}
          </Link>
        )}

        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-start"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </form>

        {!isSitter && (
          <div className="mt-12 p-4 rounded-xl bg-gradient-to-br from-[#0ea5a4]/10 to-[#0ea5a4]/20 border border-[#0ea5a4]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-white shadow-sm">
                <Sparkles className="w-4 h-4 text-[#0ea5a4]" />
              </div>
              <h3 className="font-semibold text-sm text-[#0ea5a4]">
                {tPromo?.title || "Become a Sitter"}
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
              {tPromo?.description || "Earn money doing what you love."}
            </p>
            <Link
              href="/app/become-sitter"
              onClick={onLinkClick}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#0ea5a4] text-white text-xs font-medium hover:bg-[#0ea5a4]/90 transition-colors shadow-sm"
            >
              {tPromo?.button || "Get Started"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ session, profile }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-200 bg-white min-h-[calc(100vh-64px)] sticky top-16 self-start">
      <DashboardSidebarNav session={session} profile={profile} />
    </aside>
  );
}
