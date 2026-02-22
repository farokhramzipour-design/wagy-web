import { NextResponse } from "next/server";
import { AUTH_CONFIG, AUTH_COOKIES } from "../../../../lib/auth-config";
import { normalizeName, normalizeRole, serializeSession } from "../../../../lib/session";

type SessionPayload = {
  role?: string;
  name?: string;
  access_token?: string;
  refresh_token?: string;
  access_expires_in?: number;
  isAdmin?: boolean;
  adminRole?: string | null;
  isProvider?: boolean;
  phone?: string | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SessionPayload;
  const role = normalizeRole(body.role);
  const name = normalizeName(body.name);
  const isAdmin = Boolean(body.isAdmin);
  const adminRole = typeof body.adminRole === "string" ? body.adminRole : null;
  const isProvider = Boolean(body.isProvider);
  const phone = typeof body.phone === "string" ? body.phone : null;
  const accessToken = typeof body.access_token === "string" ? body.access_token : "";
  const refreshToken = typeof body.refresh_token === "string" ? body.refresh_token : "";
  const accessExpiresIn =
    typeof body.access_expires_in === "number" && body.access_expires_in > 0
      ? body.access_expires_in
      : AUTH_CONFIG.ACCESS_TOKEN_EXPIRY;

  const isProduction = process.env.NODE_ENV === "production";

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIES.SESSION, serializeSession({ role, name, isAdmin, adminRole, isProvider, phone }), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: AUTH_CONFIG.SESSION_EXPIRY
  });

  if (accessToken) {
    response.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: accessExpiresIn
    });
  }

  if (refreshToken) {
    response.cookies.set(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY
    });
  }

  return response;
}
