import { cookies } from 'next/headers';
import { parseSession } from '@/lib/session';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { getDiscoveryServiceTypes, SearchDiscoveryServiceType } from "@/services/search-api";

export default async function DashboardPage() {
  const session = parseSession(cookies().get('waggy_session')?.value);
  const name = session?.name ?? 'Friend';
  const isProvider = session?.isProvider ?? false;
  const isAdmin = session?.isAdmin ?? false;

  let initialServiceTypes: SearchDiscoveryServiceType[] = [];
  try {
      const res = await getDiscoveryServiceTypes();
      initialServiceTypes = res.items;
  } catch (error) {
      console.error("Failed to fetch service types", error);
  }

  return (
    <DashboardContent 
        userName={name} 
        isProvider={isProvider} 
        isAdmin={isAdmin} 
        initialServiceTypes={initialServiceTypes}
    />
  );
}
