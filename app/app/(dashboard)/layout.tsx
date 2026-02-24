import { DashboardSidebarNav, Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/layout/header";
import { parseSession } from "@/lib/session";
import { getProfile, getProfileCompletion } from "@/services/profile-api";
import { walletApi } from "@/services/wallet-api";
import { cookies } from "next/headers";

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
  let profileCompletion = null;
  let walletBalance = null;

  if (accessToken) {
    const [profileResult, completionResult, balanceResult] = await Promise.allSettled([
      getProfile(accessToken),
      getProfileCompletion(accessToken),
      walletApi.getBalance(accessToken)
    ]);

    if (profileResult.status === "fulfilled") {
      profile = profileResult.value;
    } else {
      console.error("Failed to fetch profile in dashboard layout", profileResult.reason);
    }

    if (completionResult.status === "fulfilled") {
      profileCompletion = completionResult.value;
    } else {
      console.error("Failed to fetch profile completion in dashboard layout", completionResult.reason);
    }

    if (balanceResult.status === "fulfilled") {
      walletBalance = balanceResult.value.balance_minor;
    } else {
      console.error("Failed to fetch wallet balance in dashboard layout", balanceResult.reason);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        user={session}
        showNavLinks={false}
        mobileNav={<DashboardSidebarNav session={session} profile={profile} />}
        profileCompletion={profileCompletion}
        walletBalance={walletBalance}
      />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar session={session} profile={profile} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
