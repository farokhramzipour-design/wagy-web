import { CharityCaseWrapper } from "@/components/admin/charity/charity-case-wrapper";
import { CharityVerificationStatus } from "@/components/admin/charity/charity-verification-status";
import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { ProfileMeResponse } from "@/services/profile-api";
import { VerificationStatusResponse } from "@/services/verification-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateCharityCasePage() {
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
          cache: "no-store",
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
  }

  if (!status || !user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">Failed to load verification status. Please try again later.</p>
      </div>
    );
  }

  // Check if steps 1-4 are verified
  const isAddressVerified = status.provider_address?.status === "approved";
  const isPhoneVerified = user.phone_verified;
  const isIdentityVerified = status.national_code?.added && status.shahkar?.verified;
  const isDocumentsVerified =
    status.documents.national_card_front.status === "approved" &&
    status.documents.national_card_back.status === "approved";

  if (isAddressVerified && isPhoneVerified && isIdentityVerified && isDocumentsVerified) {
    return <CharityCaseWrapper accessToken={token} />;
  }

  return (
    <div className="container mx-auto py-8">
      <CharityVerificationStatus status={status} phoneVerified={user.phone_verified} />
    </div>
  );
}
