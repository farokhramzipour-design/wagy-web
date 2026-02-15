"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/types";
import { useAppStore } from "@/stores/app-store";

interface ProtectedRouteProps extends PropsWithChildren {
  requireAuth?: boolean;
  requireRole?: Role;
}

export function ProtectedRoute({ children, requireAuth = false, requireRole }: ProtectedRouteProps) {
  const router = useRouter();
  const role = useAppStore((state) => state.role);

  useEffect(() => {
    if (requireAuth && role === "guest") {
      router.replace("/auth");
      return;
    }

    if (requireRole && role !== requireRole) {
      router.replace("/access-denied");
    }
  }, [requireAuth, requireRole, role, router]);

  if (requireAuth && role === "guest") return null;
  if (requireRole && role !== requireRole) return null;

  return <>{children}</>;
}
