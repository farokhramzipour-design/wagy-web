import { NextResponse } from "next/server";
import { API_BASE_URL } from "../../../../../lib/api-client";
import { API_ENDPOINTS } from "../../../../../lib/api-endpoints";

const NEXT_COOKIE = "waggy_auth_next";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id?: number | null;
};

async function resolveTokens(callbackUrl: URL): Promise<TokenResponse | null> {
  const directAccess = callbackUrl.searchParams.get("access_token");
  const directRefresh = callbackUrl.searchParams.get("refresh_token");
  const directExpires = Number(callbackUrl.searchParams.get("expires_in") || "3600");

  if (directAccess && directRefresh) {
    return {
      access_token: directAccess,
      refresh_token: directRefresh,
      token_type: callbackUrl.searchParams.get("token_type") || "bearer",
      expires_in: Number.isFinite(directExpires) ? directExpires : 3600
    };
  }

  try {
    const apiCallback = `${API_BASE_URL}${API_ENDPOINTS.auth.googleCallback}${callbackUrl.search}`;
    const response = await fetch(apiCallback, { method: "GET" });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    const data = (await response.json()) as TokenResponse;
    if (!data?.access_token || !data?.refresh_token) return null;
    return data;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokens = await resolveTokens(url);

  if (!tokens) {
    const failUrl = new URL("/auth", request.url);
    failUrl.searchParams.set("error", "google_login_failed");
    return NextResponse.redirect(failUrl);
  }

  const redirectUrl = new URL("/", request.url);
  redirectUrl.searchParams.set("token", tokens.access_token);
  redirectUrl.searchParams.set("refresh_token", tokens.refresh_token);
  redirectUrl.searchParams.set("expires_in", String(Math.max(tokens.expires_in || 3600, 60)));

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(NEXT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
