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
    </main>
  );
}
