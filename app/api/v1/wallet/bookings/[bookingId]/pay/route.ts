import { walletApi } from "@/services/wallet-api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { bookingId: string } }
) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("waggy_access_token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const bookingId = parseInt(params.bookingId);
        if (isNaN(bookingId)) {
            return NextResponse.json(
                { message: "Invalid booking ID" },
                { status: 400 }
            );
        }

        const response = await walletApi.payBooking(bookingId, token);

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Booking payment error:", error);
        return NextResponse.json(
            { message: error.message || "Failed to pay booking" },
            { status: error.status || 500 }
        );
    }
}
