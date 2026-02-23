import { PhoneStep } from "@/components/dashboard/become-sitter/steps/phone-step";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function PhonePage() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto py-8">
      <PhoneStep token={token} />
    </div>
  );
}
