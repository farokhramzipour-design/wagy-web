import Link from 'next/link';
import { cookies } from 'next/headers';

export default function DashboardPage() {
  const role = cookies().get('waggy_session')?.value ?? 'guest';

  return (
    <main className="container">
      <section className="panel">
        <h1>Dashboard</h1>
        <p>Clean and stable dashboard placeholder. Signed in as: <strong>{role}</strong>.</p>
        <ul className="list">
          <li>Upcoming bookings: 0</li>
          <li>Unread messages: 0</li>
          <li>Saved sitters: 0</li>
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
