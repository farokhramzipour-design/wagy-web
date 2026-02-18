import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api-client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("waggy_access_token")?.value;
  const { id } = params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = await apiFetch(`/api/v1/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("waggy_access_token")?.value;
  const { id } = params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await apiFetch(`/api/v1/addresses/${id}`, {
      method: "DELETE",
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
