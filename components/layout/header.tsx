"use client";

import { NotificationList } from "@/components/dashboard/notification-list";
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
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import type { SessionData } from "@/lib/session";
import { ProfileCompletionResponse } from "@/services/profile-api";
import { LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
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
  profileCompletion?: ProfileCompletionResponse | null;
}

export function Header({ user, showNavLinks = true, mobileNav, profileCompletion }: HeaderProps) {
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

          {user && (
            <div className="flex items-center gap-2">
              <NotificationList />

              <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5 text-neutral-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {profileCompletion && !profileCompletion.is_complete && (
                    <>
                      <div className="px-2 py-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-medium text-neutral-500">
                            {t.profile.completion}
                          </span>
                          <span className="text-xs font-bold text-[#0ea5a4]">
                            {profileCompletion.completion_percentage}%
                          </span>
                        </div>
                        <Progress value={profileCompletion.completion_percentage} className="h-1.5" />
                        <Link
                          href="/app/profile"
                          className="text-[10px] text-[#0ea5a4] hover:underline mt-1.5 block text-right"
                        >
                          {t.profile.completeProfile}
                        </Link>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/app/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t.nav.dashboard}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/app/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t.profile.settings}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.auth.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                {t.auth.login}
              </Link>
              <Button asChild className="bg-[#0ea5a4] hover:bg-[#0b7c7b] text-white">
                <Link href="/auth/register">{t.auth.register}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
