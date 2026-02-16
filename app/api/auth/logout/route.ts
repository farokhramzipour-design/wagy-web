import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../../../lib/api-endpoints";

const SESSION_COOKIE = "waggy_session";
const ACCESS_COOKIE = "waggy_access_token";
const REFRESH_COOKIE = "waggy_refresh_token";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.waggy.ir";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const refreshTokenMatch = cookieHeader
    .split(";")
    .map((v) => v.trim())
    .find((entry) => entry.startsWith(`${REFRESH_COOKIE}=`));
  const refreshToken = refreshTokenMatch
    ? decodeURIComponent(refreshTokenMatch.split("=")[1] || "")
    : "";

  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
    } catch {
      // Ignore backend logout failures and continue local logout.
    }
  }

  const response = new NextResponse(null, {
    status: 303,
    headers: { Location: "/" }
  });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}
