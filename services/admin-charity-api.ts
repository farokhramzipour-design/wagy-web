import { apiFetch } from "@/lib/api-client";
import {
  CharityCaseDetail,
  CharityCaseSummary,
  CharityCaseUpdate,
  CreateCharityCaseRequest,
  CreateCharityCaseUpdate,
  UpdateCharityCaseRequest
} from "@/types/charity";

async function localFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.detail || errorData.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export const adminCharityApi = {
  // Admin Endpoints
  getAdminCases: async (params: {
    status_filter?: string;
    skip?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.status_filter) searchParams.append("status_filter", params.status_filter);
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());

    return localFetch<CharityCaseSummary[]>(`/api/v1/admin/charity/cases?${searchParams.toString()}`);
  },

  // Public/User Endpoints (used for management)
  getCases: async (params: {
    skip?: number;
    limit?: number;
    province_id?: number;
    city_id?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());
    if (params.province_id) searchParams.append("province_id", params.province_id.toString());
    if (params.city_id) searchParams.append("city_id", params.city_id.toString());

    return localFetch<CharityCaseSummary[]>(`/api/v1/charity/cases?${searchParams.toString()}`);
  },

  getMineCases: async (params: {
    skip?: number;
    limit?: number;
    status_filter?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());
    if (params.status_filter) searchParams.append("status_filter", params.status_filter);

    return localFetch<CharityCaseSummary[]>(`/api/v1/charity/cases/mine?${searchParams.toString()}`);
  },

  getCaseById: async (id: number) => {
    return localFetch<CharityCaseDetail>(`/api/v1/charity/cases/${id}`);
  },

  getCaseByIdServer: async (id: number, token: string) => {
    return apiFetch<CharityCaseDetail>(`/api/v1/charity/cases/${id}`, {
      token,
    });
  },

  createCase: async (data: CreateCharityCaseRequest) => {
    return localFetch<void>(`/api/v1/charity/cases`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCase: async (id: number, data: UpdateCharityCaseRequest) => {
    return localFetch<void>(`/api/v1/charity/cases/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  submitCase: async (id: number) => {
    return localFetch<void>(`/api/v1/charity/cases/${id}/submit`, {
      method: "POST",
    });
  },

  closeCase: async (id: number) => {
    return localFetch<void>(`/api/v1/charity/cases/${id}/close`, {
      method: "POST",
    });
  },

  addUpdate: async (id: number, data: CreateCharityCaseUpdate) => {
    return localFetch<void>(`/api/v1/charity/cases/${id}/updates`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getUpdates: async (id: number) => {
    return localFetch<CharityCaseUpdate[]>(`/api/v1/charity/cases/${id}/updates`);
  },

  getUpdatesServer: async (id: number, token: string) => {
    return apiFetch<CharityCaseUpdate[]>(`/api/v1/charity/cases/${id}/updates`, {
      token,
    });
  }
};
