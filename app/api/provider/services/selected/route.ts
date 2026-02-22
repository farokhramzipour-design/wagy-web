import { apiFetch, ApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = await apiFetch(API_ENDPOINTS.provider.selectedServices, {
      method: "PUT",
      token: token,
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update selected services proxy error:", error);
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { error: error.message || "Failed to update selected services" },
      { status: status }
    );
  }
}
