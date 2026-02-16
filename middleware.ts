import { NextRequest, NextResponse } from "next/server";
import { parseSession } from "./lib/session";
import { API_ENDPOINTS } from "./lib/api-endpoints";
import { isJwtExpiringSoon } from "./lib/token";

const SESSION_COOKIE = "waggy_session";
const ACCESS_COOKIE = "waggy_access_token";
const REFRESH_COOKIE = "waggy_refresh_token";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.waggy.ir";

type RefreshResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    if (!response.ok) return null;
    const data = (await response.json()) as RefreshResponse;
    if (!data?.access_token) return null;
    return data;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const protectedPath = pathname.startsWith("/app");

  const shouldTryRefresh =
    Boolean(session && protectedPath && refreshToken) &&
    isJwtExpiringSoon(accessToken);

  if (shouldTryRefresh && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed?.access_token) {
      const response = NextResponse.next();
      response.cookies.set(ACCESS_COOKIE, refreshed.access_token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: Math.max(refreshed.expires_in || 3600, 60)
      });
      return response;
    }
  }

  if (protectedPath && !session) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (protectedPath && !accessToken && !refreshToken) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/auth" && session) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*", "/auth"]
};
