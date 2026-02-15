import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="wrap">
      <h1>Waggy</h1>
      <p>Clean restart is running.</p>
      <div className="links">
        <Link href="/auth">Go to Auth</Link>
      </div>
    </main>
  );
}
