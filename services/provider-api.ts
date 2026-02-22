import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

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
  steps: any[]; // We don't care about steps for now
  created_at: string;
  updated_at: string;
}

export interface ServiceTypesResponse {
  items: ServiceType[];
}

export interface SelectedServiceItem {
  selected_service_id: number;
  service_type_id: number;
  service_order: number;
  name_en: string;
  name_fa: string;
  has_wizard_started: boolean;
  is_wizard_complete: boolean;
}

export interface SelectedServicesResponse {
  items: SelectedServiceItem[];
  top_service_type_id: number;
}

export interface UpdateSelectedServicesPayload {
  service_type_ids: number[];
}

export async function getAvailableServiceTypes(token?: string) {
  return apiFetch<ServiceTypesResponse>(API_ENDPOINTS.provider.serviceTypes, {
    token,
    cache: "no-store",
  });
}

export async function updateSelectedServices(payload: UpdateSelectedServicesPayload) {
  const response = await fetch("/api/provider/services/selected", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update selected services");
  }

  return response.json() as Promise<SelectedServicesResponse>;
}
