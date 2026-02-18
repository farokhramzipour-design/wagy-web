"use server";

import { cookies } from "next/headers";
import { adminApi, UserListResponse, UserDetailResponse, UpdateUserStatusResponse } from "@/services/admin-api";

const ACCESS_TOKEN_COOKIE = "waggy_access_token";

function getAccessToken() {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  return token;
}

export async function getUsersAction(params: {
  user_type?: string;
  status_filter?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<UserListResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }
  return await adminApi.getUsers(params, token);
}

export async function getUserDetailAction(userId: number): Promise<UserDetailResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }
  return await adminApi.getUserDetail(userId, 20, token);
}

export async function updateUserStatusAction(
  userId: number, 
  status: string, 
  reason?: string
): Promise<UpdateUserStatusResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }
  return await adminApi.updateUserStatus(userId, status, reason, token);
}
