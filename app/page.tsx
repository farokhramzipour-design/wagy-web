import Link from 'next/link';
import { TokenLoginBootstrap } from '../components/auth/token-login-bootstrap';

export default function HomePage() {
  return (
    <main className="container">
      <TokenLoginBootstrap />
      <section className="hero">
        <h1>Your pet deserves more than care. They deserve love.</h1>
        <p>
          Find trusted sitters in minutes and leave home with complete peace of mind.
        </p>
        <div className="actions">
          <Link href="/auth" className="btn btn-primary">Find a Loving Sitter</Link>
          <Link href="/auth" className="btn btn-accent">Become a Sitter</Link>
          <Link href="/app/dashboard" className="btn btn-secondary">Open Dashboard</Link>
        </div>
        <p className="note">Verified sitters • Secure payments • 24/7 support</p>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Boarding</h2>
          <p>A warm, safe home while you are away.</p>
        </article>
        <article className="card">
          <h2>Walking</h2>
          <p>Reliable walks to keep tails wagging every day.</p>
        </article>
        <article className="card">
          <h2>Drop-in visits</h2>
          <p>Quick check-ins, feeding, cuddles, and happy updates.</p>
        </article>
      </section>
      <div className="note">
        <Link href="/auth">Login</Link> · <Link href="/auth">Become a Sitter</Link>
      </div>
    </main>
  );
}
