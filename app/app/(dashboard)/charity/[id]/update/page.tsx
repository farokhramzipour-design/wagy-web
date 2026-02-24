import { AddUpdateWrapper } from "@/components/admin/charity/add-update-wrapper";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function AddUpdatePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth");
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  return <AddUpdateWrapper charityCaseId={id} accessToken={token} />;
}
