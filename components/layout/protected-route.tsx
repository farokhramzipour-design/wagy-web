"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/types";
import { useAppStore } from "@/stores/app-store";
import { routeDebug } from "@/lib/route-debug";

interface ProtectedRouteProps extends PropsWithChildren {
  requireAuth?: boolean;
  requireRole?: Role;
}

export function ProtectedRoute({ children, requireAuth = false, requireRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAppStore((state) => state.role);

  useEffect(() => {
    routeDebug("protected-route", "evaluate", {
      pathname,
      requireAuth,
      requireRole,
      role
    });

    if (requireAuth && role === "guest") {
      routeDebug("protected-route", "redirect:/auth", { pathname, role });
      router.replace("/auth");
      return;
    }

    if (requireRole && role !== requireRole) {
      routeDebug("protected-route", "redirect:/access-denied", {
        pathname,
        role,
        requireRole
      });
      router.replace("/access-denied");
    }
  }, [pathname, requireAuth, requireRole, role, router]);

  if (requireAuth && role === "guest") {
    routeDebug("protected-route", "block-render:guest", { pathname });
    return null;
  }
  if (requireRole && role !== requireRole) {
    routeDebug("protected-route", "block-render:role-mismatch", {
      pathname,
      role,
      requireRole
    });
    return null;
  }

  return <>{children}</>;
}
