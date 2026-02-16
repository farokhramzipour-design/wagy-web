import { NextResponse } from "next/server";

const SESSION_COOKIE = "waggy_session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const role = formData.get("role") === "admin" ? "admin" : "user";
  const nextPath = typeof formData.get("next") === "string" ? String(formData.get("next")) : "";
  const safeNext = nextPath.startsWith("/app") ? nextPath : "/app/dashboard";

  const response = NextResponse.redirect(new URL(safeNext, request.url));
  response.cookies.set(SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}

