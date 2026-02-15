import { headers } from "next/headers";
import { routeDebug } from "@/lib/route-debug";

export default function AppIndex() {
  const requestHeaders = headers();
  routeDebug("app/app/page", "render", {
    host: requestHeaders.get("host"),
    forwardedHost: requestHeaders.get("x-forwarded-host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto")
  });

  return null;
}
