"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { SessionData } from "@/lib/session";
import {
  Users,
  Briefcase,
  CreditCard,
  FileBarChart,
  UserPlus,
  Shield,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart
} from "lucide-react";

const content = { en, fa };

// Role Definitions
type AdminRole = "super_admin" | "admin" | "operator";

interface AdminSidebarProps {
  session?: SessionData | null;
  className?: string;
  onLinkClick?: () => void;
}

interface AdminOption {
  id: string;
  titleKey: string;
  href: string;
  icon: any;
  roles: AdminRole[];
}

const ADMIN_OPTIONS: AdminOption[] = [
  {
    id: "dashboard",
    titleKey: "panelTitle",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin", "operator"]
  },
  {
    id: "services",
    titleKey: "manageServices",
    href: "/admin/services",
    icon: Briefcase,
    roles: ["super_admin"]
  },
  {
    id: "blog",
    titleKey: "blog",
    href: "/admin/blog",
    icon: BookOpen,
    roles: ["super_admin", "admin"]
  },
  {
    id: "users",
    titleKey: "usersList",
    href: "/admin/users",
    icon: Users,
    roles: ["super_admin", "admin", "operator"]
  },
  {
    id: "providers",
    titleKey: "providerServices",
    href: "/admin/providers",
    icon: Shield,
    roles: ["super_admin", "admin", "operator"]
  },
  {
    id: "transactions",
    titleKey: "transactionsList",
    href: "/admin/transactions",
    icon: CreditCard,
    roles: ["super_admin", "admin", "operator"]
  },
  {
    id: "reports",
    titleKey: "reports",
    href: "/admin/reports",
    icon: FileBarChart,
    roles: ["super_admin"]
  },
  {
    id: "admins",
    titleKey: "manageAdmins",
    href: "/admin/admins",
    icon: UserPlus,
    roles: ["super_admin"]
  }
];

export function AdminSidebarNav({ session, className, onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const tAdmin = (content[lang] as any).admin || {};
  const tNav = content[lang].dashboard.nav;
  
  let role = (session?.adminRole as string) || "operator";
  // Normalize role to match AdminRole type
  if (role === "superadmin") role = "super_admin";
  
  const allowedOptions = ADMIN_OPTIONS.filter(opt => opt.roles.includes(role as AdminRole));

  const isRtl = lang === "fa";

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <div className="p-4 space-y-1">
        <div className="mb-6 px-3">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {tAdmin.panelTitle || "Admin Panel"}
          </h2>
          <div className="text-xs text-neutral-400 mt-1 capitalize">
            {role ? role.replace("_", " ") : "Operator (Default)"}
          </div>
        </div>

        {allowedOptions.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
          
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-red-600" : "text-neutral-500")} />
              {link.id === "blog" ? tAdmin.blog?.title || "Blog" : 
               (tAdmin[link.titleKey] || link.titleKey)}
              {isActive && (
                <span className={cn(
                  "absolute w-1 h-6 bg-red-600 rounded-full",
                  isRtl ? "left-0" : "right-0"
                )} />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-neutral-200 space-y-1">
        <Link
          href="/app/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {tNav.overview}
        </Link>
        
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-start"
          >
            <LogOut className="w-4 h-4" />
            {tNav.logout}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar({ session }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-200 bg-white min-h-[calc(100vh-64px)] sticky top-16 self-start">
      <AdminSidebarNav session={session} />
    </aside>
  );
}
