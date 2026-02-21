
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api-client";

const BACKEND_PREFIX = "/api/v1/admin/blog/categories";

async function proxyRequest(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const pathSegments = params.path || [];
  const fullPath = pathSegments.length > 0 
    ? `${BACKEND_PREFIX}/${pathSegments.join("/")}` 
    : BACKEND_PREFIX;
  
  const searchParams = request.nextUrl.searchParams.toString();
  const url = searchParams ? `${fullPath}?${searchParams}` : fullPath;

  const cookieStore = cookies();
  const token = cookieStore.get("waggy_access_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  try {
    const method = request.method;
    let body = undefined;

    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        body = await request.json();
      } catch (e) {}
    }

    const data = await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      token,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error.status || 500;
    const payload = error.payload || { detail: error.message || "Internal Server Error" };
    return NextResponse.json(payload, { status });
  }
}

export async function GET(req: NextRequest, ctx: any) { return proxyRequest(req, ctx); }
export async function POST(req: NextRequest, ctx: any) { return proxyRequest(req, ctx); }
export async function PUT(req: NextRequest, ctx: any) { return proxyRequest(req, ctx); }
export async function DELETE(req: NextRequest, ctx: any) { return proxyRequest(req, ctx); }
