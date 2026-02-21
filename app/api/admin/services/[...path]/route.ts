
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api-client";

// This catch-all route handles all requests to /api/admin/services/...
// It forwards them to the backend API at /api/v1/admin/...
// It ensures the authentication token from the cookie is attached.

const BACKEND_PREFIX = "/api/v1/admin";

async function proxyRequest(request: NextRequest, { params }: { params: { path: string[] } }) {
  const pathSegments = params.path;
  const backendPath = `${BACKEND_PREFIX}/${pathSegments.join("/")}`;
  
  // Get query string from original request
  const searchParams = request.nextUrl.searchParams.toString();
  const fullPath = searchParams ? `${backendPath}?${searchParams}` : backendPath;

  // Get token from cookie
  const cookieStore = cookies();
  const token = cookieStore.get("waggy_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const method = request.method;
    let body = undefined;

    // Only read body for methods that support it
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        body = await request.json();
      } catch (e) {
        // Body might be empty or not JSON, ignore
      }
    }

    const data = await apiFetch(fullPath, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      token,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Proxy error for ${fullPath}:`, error);
    
    // apiFetch throws ApiError which has status and payload
    const status = error.status || 500;
    const payload = error.payload || { detail: error.message || "Internal Server Error" };
    
    return NextResponse.json(payload, { status });
  }
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return proxyRequest(request, context);
}
