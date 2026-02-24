import { CharityUpdatesWrapper } from "@/components/admin/charity/charity-updates-wrapper";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { adminCharityApi } from "@/services/admin-charity-api";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function CharityUpdatesPage({ params }: { params: { id: string } }) {
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
    const updates = await adminCharityApi.getUpdatesServer(id, token);

    return <CharityUpdatesWrapper charityCaseId={id} updates={updates} />;
  } catch (error) {
    console.error("Failed to fetch updates", error);
    // If it fails, maybe the case doesn't exist or unauthorized
    redirect("/app/charity");
  }
}
