"use client";

import { PropsWithChildren } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";

export default function UserAppLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute requireAuth>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
