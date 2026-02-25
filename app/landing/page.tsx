import { cookies } from "next/headers";
import { LandingPage } from "../../components/landing/landing-page";
import { parseSession } from "../../lib/session";
import { getDiscoveryServiceTypes, SearchDiscoveryServiceType } from "@/services/search-api";

export default async function LandingRoutePage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  let initialServiceTypes: SearchDiscoveryServiceType[] = [];
  try {
    const res = await getDiscoveryServiceTypes();
    initialServiceTypes = res.items;
  } catch (error) {
    console.error("Failed to fetch service types", error);
  }

  return <LandingPage user={session} initialServiceTypes={initialServiceTypes} />;
}
