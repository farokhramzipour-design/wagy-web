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

export interface FieldOption {
  option_id: number;
  field_id: number;
  value: string;
  label_en: string;
  label_fa: string;
  display_order: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFieldOptionRequest {
  value: string;
  label_en: string;
  label_fa: string;
  display_order: number;
  is_default: boolean;
  is_active: boolean;
}

export interface ServiceStepFieldsResponse {
  items: ServiceStepField[];
}

export interface ServiceStepField {
  field_id: number;
  step_id: number;
  field_key: string;
  label_en: string;
  label_fa: string;
  field_type: string;
  is_active: boolean;
  is_required: boolean;
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  placeholder_en?: string;
  placeholder_fa?: string;
  help_text_en?: string;
  help_text_fa?: string;
  display_order: number;
  default_value?: string;
  options?: FieldOption[]; // For select, radio, etc.
  depends_on_field?: string;
  depends_on_value?: string;
  is_filterable?: boolean;
  filter_type?: string;
  is_searchable?: boolean;
  filter_priority?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceStepFieldRequest {
  field_key: string;
  label_en: string;
  label_fa: string;
  field_type: string;
  is_required: boolean;
  min_value?: number | null;
  max_value?: number | null;
  min_length?: number | null;
  max_length?: number | null;
  pattern?: string | null;
  placeholder_en?: string | null;
  placeholder_fa?: string | null;
  help_text_en?: string | null;
  help_text_fa?: string | null;
  display_order: number;
  default_value?: string | null;
  options?: any;
  depends_on_field?: string | null;
  depends_on_value?: string | null;
  is_filterable?: boolean;
  filter_type?: string | null;
  is_searchable?: boolean;
  filter_priority?: number;
  is_active?: boolean;
}

export interface ServiceStep {
  step_id: number;
  service_type_id: number;
  step_number: number;
  title_en: string;
  title_fa: string;
  description: string;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  fields?: ServiceStepField[];
}

export interface CreateServiceStepRequest {
  step_number: number;
  title_en: string;
  title_fa: string;
  description: string;
  is_required: boolean;
}

export interface UpdateServiceStepRequest {
  step_number?: number;
  title_en?: string;
  title_fa?: string;
  description?: string;
  is_required?: boolean;
}

export interface ToggleServiceStepRequest {
  is_active: boolean;
}

export interface ReorderServiceStepsRequest {
  ordered_step_ids: number[];
}

export interface ServiceType {
  service_type_id: number;
  name_en: string;
  name_fa: string;
  description: string;
  icon_media_id: number;
  icon_url: string;
  icon_thumb_url: string;
  display_order: number;
  color: string;
  is_active: boolean;
  total_providers: number;
  steps: ServiceStep[];
  created_at: string;
  updated_at: string;
}

export interface ServiceTypeListResponse {
  items: ServiceType[];
}

export interface CreateServiceTypeRequest {
  name_en: string;
  name_fa: string;
  description: string;
  icon_media_id: number;
  display_order: number;
  color: string;
  is_active: boolean;
}

export interface MediaUploadResponse {
  media_id: number;
  url: string;
  thumb_url: string;
  mime_type: string;
  size_bytes: number;
  width: number;
  height: number;
  created_at: string;
}

export const adminApi = {
  uploadMedia: async (file: File, mediaType: string = "other", token?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("media_type", mediaType);

    // Don't set Content-Type header manually for FormData, let the browser/fetch handle it
    return apiFetch<MediaUploadResponse>("/api/v1/media/upload", {
      method: "POST",
      body: formData,
      token,
    });
  },

  getServiceTypes: async (token?: string) => {
    return apiFetch<ServiceTypeListResponse>("/api/v1/admin/service-types", {
      method: "GET",
      token,
    });
  },

  getServiceTypeById: async (id: number, token?: string) => {
    return apiFetch<ServiceType>(`/api/v1/admin/service-types/${id}`, {
      method: "GET",
      token,
    });
  },

  createServiceType: async (data: CreateServiceTypeRequest, token?: string) => {
    return apiFetch<ServiceType>("/api/v1/admin/service-types", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  updateServiceType: async (id: number, data: CreateServiceTypeRequest, token?: string) => {
    return apiFetch<ServiceType>(`/api/v1/admin/service-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  deleteServiceType: async (id: number, token?: string) => {
    return apiFetch<void>(`/api/v1/admin/service-types/${id}`, {
      method: "DELETE",
      token,
    });
  },

  // Steps API
  createServiceStep: async (serviceId: number, data: CreateServiceStepRequest, token?: string) => {
    return apiFetch<ServiceStep>(`/api/v1/admin/service-types/${serviceId}/steps`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  updateServiceStep: async (serviceId: number, stepId: number, data: UpdateServiceStepRequest, token?: string) => {
    return apiFetch<ServiceStep>(`/api/v1/admin/service-types/steps/${stepId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  deleteServiceStep: async (serviceId: number, stepId: number, token?: string) => {
    return apiFetch<void>(`/api/v1/admin/service-types/steps/${stepId}`, {
      method: "DELETE",
      token,
    });
  },

  toggleServiceStep: async (serviceId: number, data: ToggleServiceStepRequest, token?: string) => {
    // Note: The user provided URL is /api/v1/admin/service-types/{service_id}/toggle
    // which implies it toggles the service or steps feature on the service.
    // If it was for a specific step, it would likely have step_id.
    // Assuming this toggles the service active status or steps active status globally for the service.
    return apiFetch<void>(`/api/v1/admin/service-types/${serviceId}/toggle`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  reorderServiceSteps: async (serviceId: number, orderedStepIds: number[], token?: string) => {
    return apiFetch<void>(`/api/v1/admin/service-types/${serviceId}/steps/reorder`, {
      method: "POST",
      body: JSON.stringify({ ordered_step_ids: orderedStepIds }),
      token,
    });
  },

  // Fields API
  getServiceStepFields: async (stepId: number, token?: string) => {
    return apiFetch<ServiceStepFieldsResponse>(`/api/v1/admin/service-types/steps/${stepId}/fields`, {
      method: "GET",
      token,
    });
  },

  getServiceStepField: async (fieldId: number, token?: string) => {
    return apiFetch<ServiceStepField>(`/api/v1/admin/service-types/fields/${fieldId}`, {
      method: "GET",
      token,
    });
  },

  createServiceStepField: async (stepId: number, data: CreateServiceStepFieldRequest, token?: string) => {
    return apiFetch<ServiceStepField>(`/api/v1/admin/service-types/steps/${stepId}/fields`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  updateServiceStepField: async (stepId: number, fieldId: number, data: CreateServiceStepFieldRequest, token?: string) => {
    return apiFetch<ServiceStepField>(`/api/v1/admin/service-types/steps/${stepId}/fields/${fieldId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  deleteServiceStepField: async (stepId: number, fieldId: number, token?: string) => {
    return apiFetch<void>(`/api/v1/admin/service-types/steps/${stepId}/fields/${fieldId}`, {
      method: "DELETE",
      token,
    });
  },

  reorderServiceStepFields: async (stepId: number, orderedFieldIds: number[], token?: string) => {
    return apiFetch<void>(`/api/v1/admin/service-types/steps/${stepId}/fields/reorder`, {
      method: "POST",
      body: JSON.stringify({ ordered_field_ids: orderedFieldIds }),
      token,
    });
  },

  // Options API
  createFieldOption: async (fieldId: number, data: CreateFieldOptionRequest, token?: string) => {
    return apiFetch<FieldOption>(`/api/v1/admin/service-types/fields/${fieldId}/options`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  updateFieldOption: async (fieldId: number, optionId: number, data: CreateFieldOptionRequest, token?: string) => {
    return apiFetch<FieldOption>(`/api/v1/admin/service-types/fields/${fieldId}/options/${optionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    });
  },

  deleteFieldOption: async (fieldId: number, optionId: number, token?: string) => {
    return apiFetch<void>(`/api/v1/admin/service-types/fields/${fieldId}/options/${optionId}`, {
      method: "DELETE",
      token,
    });
  },

  reorderFieldOptions: async (fieldId: number, orderedOptionIds: number[], token?: string) => {
    return apiFetch<void>(`/api/v1/admin/service-types/fields/${fieldId}/options/reorder`, {
      method: "POST",
      body: JSON.stringify({ ordered_option_ids: orderedOptionIds }),
      token,
    });
  },

  // Options

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
