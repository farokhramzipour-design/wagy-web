import { cookies } from "next/headers";
import { parseSession } from "../../lib/session";
import ServicesPageClient from "../../components/services/services-page";
import { Metadata } from "next";
import en from '../../locales/en.json';
import fa from '../../locales/fa.json';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const dict = lang === 'fa' ? fa : en;

  return {
    title: dict.servicesPage.title,
    description: dict.servicesPage.subtitle,
  };
}

export default function ServicesRoutePage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("waggy_session")?.value;
  const session = parseSession(sessionCookie);

  return <ServicesPageClient user={session} />;
}
