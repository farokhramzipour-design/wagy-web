import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-client";

const BACKEND_PREFIX = "/api/v1/charity/donate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const data = await apiFetch(BACKEND_PREFIX, {
      method: "POST",
      token: request.cookies.get("waggy_access_token")?.value,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error.status || 500;
    const payload = error.payload || { detail: error.message || "Internal Server Error" };
    return NextResponse.json(payload, { status });
  }
}
