import { ProfileSettings } from "@/components/profile/profile-settings";
import { parseSession } from "@/lib/session";
import { getProfile, getProfileCompletion } from "@/services/profile-api";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("waggy_access_token")?.value;
  const session = parseSession(cookieStore.get("waggy_session")?.value);

  let profileCompletion = null;
  let profile = null;

  if (accessToken) {
    try {
      const [completionResult, profileResult] = await Promise.allSettled([
        getProfileCompletion(accessToken),
        getProfile(accessToken)
      ]);

      if (completionResult.status === "fulfilled") {
        profileCompletion = completionResult.value;
      }

      if (profileResult.status === "fulfilled") {
        profile = profileResult.value;
      }
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  }

  return <ProfileSettings completion={profileCompletion} user={session} profile={profile} accessToken={accessToken} />;
}
