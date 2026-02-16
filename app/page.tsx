import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Trusted pet care, simplified.</h1>
        <p>
          Clean baseline is live and stable. Continue with auth or go directly
          to the demo dashboard.
        </p>
        <div className="actions">
          <Link href="/auth" className="btn btn-primary">Get Started</Link>
          <Link href="/app/dashboard" className="btn btn-secondary">Open Dashboard</Link>
        </div>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Boarding</h2>
          <p>Overnight stays with vetted sitters near you.</p>
        </article>
        <article className="card">
          <h2>Walking</h2>
          <p>Reliable daily walks with live updates.</p>
        </article>
        <article className="card">
          <h2>Drop-in visits</h2>
          <p>Quick check-ins, feeding, and companionship.</p>
        </article>
      </section>
      <div className="note">
        <Link href="/auth">Login</Link>
      </div>
    </main>
  );
}
