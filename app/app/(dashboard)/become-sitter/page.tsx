import { cookies } from "next/headers";
import { parseSession } from "@/lib/session";
import { VerificationStatus } from "@/components/dashboard/become-sitter/verification-status";
import { redirect } from "next/navigation";

export default function BecomeSitterPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  // If user is already a provider, they might not need this page, 
  // but let's keep it accessible for now or redirect to provider dashboard.
  // if (session?.isProvider) {
  //   redirect("/app/dashboard");
  // }

  const phone = session?.phone ?? null;

  return (
    <div className="container mx-auto py-8">
      <VerificationStatus phone={phone} />
    </div>
  );
}
