import { walletApi } from "@/services/wallet-api";
import { WithdrawRequest } from "@/types/wallet";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("waggy_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as WithdrawRequest;
    const response = await walletApi.withdraw(body, token);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}
