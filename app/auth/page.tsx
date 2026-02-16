import Link from 'next/link';
import { AuthForm } from '../../components/auth/auth-form';

export default function AuthPage({
  searchParams
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next?.startsWith('/app') ? searchParams.next : '/app/dashboard';

  return (
    <main className="container">
      <AuthForm nextPath={next} />
      <p className="note">
        Session/tokens are stored in HTTP-only cookies: <code>waggy_session</code>,{" "}
        <code>waggy_access_token</code>, <code>waggy_refresh_token</code>.
      </p>
      <div className="note">
        <Link href="/">Back to home</Link>
      </div>
    </main>
  );
}
