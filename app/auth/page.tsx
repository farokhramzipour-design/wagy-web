import Link from 'next/link';

export default function AuthPage({
  searchParams
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next?.startsWith('/app') ? searchParams.next : '/app/dashboard';

  return (
    <main className="container">
      <section className="panel">
        <h1>Auth</h1>
        <p>This is a stable server-side auth placeholder with cookie session.</p>
        <div className="actions">
          <form action="/api/auth/login" method="post" className="inline-form">
            <input type="hidden" name="role" value="user" />
            <input type="hidden" name="next" value={next} />
            <button type="submit" className="btn btn-primary">Continue as User</button>
          </form>
          <form action="/api/auth/login" method="post" className="inline-form">
            <input type="hidden" name="role" value="admin" />
            <input type="hidden" name="next" value="/app/dashboard" />
            <button type="submit" className="btn btn-secondary">Continue as Admin</button>
          </form>
          <Link href="/" className="btn btn-secondary">Back Home</Link>
        </div>
      </section>
      <p className="note">Session is stored in HTTP-only cookie: <code>waggy_session</code>.</p>
      <div className="note">
        <Link href="/">Back to home</Link>
      </div>
    </main>
  );
}
