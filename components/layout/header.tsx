"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import type { SessionData } from "@/lib/session";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";

type Lang = "en" | "fa";

const content = { en, fa };

interface HeaderProps {
  user: SessionData | null;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export function Header({ user, lang, setLang }: HeaderProps) {
  const t = useMemo(() => content[lang], [lang]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link href="/landing" className="text-2xl font-bold tracking-tight text-[#0ea5a4]">Waggy</Link>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600">
          <Link href="/landing#services" className="hover:text-[#0ea5a4] transition-colors">{t.nav.services}</Link>
          <Link href="/landing#how" className="hover:text-[#0ea5a4] transition-colors">{t.nav.how}</Link>
          <Link href="/landing#safety" className="hover:text-[#0ea5a4] transition-colors">{t.nav.safety}</Link>
          <Link href="/landing#become" className="hover:text-[#0ea5a4] transition-colors">{t.nav.sitter}</Link>
        </nav>

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
