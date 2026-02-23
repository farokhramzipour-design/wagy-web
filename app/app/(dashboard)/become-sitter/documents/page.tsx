import { DocumentsStep } from "@/components/dashboard/become-sitter/steps/documents-step";
import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { VerificationStatusResponse } from "@/services/verification-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth");
  }

  let status: VerificationStatusResponse | null = null;

  try {
    status = await apiFetch<VerificationStatusResponse>(
      API_ENDPOINTS.iranianVerification.status,
      {
        token,
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error("Failed to fetch verification status", error);
  }

  if (!status) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">Failed to load verification status. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <DocumentsStep status={status} />
    </div>
  );
}
