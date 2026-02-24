import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-client";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const BACKEND_URL = `/api/v1/charity/cases/${id}/donations`;
  
  try {
    const data = await apiFetch(BACKEND_URL, {
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
