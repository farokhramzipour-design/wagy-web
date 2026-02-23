import { PhoneVerificationForm } from "@/components/profile/phone-verification-form";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function PhoneVerificationPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8">
      <PhoneVerificationForm token={token} />
    </div>
  );
}
