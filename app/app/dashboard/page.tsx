import Link from 'next/link';
import { cookies } from 'next/headers';
import { parseSession } from '../../../lib/session';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const session = parseSession(cookies().get('waggy_session')?.value);
  const role = session?.role ?? 'user';
  const name = session?.name ?? 'Friend';
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
    <main className="w-full max-w-[1280px] mx-auto px-4 lg:px-6 py-6 pb-16">
      <section className="mt-8 p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm bg-[linear-gradient(165deg,rgba(14,165,164,0.08),rgba(255,255,255,0.98))]">
        <h1 className="m-0 mb-3 text-[48px] leading-[1.2] font-bold text-neutral-800 max-md:text-[36px]">{role === 'admin' ? 'Operations Dashboard' : `Your Care Dashboard, ${name}`}</h1>
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

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <section className="mt-8 p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm">
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
          <form action="/api/auth/logout" method="post" className="inline-flex">
            <Button variant="secondary" type="submit" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
              Logout
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
