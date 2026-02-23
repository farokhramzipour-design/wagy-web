import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-client";

const BACKEND_PREFIX = "/api/v1/admin/charity/cases";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const url = searchParams ? `${BACKEND_PREFIX}?${searchParams}` : BACKEND_PREFIX;

    const data = await apiFetch(url, {
      method: "GET",
      token: request.cookies.get("waggy_access_token")?.value,
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error.status || 500;
    const payload = error.payload || { detail: error.message || "Internal Server Error" };
    return NextResponse.json(payload, { status });
  }
}
