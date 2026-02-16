import { PublicHeader } from "@/components/layout/public-header";
import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="page-shell">
      <PublicHeader />
      <main className="container py-12">
        <AuthForm />
      </main>
    </div>
  );
}
