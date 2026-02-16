import Link from "next/link";
import { cookies } from "next/headers";
import { parseSession } from "../../lib/session";
import { Button } from "@/components/ui/button";

export default function AppIndexPage() {
  const session = parseSession(cookies().get("waggy_session")?.value);
  const name = session?.name ?? "Friend";
  const role = session?.role ?? "user";

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 lg:px-6 py-6 pb-16">
      <section className="mt-8 p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm bg-[linear-gradient(165deg,rgba(14,165,164,0.08),rgba(255,255,255,0.98))]">
        <h1 className="m-0 mb-3 text-[48px] leading-[1.2] font-bold text-neutral-800 max-md:text-[36px]">Welcome back, {name} 👋</h1>
        <p className="m-0 text-neutral-600">
          Your pet care space is ready. Everything you need is in one calm place:
          trusted sitters, bookings, messages, and updates.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-[12px] h-auto py-3 px-5 bg-[#0ea5a4] text-white shadow-sm hover:bg-[#0b7c7b]">
            <Link href="/app/dashboard">Open Dashboard</Link>
          </Button>
          <Button asChild className="rounded-[12px] h-auto py-3 px-5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-sm hover:-translate-y-px transition-all">
            <Link href="/auth">Book New Service</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-neutral-600">Verified sitters • Secure payments • Support always available</p>
      </section>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Active role</h2>
          <p className="m-0 text-base text-neutral-600">{role === "admin" ? "Admin" : "Pet Owner"}</p>
        </article>
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Upcoming bookings</h2>
          <p className="m-0 text-base text-neutral-600">2 scheduled stays this week</p>
        </article>
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Unread messages</h2>
          <p className="m-0 text-base text-neutral-600">3 new updates from sitters</p>
        </article>
        <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
          <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Pets in profile</h2>
          <p className="m-0 text-base text-neutral-600">2 pets with complete care info</p>
        </article>
      </section>

      <section className="mt-8 p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm">
        <h1 className="m-0 mb-3 text-[36px] leading-[1.2] font-bold text-neutral-800">Quick actions</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
            <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Find a sitter</h2>
            <p className="m-0 text-base text-neutral-600">Browse trusted sitters nearby and compare reviews.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-[12px] h-auto py-3 px-5 bg-[#0ea5a4] text-white shadow-sm hover:bg-[#0b7c7b]">
                <Link href="/auth">Start Search</Link>
              </Button>
            </div>
          </article>
          <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
            <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Manage bookings</h2>
            <p className="m-0 text-base text-neutral-600">View upcoming stays, requests, and recent history.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
                <Link href="/app/dashboard">View Bookings</Link>
              </Button>
            </div>
          </article>
          <article className="p-6 rounded-[16px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
            <h2 className="m-0 mb-2 text-[22px] leading-[1.3] font-semibold text-neutral-800">Messages</h2>
            <p className="m-0 text-base text-neutral-600">Chat with sitters before booking and during each stay.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
                <Link href="/app/dashboard">Open Messages</Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="mt-8 p-6 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm">
        <h1 className="m-0 mb-3 text-[36px] leading-[1.2] font-bold text-neutral-800">Need more flexibility?</h1>
        <p className="m-0 text-neutral-600">Turn your love for pets into meaningful side income on your own schedule.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-[12px] h-auto py-3 px-5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-sm hover:-translate-y-px transition-all">
            <Link href="/auth">Become a Sitter</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
