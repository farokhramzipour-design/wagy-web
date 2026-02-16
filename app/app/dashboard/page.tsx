import Link from 'next/link';
import { cookies } from 'next/headers';
import { parseSession } from '../../../lib/session';

export default function DashboardPage() {
  const session = parseSession(cookies().get('waggy_session')?.value);
  const role = session?.role ?? 'user';
  const name = session?.name ?? 'User';
  const cards = role === "admin"
    ? [
        "Pending approvals: 0",
        "Open disputes: 0",
        "Platform revenue today: $0"
      ]
    : [
        "Upcoming bookings: 0",
        "Unread messages: 0",
        "Saved sitters: 0"
      ];

  return (
    <main className="container">
      <section className="panel">
        <h1>Dashboard</h1>
        <p>
          Welcome, <strong>{name}</strong>. Active role: <strong>{role}</strong>.
        </p>
        <ul className="list">
          {cards.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="actions">
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
