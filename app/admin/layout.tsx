"use client";

import { PropsWithChildren } from "react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { AdminShell } from "@/components/layout/admin-shell";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute requireAuth requireRole="admin">
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
