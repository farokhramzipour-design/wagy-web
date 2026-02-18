import { apiFetch } from "@/lib/api-client";

export interface AdminUser {
  user_id: number;
  name: string;
  email: string;
  phone_e164: string;
  status: "active" | "suspended" | "pending" | string;
  roles: string[];
  is_provider: boolean;
  provider?: {
    provider_id: number;
    status: string;
    is_active: boolean;
    verified: boolean;
  };
  is_admin: boolean;
  admin_role?: string;
  owner_bookings_count: number;
  provider_bookings_count: number;
  last_login_at: string;
  created_at: string;
}

export interface UserListResponse {
  total: number;
  skip: number;
  limit: number;
  users: AdminUser[];
}

export interface UserDetailResponse {
  user: {
    user_id: number;
    name: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    email: string;
    phone_e164: string;
    status: string;
    is_provider: boolean;
    is_admin: boolean;
    admin_role?: string;
    created_at: string;
    updated_at: string;
    last_login_at: string;
  };
  provider_profile?: {
    provider_id: number;
    business_name: string;
    is_verified: boolean;
    rating: number;
    reviews_count: number;
  };
  bookings_as_owner: {
    booking_id: number;
    status: string;
    created_at: string;
  }[];
  bookings_as_provider: {
    booking_id: number;
    status: string;
    created_at: string;
  }[];
  conversations: {
    conversation_id: number;
    updated_at: string;
  }[];
}

export interface UpdateUserStatusResponse {
  status: string;
  reason?: string;
}

export const adminApi = {
  getUsers: async (params: {
    user_type?: string;
    status_filter?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }, token?: string) => {
    const searchParams = new URLSearchParams();
    if (params.user_type) searchParams.append("user_type", params.user_type);
    if (params.status_filter) searchParams.append("status_filter", params.status_filter);
    if (params.search) searchParams.append("search", params.search);
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());

    return apiFetch<UserListResponse>(`/api/v1/admin/users/list?${searchParams.toString()}`, {
      method: "GET",
      token,
    });
  },

  getUserDetail: async (userId: number, limit: number = 20, token?: string) => {
    return apiFetch<UserDetailResponse>(`/api/v1/admin/users/${userId}/detail?limit=${limit}`, {
      method: "GET",
      token,
    });
  },

  updateUserStatus: async (userId: number, status: string, reason?: string, token?: string) => {
    return apiFetch<UpdateUserStatusResponse>(`/api/v1/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
      token,
    });
  },
};
