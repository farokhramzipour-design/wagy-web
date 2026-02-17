import { cookies } from "next/headers";
import { parseSession } from "@/lib/session";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header user={session} showNavLinks={false} />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
