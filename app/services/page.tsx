import { cookies } from "next/headers";
import { parseSession } from "../../lib/session";
import ServicesPageClient from "../../components/services/services-page";

export default function ServicesRoutePage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  return <ServicesPageClient user={session} />;
}
