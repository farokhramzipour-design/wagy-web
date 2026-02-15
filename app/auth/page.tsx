import Link from 'next/link';

export default function AuthPage() {
  return (
    <main className="wrap">
      <h1>Auth</h1>
      <p>Auth placeholder page.</p>
      <div className="links">
        <Link href="/">Back to Home</Link>
      </div>
    </main>
  );
}
