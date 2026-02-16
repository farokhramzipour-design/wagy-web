import Link from 'next/link';

export default function AppIndexPage() {
  return (
    <main className="container">
      <section className="panel">
        <h1>App Area</h1>
        <p>App root is active.</p>
        <div className="actions">
          <Link href="/app/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          <Link href="/" className="btn btn-secondary">Back Home</Link>
        </div>
      </section>
    </main>
  );
}

