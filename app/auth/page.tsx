import { AuthForm } from '../../components/auth/auth-form';

export default function AuthPage({
  searchParams
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next?.startsWith('/app') ? searchParams.next : '/app/dashboard';

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[radial-gradient(140%_120%_at_0%_0%,rgba(14,165,164,0.16),rgba(255,255,255,0)_55%),radial-gradient(120%_100%_at_100%_0%,rgba(255,107,107,0.12),rgba(255,255,255,0)_48%),linear-gradient(180deg,#eff8f7,#f9fcfb)]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-[120px] -top-[120px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(14,124,123,0.18),transparent_70%)] animate-pulse" />
        <div className="absolute right-[-100px] bottom-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,107,107,0.08),transparent_70%)] animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <AuthForm nextPath={next} />
      </div>
    </main>
  );
}
