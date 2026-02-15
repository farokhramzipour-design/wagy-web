import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { routeDebug } from "@/lib/route-debug";

export default function AdminIndex() {
  const requestHeaders = headers();
  routeDebug("app/admin/page", "redirect:/admin/overview", {
    host: requestHeaders.get("host"),
    forwardedHost: requestHeaders.get("x-forwarded-host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto")
  });
  redirect("/admin/overview");
}
