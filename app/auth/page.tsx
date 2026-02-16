import Link from 'next/link';

export default function AuthPage() {
  return (
    <main className="container">
      <section className="panel">
        <h1>Auth</h1>
        <p>This is a stable placeholder auth page.</p>
        <div className="actions">
          <Link href="/app/dashboard" className="btn btn-primary">Continue as User</Link>
          <Link href="/" className="btn btn-secondary">Back Home</Link>
        </div>
      </section>
      <p className="note">Next step: wire real login API and session.</p>
      <div className="note">
        <Link href="/">Back to home</Link>
      </div>
    </main>
  );
}
