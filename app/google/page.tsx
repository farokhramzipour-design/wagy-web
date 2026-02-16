import { Suspense } from "react";
import { TokenLoginBootstrap } from "../../components/auth/token-login-bootstrap";

export default function GoogleTokenPage() {
  return (
    <Suspense fallback={null}>
      <TokenLoginBootstrap />
    </Suspense>
  );
}
