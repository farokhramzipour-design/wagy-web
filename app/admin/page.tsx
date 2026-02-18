import { cookies } from "next/headers";
import { parseSession } from "@/lib/session";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

type AdminRole = "super_admin" | "admin" | "operator";

export default function AdminPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);
  
  // Default to 'operator' if adminRole is not set or invalid, though layout should catch non-admins.
  // We trust session.adminRole because it comes from the httpOnly cookie we set on login.
  const role = (session?.adminRole as AdminRole) || "operator";

  return <AdminDashboard session={session} role={role} />;
}
