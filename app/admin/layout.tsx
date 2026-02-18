import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { parseSession } from "@/lib/session";
import { Header } from "@/components/layout/header";
import { AdminSidebar, AdminSidebarNav } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  if (!session?.isAdmin) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header user={session} showNavLinks={false} mobileNav={<AdminSidebarNav session={session} />} />
      <div className="flex max-w-7xl mx-auto">
        <AdminSidebar session={session} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
