import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CharityPhonePageClient } from "./phone-page-client";

export default function CharityPhonePage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth");
  }

  return <CharityPhonePageClient token={token} />;
}
