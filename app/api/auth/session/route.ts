import { NextResponse } from "next/server";
import { normalizeName, normalizeRole, serializeSession } from "../../../../lib/session";

const SESSION_COOKIE = "waggy_session";
const ACCESS_COOKIE = "waggy_access_token";
const REFRESH_COOKIE = "waggy_refresh_token";

type SessionPayload = {
  role?: string;
  name?: string;
  access_token?: string;
  refresh_token?: string;
  access_expires_in?: number;
  isAdmin?: boolean;
  isProvider?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SessionPayload;
  const role = normalizeRole(body.role);
  const name = normalizeName(body.name);
  const isAdmin = Boolean(body.isAdmin);
  const isProvider = Boolean(body.isProvider);
  const accessToken = typeof body.access_token === "string" ? body.access_token : "";
  const refreshToken = typeof body.refresh_token === "string" ? body.refresh_token : "";
  const accessExpiresIn =
    typeof body.access_expires_in === "number" && body.access_expires_in > 0
      ? body.access_expires_in
      : 60 * 60;

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, serializeSession({ role, name, isAdmin, isProvider }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  if (accessToken) {
    response.cookies.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: accessExpiresIn
    });
  }

  if (refreshToken) {
    response.cookies.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  }

  return response;
}
