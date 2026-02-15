import Link from "next/link";
import { headers } from "next/headers";
import { routeDebug } from "@/lib/route-debug";

export const dynamic = "force-dynamic";

export default function LandingInternalPage() {
  const requestHeaders = headers();
  routeDebug("landing/page", "render", {
    host: requestHeaders.get("host"),
    forwardedHost: requestHeaders.get("x-forwarded-host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto")
  });

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Waggy</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Find trusted pet sitters and safe care for your pets.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/auth" className="underline">
          Login / Sign up
        </Link>
        <Link href="/app/become-sitter" className="underline">
          Become a sitter
        </Link>
      </div>
    </main>
  );
}
