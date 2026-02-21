import {
  ServiceType,
  ServiceTypeCreateRequest,
  ServiceTypeUpdateRequest,
  ToggleStatusRequest,
  ServiceStep,
  ServiceStepCreateRequest,
  ServiceStepUpdateRequest,
  ReorderStepsRequest,
  ServiceStepField,
  ServiceFieldCreateRequest,
  ServiceFieldUpdateRequest,
  ReorderFieldsRequest,
  FieldOption,
  FieldOptionCreateRequest,
  FieldOptionUpdateRequest,
} from "@/types/admin-services";

// Local proxy base URL
const BASE_URL = "/api/admin/services";

// Helper for local API calls
async function localFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
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

  return res.json();
}

export const adminServicesApi = {
  // Service Types
  getAllServiceTypes: async () => {
    const response = await localFetch<any>("/service-types");
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.items)) return response.items;
    if (response && Array.isArray(response.data)) return response.data;
    if (response && Array.isArray(response.results)) return response.results;
    return [];
  },

  getServiceTypeById: async (id: number) => {
    const response = await localFetch<any>(`/service-types/${id}`);
    if (response && response.service_type_id) return response; // Direct object
    if (response && response.data) return response.data;
    if (response && response.result) return response.result;
    return response;
  },

  createServiceType: async (data: ServiceTypeCreateRequest) => {
    return localFetch<ServiceType>("/service-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateServiceType: async (id: number, data: ServiceTypeUpdateRequest) => {
    return localFetch<ServiceType>(`/service-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteServiceType: async (id: number) => {
    return localFetch(`/service-types/${id}`, {
      method: "DELETE",
    });
  },

  toggleServiceType: async (id: number, data: ToggleStatusRequest) => {
    return localFetch(`/service-types/${id}/toggle`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Steps
  createStep: async (serviceTypeId: number, data: ServiceStepCreateRequest) => {
    return localFetch<ServiceStep>(`/service-types/${serviceTypeId}/steps`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStep: async (serviceTypeId: number, stepNumber: number, data: ServiceStepUpdateRequest) => {
    return localFetch<ServiceStep>(`/service-types/${serviceTypeId}/steps/${stepNumber}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteStep: async (serviceTypeId: number, stepNumber: number) => {
    return localFetch(`/service-types/${serviceTypeId}/steps/${stepNumber}`, {
      method: "DELETE",
    });
  },

  reorderSteps: async (serviceTypeId: number, data: ReorderStepsRequest) => {
    return localFetch(`/service-types/${serviceTypeId}/steps/reorder`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Fields
  createField: async (stepId: number, data: ServiceFieldCreateRequest) => {
    return localFetch<ServiceStepField>(`/service-types/steps/${stepId}/fields`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateField: async (stepId: number, fieldId: number, data: ServiceFieldUpdateRequest) => {
    return localFetch<ServiceStepField>(`/service-types/steps/${stepId}/fields/${fieldId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteField: async (stepId: number, fieldId: number) => {
    return localFetch(`/service-types/steps/${stepId}/fields/${fieldId}`, {
      method: "DELETE",
    });
  },

  reorderFields: async (stepId: number, data: ReorderFieldsRequest) => {
    return localFetch(`/service-types/steps/${stepId}/fields/reorder`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Options
  createOption: async (fieldId: number, data: FieldOptionCreateRequest) => {
    return localFetch<FieldOption>(`/service-types/fields/${fieldId}/options`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateOption: async (fieldId: number, optionId: number, data: FieldOptionUpdateRequest) => {
    return localFetch<FieldOption>(`/service-types/fields/${fieldId}/options/${optionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteOption: async (fieldId: number, optionId: number) => {
    return localFetch(`/service-types/fields/${fieldId}/options/${optionId}`, {
      method: "DELETE",
    });
  },
  
  previewServiceType: async (id: number) => {
    return localFetch(`/service-types/${id}/preview`);
  },
};
