import { PublicCharityList } from "@/components/charity/public-charity-list";
import { Header } from "@/components/layout/header";
import { parseSession } from "@/lib/session";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Charity - Waggy",
  description: "Help animals in need by donating to verified charity cases.",
};

export default function CharityPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header user={session} />
      <main className="flex-grow">
        <PublicCharityList session={session} />
      </main>
    </div>
  );
}
