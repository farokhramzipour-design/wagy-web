"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";

export function ProtectedRoute({ children, requireRole }: { children: React.ReactNode; requireRole?: "admin" | "user" }) {
  const role = useAppStore((s) => s.role);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (role === "guest") {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (requireRole && role !== requireRole) {
      router.replace("/access-denied");
    }
  }, [pathname, requireRole, role, router]);

  if (role === "guest") return null;
  if (requireRole && role !== requireRole) return null;

  return <>{children}</>;
}
