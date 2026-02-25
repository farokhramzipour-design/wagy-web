import { SearchPageClient } from "@/components/search/search-page-client";
import { parseSession } from "@/lib/session";
import { getProfileCompletion } from "@/services/profile-api";
import { getDiscoveryServiceTypes, SearchDiscoveryServiceType } from "@/services/search-api";
import { cookies } from "next/headers";

export default async function SearchPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("waggy_access_token")?.value;
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const user = parseSession(sessionCookie);

  let profileCompletion = null;
  if (token) {
    try {
      profileCompletion = await getProfileCompletion(token);
    } catch (error) {
      console.error("Failed to fetch profile completion", error);
    }
  }

  let initialServiceTypes: SearchDiscoveryServiceType[] = [];
  try {
    const res = await getDiscoveryServiceTypes();
    initialServiceTypes = res.items;
  } catch (error) {
    console.error("Failed to fetch service types", error);
  }

  return (
    <SearchPageClient
      userToken={token}
      user={user}
      profileCompletion={profileCompletion}
      initialServiceTypes={initialServiceTypes}
    />
  );
}
