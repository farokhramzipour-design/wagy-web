import { NextResponse } from "next/server";
import { normalizeName, normalizeRole, serializeSession, SessionRole } from "../../../../lib/session";

const SESSION_COOKIE = "waggy_session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const rawRole = formData.get("role");
  const role: SessionRole = rawRole === "admin" ? "admin" : "user";
  const name = normalizeName(formData.get("name"));
  const nextPath = typeof formData.get("next") === "string" ? String(formData.get("next")) : "";
  const safeNext = nextPath.startsWith("/app") ? nextPath : "/app/dashboard";

  const response = NextResponse.redirect(new URL(safeNext, request.url));
  response.cookies.set(SESSION_COOKIE, serializeSession({ 
    role, 
    name, 
    isAdmin: role === "admin", 
    adminRole: role === "admin" ? "super_admin" : null, 
    isProvider: false 
  }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
