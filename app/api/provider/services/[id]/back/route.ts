import { apiFetch, ApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const endpoint = API_ENDPOINTS.provider.back.replace(
    "{provider_service_id}",
    params.id
  );

  try {
    const data = await apiFetch(endpoint, {
      method: "POST",
      token: token,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Back step proxy error:", error);
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { error: error.message || "Failed to go to previous step" },
      { status: status }
    );
  }
}
