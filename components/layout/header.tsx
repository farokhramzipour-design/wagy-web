"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import type { SessionData } from "@/lib/session";
import { LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";

type Lang = "en" | "fa";

const content = { en, fa };

interface HeaderProps {
  user: SessionData | null;
  showNavLinks?: boolean;
  mobileNav?: React.ReactNode;
}

export function Header({ user, showNavLinks = true, mobileNav }: HeaderProps) {
  const { lang, setLang } = useLanguage();
  const t = useMemo(() => content[lang], [lang]);
  const [open, setOpen] = useState(false);

  const isRtl = lang === "fa";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {mobileNav && (
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRtl ? "right" : "left"} className="w-64 p-0 pt-10">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  {/* Pass a callback to close the sheet when a link is clicked */}
                  <div onClick={() => setOpen(false)} className="h-full">
                    {mobileNav}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
          <Link href="/landing" className="text-[#0ea5a4]">
            <Logo className="h-6 w-auto" />
          </Link>
        </div>

        {showNavLinks && (
          <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600">
            <Link href="/landing#services" className="hover:text-[#0ea5a4] transition-colors">{t.nav.services}</Link>
            <Link href="/landing#how" className="hover:text-[#0ea5a4] transition-colors">{t.nav.how}</Link>
            <Link href="/landing#safety" className="hover:text-[#0ea5a4] transition-colors">{t.nav.safety}</Link>
            <Link href="/landing#become" className="hover:text-[#0ea5a4] transition-colors">{t.nav.sitter}</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 rounded-full p-1">
            <button
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "en" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "fa" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
              onClick={() => setLang("fa")}
            >
              FA
            </button>
          </div>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent px-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200 shadow-sm transition-transform hover:scale-105">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.role === "admin" ? "Admin" : "User"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/app/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>{t.nav.dashboard}</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.nav.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="outline" className="hidden sm:flex rounded-full border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900">
                {t.nav.login}
              </Button>
            </Link>
          )}

          {!user && (
            <Link href="/auth">
              <Button className="rounded-full bg-[#0ea5a4] hover:bg-[#0b7c7b] text-white px-6">
                {t.nav.cta}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
