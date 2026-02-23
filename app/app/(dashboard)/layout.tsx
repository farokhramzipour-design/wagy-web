import { cookies } from "next/headers";
import { parseSession } from "@/lib/session";
import { Header } from "@/components/layout/header";
import { Sidebar, DashboardSidebarNav } from "@/components/dashboard/sidebar";
import { getProfile } from "@/services/profile-api";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const accessToken = cookieStore.get("waggy_access_token")?.value;
  const session = parseSession(sessionCookie);

  let profile = null;
  if (accessToken) {
    try {
      profile = await getProfile(accessToken);
    } catch (error) {
      console.error("Failed to fetch profile in dashboard layout", error);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header user={session} showNavLinks={false} mobileNav={<DashboardSidebarNav session={session} profile={profile} />} />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar session={session} profile={profile} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
