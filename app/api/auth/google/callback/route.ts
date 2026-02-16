import { NextResponse } from "next/server";
import { API_BASE_URL } from "../../../../../lib/api-client";
import { API_ENDPOINTS } from "../../../../../lib/api-endpoints";
import { normalizeName, normalizeRole, serializeSession } from "../../../../../lib/session";

const SESSION_COOKIE = "waggy_session";
const ACCESS_COOKIE = "waggy_access_token";
const REFRESH_COOKIE = "waggy_refresh_token";
const NEXT_COOKIE = "waggy_auth_next";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id?: number | null;
};

type MeResponse = {
  phone_e164?: string;
  email?: string | null;
};

async function fetchMe(accessToken: string): Promise<MeResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) return null;
    return (await response.json()) as MeResponse;
  } catch {
    return null;
  }
}

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

  const me = await fetchMe(tokens.access_token);
  const name = normalizeName(me?.phone_e164 || me?.email || "Google User");
  const nextFromCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((entry) => entry.startsWith(`${NEXT_COOKIE}=`))
    ?.split("=")[1];
  const decodedNext = nextFromCookie ? decodeURIComponent(nextFromCookie) : "";
  const safeNext = decodedNext.startsWith("/app") ? decodedNext : "/app/dashboard";

  const response = NextResponse.redirect(new URL(safeNext, request.url));
  response.cookies.set(SESSION_COOKIE, serializeSession({ role: normalizeRole("user"), name }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(tokens.expires_in || 3600, 60)
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  response.cookies.set(NEXT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}

