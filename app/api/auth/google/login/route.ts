import { NextResponse } from "next/server";
import { API_BASE_URL } from "../../../../../lib/api-client";
import { API_ENDPOINTS } from "../../../../../lib/api-endpoints";
import { AUTH_COOKIES } from "../../../../../lib/auth-config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next");
  const safeNext = next && next.startsWith("/app") ? next : "/app/dashboard";
  const callbackUrl = `${url.origin}/api/auth/google/callback`;

  const loginUrl = new URL(`${API_BASE_URL}${API_ENDPOINTS.auth.googleLogin}`);
  loginUrl.searchParams.set("redirect_uri", callbackUrl);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set(AUTH_COOKIES.NEXT_URL, safeNext, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10
  });

  return response;
}

