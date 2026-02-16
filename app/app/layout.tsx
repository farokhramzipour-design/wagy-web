import { ProtectedRoute } from "@/components/layout/protected-route";
import { ProtectedShell } from "@/components/layout/protected-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ProtectedShell>{children}</ProtectedShell>
    </ProtectedRoute>
  );
}
