"use server";

import { adminApi, CreateServiceStepFieldRequest, CreateServiceStepRequest, CreateServiceTypeRequest, MediaUploadResponse, ServiceStep, ServiceStepField, ServiceType, ServiceTypeListResponse, ToggleServiceStepRequest, UpdateServiceStepRequest } from "@/services/admin-api";
import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "waggy_access_token";

function getAccessToken() {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  return token;
}

export async function uploadMediaAction(formData: FormData): Promise<MediaUploadResponse> {
  const token = getAccessToken();
  const file = formData.get("file") as File;
  const mediaType = (formData.get("media_type") as string) || "other";

  if (!file) {
    throw new Error("No file provided");
  }

  return await adminApi.uploadMedia(file, mediaType, token);
}

export async function getServiceTypesAction(): Promise<ServiceTypeListResponse> {
  const token = getAccessToken();
  return await adminApi.getServiceTypes(token);
}

export async function getServiceTypeByIdAction(id: number): Promise<ServiceType> {
  const token = getAccessToken();
  return await adminApi.getServiceTypeById(id, token);
}

export async function createServiceTypeAction(data: CreateServiceTypeRequest): Promise<ServiceType> {
  const token = getAccessToken();
  return await adminApi.createServiceType(data, token);
}

export async function updateServiceTypeAction(id: number, data: CreateServiceTypeRequest): Promise<ServiceType> {
  const token = getAccessToken();
  return await adminApi.updateServiceType(id, data, token);
}

export async function deleteServiceTypeAction(id: number): Promise<void> {
  const token = getAccessToken();
  return await adminApi.deleteServiceType(id, token);
}

// Steps Actions

export async function createServiceStepAction(serviceId: number, data: CreateServiceStepRequest): Promise<ServiceStep> {
  const token = getAccessToken();
  return await adminApi.createServiceStep(serviceId, data, token);
}

export async function updateServiceStepAction(serviceId: number, stepId: number, data: UpdateServiceStepRequest): Promise<ServiceStep> {
  const token = getAccessToken();
  return await adminApi.updateServiceStep(serviceId, stepId, data, token);
}

export async function deleteServiceStepAction(serviceId: number, stepId: number): Promise<void> {
  const token = getAccessToken();
  return await adminApi.deleteServiceStep(serviceId, stepId, token);
}

export async function toggleServiceStepAction(serviceId: number, data: ToggleServiceStepRequest): Promise<void> {
  const token = getAccessToken();
  return await adminApi.toggleServiceStep(serviceId, data, token);
}

export async function reorderServiceStepsAction(serviceId: number, orderedStepIds: number[]): Promise<void> {
  const token = getAccessToken();
  return await adminApi.reorderServiceSteps(serviceId, orderedStepIds, token);
}

// Fields Actions

export async function getServiceStepFieldsAction(stepId: number): Promise<ServiceStepField[]> {
  const token = getAccessToken();
  const response = await adminApi.getServiceStepFields(stepId, token);
  return response.items;
}

export async function getServiceStepFieldAction(fieldId: number): Promise<ServiceStepField> {
  const token = getAccessToken();
  return await adminApi.getServiceStepField(fieldId, token);
}

export async function createServiceStepFieldAction(stepId: number, data: CreateServiceStepFieldRequest): Promise<ServiceStepField> {
  const token = getAccessToken();
  return await adminApi.createServiceStepField(stepId, data, token);
}

export async function updateServiceStepFieldAction(stepId: number, fieldId: number, data: CreateServiceStepFieldRequest): Promise<ServiceStepField> {
  const token = getAccessToken();
  return await adminApi.updateServiceStepField(stepId, fieldId, data, token);
}

export async function deleteServiceStepFieldAction(stepId: number, fieldId: number): Promise<void> {
  const token = getAccessToken();
  return await adminApi.deleteServiceStepField(stepId, fieldId, token);
}
