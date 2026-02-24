import { EditCharityCaseWrapper } from "@/components/admin/charity/edit-charity-case-wrapper";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { adminCharityApi } from "@/services/admin-charity-api";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function EditCharityCasePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth");
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  try {
    const caseDetail = await adminCharityApi.getCaseByIdServer(id, token);

    if (!caseDetail) {
      notFound();
    }

    return <EditCharityCaseWrapper initialData={caseDetail} accessToken={token} />;
  } catch (error) {
    console.error("Failed to fetch case", error);
    // If we can't fetch it, it might not exist or we don't have permission
    // Redirect to list or show error
    // For now, redirect to list seems safest as per original behavior (mostly)
    // Original behavior: toast error and redirect to /app/charity
    // Since we can't toast easily from server component without a client wrapper triggering it,
    // we might just redirect or let the error boundary handle it.
    // Let's redirect to list.
    redirect("/app/charity");
  }
}
