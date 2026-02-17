import Link from 'next/link';
import { cookies } from 'next/headers';
import { parseSession } from '@/lib/session';
import { Button } from '@/components/ui/button';
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";

const content = { en, fa };

export default function DashboardPage() {
  const session = parseSession(cookies().get('waggy_session')?.value);
  const lang = (cookies().get("waggy_lang")?.value as "en" | "fa") || "en";
  const t = content[lang].dashboard;

  const role = session?.role ?? 'user';
  const name = session?.name ?? 'Friend';
  const isAdmin = session?.isAdmin ?? false;
  const isProvider = session?.isProvider ?? false;

  const cards = role === "admin"
    ? [
        "Pending approvals: 4",
        "Open disputes: 2",
        "Platform revenue today: $1,240"
      ]
    : [
        "Upcoming bookings: 2",
        "Unread messages: 3",
        "Saved sitters: 6"
      ];

  return (
    <div className="space-y-6">
      <section className="p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm bg-[linear-gradient(165deg,rgba(14,165,164,0.08),rgba(255,255,255,0.98))]">
        <h1 className="m-0 mb-3 text-[48px] leading-[1.2] font-bold text-neutral-800 max-md:text-[36px]">
          {t.overview.welcome.replace("{name}", name)}
        </h1>
        <p className="m-0 text-neutral-600">
          {role === 'admin'
            ? 'Monitor trust, service quality, and marketplace health in real time.'
            : 'Track bookings, sitter updates, and care routines without stress.'}
        </p>
        <ul className="mt-4 pl-5 text-neutral-600 list-disc">
          {cards.map((item) => (
            <li key={item} className="mt-1.5">{item}</li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Response speed</h2>
          <p className="m-0 text-base text-neutral-600">Avg 12 min</p>
        </article>
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Safety score</h2>
          <p className="m-0 text-base text-neutral-600">98% verified interactions</p>
        </article>
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Support health</h2>
          <p className="m-0 text-base text-neutral-600">All tickets answered today</p>
        </article>
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Peace-of-mind index</h2>
          <p className="m-0 text-base text-neutral-600">Stable and improving</p>
        </article>
      </section>

      <section className="p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm">
        <h1 className="m-0 mb-3 text-[36px] leading-[1.2] font-bold text-neutral-800">Action center</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-[12px] h-auto py-3 px-5 bg-[#0ea5a4] text-white shadow-sm hover:bg-[#0b7c7b]">
            <Link href="/auth">Create New Booking</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
            <Link href="/app">App Home</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
            <Link href="/">Public Home</Link>
          </Button>
          
          {!isProvider && (
            <Button asChild variant="outline" className="rounded-[12px] h-auto py-3 px-5 border-[#0ea5a4] text-[#0ea5a4] hover:bg-[#0ea5a4]/10">
              <Link href="/become-sitter">{t.overview.becomeSitter}</Link>
            </Button>
          )}
        </div>
      </section>

      {isProvider && (
        <section className="p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm">
          <h1 className="m-0 mb-3 text-[36px] leading-[1.2] font-bold text-neutral-800">{t.overview.providerCenter}</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
              <Link href="/provider/calendar">{t.overview.calendar}</Link>
            </Button>
            <Button asChild variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
              <Link href="/provider/requests">{t.overview.requests}</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
