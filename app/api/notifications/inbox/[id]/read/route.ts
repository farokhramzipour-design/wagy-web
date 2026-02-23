import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api-client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("waggy_access_token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id;

  try {
    const data = await apiFetch(`/api/v1/notifications/inbox/${id}/read`, {
      method: "POST",
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
