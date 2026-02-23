import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-client";

const BACKEND_PREFIX = "/api/v1/charity/cases";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const url = `${BACKEND_PREFIX}/${id}`;

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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    const url = `${BACKEND_PREFIX}/${id}`;
    
    const data = await apiFetch(url, {
      method: "PATCH",
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
