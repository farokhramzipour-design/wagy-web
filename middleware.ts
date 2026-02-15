import { NextRequest, NextResponse } from "next/server";
import { isRouteDebugEnabled, routeDebug } from "./lib/route-debug";

export function middleware(request: NextRequest) {
  const debugEnabled = isRouteDebugEnabled();
  const isRoot = request.nextUrl.pathname === "/";

  if (debugEnabled) {
    routeDebug("middleware", "request", {
      method: request.method,
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      host: request.headers.get("host"),
      forwardedHost: request.headers.get("x-forwarded-host"),
      forwardedProto: request.headers.get("x-forwarded-proto"),
      forwardedUri: request.headers.get("x-forwarded-uri"),
      originalUri: request.headers.get("x-original-uri"),
      rewriteUrl: request.headers.get("x-rewrite-url"),
      referer: request.headers.get("referer")
    });
  }

  if (isRoot) {
    if (debugEnabled) {
      routeDebug("middleware", "rewrite:/ -> /__landing");
    }
    return NextResponse.rewrite(new URL("/__landing", request.url));
  }

  const response = NextResponse.next();
  if (debugEnabled) {
    response.headers.set("x-waggy-route-debug", `${request.method} ${request.nextUrl.pathname}`);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
