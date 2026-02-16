import Link from 'next/link';
import { cookies } from 'next/headers';
import { parseSession } from '../../lib/session';

export default function AppIndexPage() {
  const session = parseSession(cookies().get('waggy_session')?.value);

  return (
    <main className="container">
      <section className="panel">
        <h1>App Area</h1>
        <p>
          App root is active. Signed in as:{" "}
          <strong>{session?.name ?? "Guest"}</strong> ({session?.role ?? "unknown"}).
        </p>
        <div className="actions">
          <Link href="/app/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          <Link href="/" className="btn btn-secondary">Back Home</Link>
        </div>
      </section>
    </main>
  );
}
