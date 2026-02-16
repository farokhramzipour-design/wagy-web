import { NextResponse } from "next/server";
import { normalizeName, normalizeRole, serializeSession } from "@/lib/session";

const SESSION_COOKIE = "waggy_session";
const ACCESS_COOKIE = "waggy_access_token";
const REFRESH_COOKIE = "waggy_refresh_token";

type SessionPayload = {
  role?: string;
  name?: string;
  access_token?: string;
  refresh_token?: string;
  access_expires_in?: number;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SessionPayload;
  const role = normalizeRole(body.role);
  const name = normalizeName(body.name);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, serializeSession({ role, name }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  if (body.access_token) {
    response.cookies.set(ACCESS_COOKIE, body.access_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: body.access_expires_in ?? 3600
    });
  }

  if (body.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, body.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  }

  return response;
}
