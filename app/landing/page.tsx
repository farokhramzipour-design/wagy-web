import dynamicImport from "next/dynamic";
import Link from "next/link";
import { headers } from "next/headers";
import { routeDebug } from "@/lib/route-debug";

export const dynamic = "force-dynamic";

const LandingPageSections = dynamicImport(
  () => import("@/components/sections/landing-page").then((mod) => mod.LandingPageSections),
  {
    ssr: false,
    loading: () => (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Waggy</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Loading landing page. If this continues, use the direct auth entry below.
        </p>
        <div className="mt-6">
          <Link href="/auth" className="underline">
            Continue to Login
          </Link>
        </div>
      </main>
    )
  }
);

export default function LandingInternalPage() {
  const requestHeaders = headers();
  routeDebug("landing/page", "render", {
    host: requestHeaders.get("host"),
    forwardedHost: requestHeaders.get("x-forwarded-host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto")
  });

  return <LandingPageSections />;
}
