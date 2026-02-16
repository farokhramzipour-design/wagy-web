import Link from 'next/link';
import { cookies } from 'next/headers';
import { parseSession } from '../../../lib/session';

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
    <main className="container app-shell">
      <section className="panel app-hero">
        <h1>{role === 'admin' ? 'Operations Dashboard' : `Your Care Dashboard, ${name}`}</h1>
        <p>
          {role === 'admin'
            ? 'Monitor trust, service quality, and marketplace health in real time.'
            : 'Track bookings, sitter updates, and care routines without stress.'}
        </p>
        <ul className="list app-stat-list">
          {cards.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="grid app-kpi-grid">
        <article className="card">
          <h2>Response speed</h2>
          <p>Avg 12 min</p>
        </article>
        <article className="card">
          <h2>Safety score</h2>
          <p>98% verified interactions</p>
        </article>
        <article className="card">
          <h2>Support health</h2>
          <p>All tickets answered today</p>
        </article>
        <article className="card">
          <h2>Peace-of-mind index</h2>
          <p>Stable and improving</p>
        </article>
      </section>

      <section className="panel">
        <h1 style={{ fontSize: 36 }}>Action center</h1>
        <div className="actions">
          <Link href="/auth" className="btn btn-primary">Create New Booking</Link>
          <Link href="/app" className="btn btn-secondary">App Home</Link>
          <Link href="/" className="btn btn-secondary">Public Home</Link>
          <form action="/api/auth/logout" method="post" className="inline-form">
            <button type="submit" className="btn btn-secondary">Logout</button>
          </form>
        </div>
      </section>
    </main>
  );
}
