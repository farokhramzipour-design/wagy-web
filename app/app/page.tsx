import Link from "next/link";
import { cookies } from "next/headers";
import { parseSession } from "../../lib/session";

export default function AppIndexPage() {
  const session = parseSession(cookies().get("waggy_session")?.value);
  const name = session?.name ?? "Friend";
  const role = session?.role ?? "user";

  return (
    <main className="container app-shell">
      <section className="panel app-hero">
        <h1>Welcome back, {name} 👋</h1>
        <p>
          Your pet care space is ready. Everything you need is in one calm place:
          trusted sitters, bookings, messages, and updates.
        </p>
        <div className="actions">
          <Link href="/app/dashboard" className="btn btn-primary">Open Dashboard</Link>
          <Link href="/auth" className="btn btn-accent">Book New Service</Link>
          <Link href="/" className="btn btn-secondary">Back Home</Link>
        </div>
        <p className="note">Verified sitters • Secure payments • Support always available</p>
      </section>

      <section className="grid app-kpi-grid">
        <article className="card">
          <h2>Active role</h2>
          <p>{role === "admin" ? "Admin" : "Pet Owner"}</p>
        </article>
        <article className="card">
          <h2>Upcoming bookings</h2>
          <p>2 scheduled stays this week</p>
        </article>
        <article className="card">
          <h2>Unread messages</h2>
          <p>3 new updates from sitters</p>
        </article>
        <article className="card">
          <h2>Pets in profile</h2>
          <p>2 pets with complete care info</p>
        </article>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>Quick actions</h1>
        <div className="grid app-actions-grid" style={{ marginTop: 16 }}>
          <article className="card">
            <h2>Find a sitter</h2>
            <p>Browse trusted sitters nearby and compare reviews.</p>
            <div className="actions">
              <Link href="/auth" className="btn btn-primary">Start Search</Link>
            </div>
          </article>
          <article className="card">
            <h2>Manage bookings</h2>
            <p>View upcoming stays, requests, and recent history.</p>
            <div className="actions">
              <Link href="/app/dashboard" className="btn btn-secondary">View Bookings</Link>
            </div>
          </article>
          <article className="card">
            <h2>Messages</h2>
            <p>Chat with sitters before booking and during each stay.</p>
            <div className="actions">
              <Link href="/app/dashboard" className="btn btn-secondary">Open Messages</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>Need more flexibility?</h1>
        <p>Turn your love for pets into meaningful side income on your own schedule.</p>
        <div className="actions">
          <Link href="/auth" className="btn btn-accent">Become a Sitter</Link>
        </div>
      </section>
    </main>
  );
}
