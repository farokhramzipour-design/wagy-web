import { cookies } from 'next/headers';
import { parseSession } from '@/lib/session';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default function DashboardPage() {
  const session = parseSession(cookies().get('waggy_session')?.value);
  const name = session?.name ?? 'Friend';
  const isProvider = session?.isProvider ?? false;

  return (
    <DashboardContent userName={name} isProvider={isProvider} />
  );
}
