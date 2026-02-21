import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../../../lib/api-endpoints";
import { AUTH_COOKIES } from "../../../../lib/auth-config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.waggy.ir";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const refreshTokenMatch = cookieHeader
    .split(";")
    .map((v) => v.trim())
    .find((entry) => entry.startsWith(`${AUTH_COOKIES.REFRESH_TOKEN}=`));
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
  response.cookies.set(AUTH_COOKIES.SESSION, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(AUTH_COOKIES.REFRESH_TOKEN, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}
