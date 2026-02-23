import { VerificationStatus } from "@/components/dashboard/become-sitter/verification-status";
import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { ProfileMeResponse } from "@/services/profile-api";
import { VerificationStatusResponse } from "@/services/verification-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function BecomeSitterPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth");
  }

  let status: VerificationStatusResponse | null = null;
  let user: ProfileMeResponse | null = null;

  try {
    const [statusData, userData] = await Promise.all([
      apiFetch<VerificationStatusResponse>(
        API_ENDPOINTS.iranianVerification.status,
        {
          token,
          cache: "no-store", // Ensure fresh data
        }
      ),
      apiFetch<ProfileMeResponse>(
        API_ENDPOINTS.profile.me,
        {
          token,
          cache: "no-store",
        }
      )
    ]);
    status = statusData;
    user = userData;
  } catch (error) {
    console.error("Failed to fetch verification data", error);
    // You might want to show an error state or redirect
  }

  if (!status || !user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">Failed to load verification status. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <VerificationStatus status={status} phoneVerified={user.phone_verified} />
    </div>
  );
}
