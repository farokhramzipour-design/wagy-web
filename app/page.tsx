import { cookies } from "next/headers";
import { LandingPage } from "../components/landing/landing-page";
import { parseSession } from "../lib/session";
import { getProfileCompletion } from "@/services/profile-api";

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

  return <LandingPage user={session} profileCompletion={profileCompletion} />;
}
