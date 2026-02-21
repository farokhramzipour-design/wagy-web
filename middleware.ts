import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "./lib/api-endpoints";
import { AUTH_COOKIES } from "./lib/auth-config";
import { parseSession } from "./lib/session";
import { isJwtExpiringSoon } from "./lib/token";

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

  const session = parseSession(request.cookies.get(AUTH_COOKIES.SESSION)?.value);
  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
  const protectedPath = pathname.startsWith("/app");

  const shouldTryRefresh =
    Boolean(session && protectedPath && refreshToken) &&
    isJwtExpiringSoon(accessToken);

  if (shouldTryRefresh && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed?.access_token) {
      const response = NextResponse.next();
      response.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, refreshed.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
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
