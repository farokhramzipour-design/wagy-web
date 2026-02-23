import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const token = cookies().get("waggy_access_token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  try {
    const data = await apiFetch(`/api/v1/notifications/inbox?${queryString}`, {
      method: "GET",
      token,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
