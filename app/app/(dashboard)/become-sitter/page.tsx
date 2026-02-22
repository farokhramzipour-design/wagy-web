import { VerificationStatus } from "@/components/dashboard/become-sitter/verification-status";
import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { MeResponse } from "@/services/auth-api";
import { VerificationStatusResponse } from "@/services/verification-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function BecomeSitterPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth/login");
  }

  let status: VerificationStatusResponse | null = null;
  let user: MeResponse | null = null;

  try {
    const [statusData, userData] = await Promise.all([
      apiFetch<VerificationStatusResponse>(
        API_ENDPOINTS.iranianVerification.status,
        {
          token,
          cache: "no-store", // Ensure fresh data
        }
      ),
      apiFetch<MeResponse>(
        API_ENDPOINTS.auth.me,
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
      <VerificationStatus status={status} phone={user.phone_e164} />
    </div>
  );
}
