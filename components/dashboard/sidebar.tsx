"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import {
  LayoutDashboard,
  PawPrint,
  ShoppingBag,
  MapPin,
  CreditCard,
  LogOut,
  HeartHandshake
} from "lucide-react";

const content = { en, fa };

export function Sidebar() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const t = content[lang].dashboard.nav;

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
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-200 bg-white min-h-[calc(100vh-64px)] sticky top-16 self-start">
      <div className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
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

      <div className="mt-auto p-4 border-t border-neutral-200 space-y-1">
        <Link
            href="/become-sitter"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
            <HeartHandshake className="w-4 h-4" />
            {t.becomeSitter}
        </Link>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-start"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </form>
      </div>
    </aside>
  );
}
