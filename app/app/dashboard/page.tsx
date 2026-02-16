import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="container">
      <section className="panel">
        <h1>Dashboard</h1>
        <p>Clean and stable dashboard placeholder.</p>
        <ul className="list">
          <li>Upcoming bookings: 0</li>
          <li>Unread messages: 0</li>
          <li>Saved sitters: 0</li>
        </ul>
        <div className="actions">
          <Link href="/app" className="btn btn-secondary">App Home</Link>
          <Link href="/" className="btn btn-secondary">Public Home</Link>
        </div>
      </section>
    </main>
  );
}

