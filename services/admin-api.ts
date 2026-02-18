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

export interface TransactionUser {
  user_id: number;
  name: string;
  email: string;
  phone_e164: string;
}

export interface PaymentDetails {
  payment_id: number;
  booking_id: number;
  kind: string;
  status: string;
  gateway: string;
  authority: string;
  ref_id: string;
  tracking_code: string;
  payer_user_id: number;
  payee_user_id: number;
  amount_minor: number;
  currency_code: string;
  paid_at: string;
  verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransactionDetails {
  wallet_tx_id: number;
  wallet_id: number;
  wallet_user_id: number;
  reason: string;
  amount_minor: number;
  balance_after_minor: number;
  description: string;
  related_payment_id: number;
  related_booking_id: number;
  created_at: string;
  updated_at: string;
}

export interface WalletChargeDetails {
  charge_id: number;
  wallet_id: number;
  user_id: number;
  amount_minor: number;
  currency_code: string;
  method: string;
  status: string;
  gateway_authority: string;
  gateway_ref_id: string;
  bank_reference: string;
  charge_reference: string;
  wallet_tx_id: number;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalDetails {
  withdrawal_id: number;
  wallet_id: number;
  user_id: number;
  amount_minor: number;
  currency_code: string;
  status: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  reviewed_by_admin_id: number;
  reviewed_at: string;
  admin_note: string;
  bank_transfer_reference: string;
  completed_at: string;
  wallet_tx_id: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  transaction_type: string;
  transaction_id: number;
  amount_minor?: number;
  currency_code?: string;
  status?: string;
  direction: string;
  summary: string;
  created_at: string;
  updated_at?: string;
  primary_user?: TransactionUser;
  counterparty_user?: TransactionUser;
  payment?: PaymentDetails;
  wallet_transaction?: WalletTransactionDetails;
  wallet_charge?: WalletChargeDetails;
  withdrawal?: WithdrawalDetails;
}

export interface TransactionListResponse {
  total: number;
  skip: number;
  limit: number;
  items: TransactionItem[];
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

  getTransactions: async (params: {
    source?: string;
    user_id?: number;
    booking_id?: number;
    from_datetime?: string;
    to_datetime?: string;
    skip?: number;
    limit?: number;
  }, token?: string) => {
    const searchParams = new URLSearchParams();
    if (params.source) searchParams.append("source", params.source);
    if (params.user_id) searchParams.append("user_id", params.user_id.toString());
    if (params.booking_id) searchParams.append("booking_id", params.booking_id.toString());
    if (params.from_datetime) searchParams.append("from_datetime", params.from_datetime);
    if (params.to_datetime) searchParams.append("to_datetime", params.to_datetime);
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());

    return apiFetch<TransactionListResponse>(`/api/v1/admin/finance/transactions?${searchParams.toString()}`, {
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
