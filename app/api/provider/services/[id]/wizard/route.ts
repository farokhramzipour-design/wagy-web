import { apiFetch, ApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const endpoint = API_ENDPOINTS.provider.wizard.replace(
    "{provider_service_id}",
    params.id
  );

  try {
    const data = await apiFetch(endpoint, {
      method: "GET",
      token: token,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Get wizard proxy error:", error);
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch wizard" },
      { status: status }
    );
  }
}
