import { ApiError, apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { AUTH_COOKIES } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        // apiFetch automatically handles FormData and sets appropriate headers (or lack thereof for boundary)
        const data = await apiFetch(API_ENDPOINTS.iranianVerification.documentUpload, {
            method: "POST",
            token: token,
            body: formData,
        });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Document upload proxy error:", error);
        const status = error instanceof ApiError ? error.status : 500;
        return NextResponse.json(
            { error: error.message || "Failed to upload document" },
            { status: status }
        );
    }
}
