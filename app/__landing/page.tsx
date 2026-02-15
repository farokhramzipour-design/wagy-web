import { LandingPageSections } from "@/components/sections/landing-page";
import { headers } from "next/headers";
import { routeDebug } from "@/lib/route-debug";

export const dynamic = "force-dynamic";

export default function LandingInternalPage() {
  const requestHeaders = headers();
  routeDebug("__landing/page", "render", {
    host: requestHeaders.get("host"),
    forwardedHost: requestHeaders.get("x-forwarded-host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto")
  });

  return <LandingPageSections />;
}

