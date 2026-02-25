import { cookies } from "next/headers";
import { LandingPage } from "../components/landing/landing-page";
import { parseSession } from "../lib/session";
import { getProfileCompletion } from "@/services/profile-api";
import { getDiscoveryServiceTypes, SearchDiscoveryServiceType } from "@/services/search-api";

export default async function RootPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const accessToken = cookieStore.get("waggy_access_token")?.value;
  const session = parseSession(sessionCookie);

  let profileCompletion = null;
  if (accessToken) {
    try {
      profileCompletion = await getProfileCompletion(accessToken);
    } catch (e) {
      // ignore
    }
  }

  let initialServiceTypes: SearchDiscoveryServiceType[] = [];
  try {
    const res = await getDiscoveryServiceTypes();
    initialServiceTypes = res.items;
  } catch (error) {
    console.error("Failed to fetch service types", error);
  }

  return <LandingPage user={session} profileCompletion={profileCompletion} initialServiceTypes={initialServiceTypes} />;
}
