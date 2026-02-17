import { cookies } from "next/headers";
import { LandingPage } from "../components/landing/landing-page";
import { parseSession } from "../lib/session";

export default function RootPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  return <LandingPage user={session} />;
}
