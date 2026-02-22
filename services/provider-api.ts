import { StepDetailsResponse, WizardResponse } from "@/components/dashboard/become-sitter/wizard/types";
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

export interface ProviderServiceResponse {
  provider_service_id: number;
  provider_id: number;
  service_type_id: number;
  current_step: number;
  total_steps: number;
  completed_steps: number;
  status: string;
  is_complete: boolean;
  completed_at: string | null;
  is_active: boolean;
  activated_at: string | null;
  last_edited_step: number | null;
  created_at: string;
  updated_at: string;
}

export interface StartServiceWizardPayload {
  service_type_id: number;
}

export async function getAvailableServiceTypes(token?: string) {
  return apiFetch<ServiceTypesResponse>(API_ENDPOINTS.provider.serviceTypes, {
    token,
    cache: "no-store",
  });
}

export async function getSelectedServices() {
  const response = await fetch("/api/provider/services/selected", {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch selected services");
  }

  return response.json() as Promise<SelectedServicesResponse>;
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

  return response.json();
}

export async function startServiceWizard(payload: StartServiceWizardPayload) {
  const response = await fetch("/api/provider/services/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to start service wizard");
  }

  return response.json() as Promise<ProviderServiceResponse>;
}

export async function getWizard(providerServiceId: number) {
  const response = await fetch(`/api/provider/services/${providerServiceId}/wizard`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch wizard");
  }

  return response.json() as Promise<WizardResponse>;
}

export async function getStepDetails(providerServiceId: number, stepId: number) {
  const response = await fetch(`/api/provider/services/${providerServiceId}/step/${stepId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch step details");
  }

  return response.json() as Promise<StepDetailsResponse>;
}

export async function saveStepData(providerServiceId: number, stepId: number, data: any) {
  const response = await fetch(`/api/provider/services/${providerServiceId}/step/${stepId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save step data");
  }

  return response.json();
}

export async function nextStep(providerServiceId: number) {
  const response = await fetch(`/api/provider/services/${providerServiceId}/next`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to go to next step");
  }

  return response.json() as Promise<ProviderServiceResponse>;
}

export async function backStep(providerServiceId: number) {
  const response = await fetch(`/api/provider/services/${providerServiceId}/back`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to go to previous step");
  }

  return response.json() as Promise<ProviderServiceResponse>;
}

export async function completeWizard(providerServiceId: number) {
  const response = await fetch(`/api/provider/services/${providerServiceId}/complete`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to complete wizard");
  }

  return response.json() as Promise<ProviderServiceResponse>;
}

