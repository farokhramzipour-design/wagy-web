import { NextRequest, NextResponse } from "next/server";
import { parseSession } from "@/lib/session";

const SESSION_COOKIE = "waggy_session";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);
  const requiresUser = pathname.startsWith("/app");
  const requiresAdmin = pathname.startsWith("/admin");

  if ((requiresUser || requiresAdmin) && !session) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (requiresAdmin && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  if (pathname === "/auth" && session) {
    if (session.role === "admin") {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/auth"]
};
