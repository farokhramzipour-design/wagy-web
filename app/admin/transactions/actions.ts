"use server";

import { adminApi, TransactionListResponse } from "@/services/admin-api";
import { cookies, headers } from "next/headers";

const ACCESS_TOKEN_COOKIE = "waggy_access_token";

function getAccessToken() {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (token) return token;

  const headersList = headers();
  const authHeader = headersList.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return undefined;
}

export async function getTransactionsAction(params: {
  source?: string;
  user_id?: number;
  booking_id?: number;
  from_datetime?: string;
  to_datetime?: string;
  skip?: number;
  limit?: number;
}): Promise<TransactionListResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }
  return await adminApi.getTransactions(params, token);
}
