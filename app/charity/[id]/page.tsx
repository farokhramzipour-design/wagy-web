import { PublicCharityDetails } from "@/components/charity/public-charity-details";
import { Header } from "@/components/layout/header";
import { parseSession } from "@/lib/session";
import { Metadata } from "next";
import { cookies } from "next/headers";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, we might fetch the case title here for dynamic metadata
  return {
    title: `Charity Case #${params.id} - Waggy`,
    description: "View details and donate to this charity case.",
  };
}

export default function CharityDetailsPage({ params }: Props) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header user={session} />
      <main className="flex-grow">
        <PublicCharityDetails id={parseInt(params.id)} isLoggedIn={isLoggedIn} />
      </main>
    </div>
  );
}
