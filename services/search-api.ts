import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

// Types
export type FilterType = "exact" | "range" | "in_list" | "contains" | "gte" | "lte";
export type SortBy = "distance" | "price" | "rating" | "response_time";
export type FieldType = "select" | "radio" | "checkbox" | "multiselect" | "number" | "currency" | "slider" | "switch" | "text" | "textarea";

export interface SearchDiscoveryServiceType {
  service_type_id: number;
  name_en: string;
  name_fa: string;
  filters: SearchFilterMetadata[];
}

export interface SearchDiscoveryServiceTypesResponse {
  items: SearchDiscoveryServiceType[];
}

export interface SearchFilterOption {
  value: any;
  label_en: string;
  label_fa: string;
}

export interface SearchFilterMetadata {
  field_id: number;
  field_key: string;
  label_en: string;
  label_fa: string;
  filter_type: FilterType;
  field_type: FieldType;
  is_searchable: boolean;
  filter_priority: number;
  options: SearchFilterOption[] | boolean[] | null;
  min: number | null;
  max: number | null;
}

export interface SearchAvailableFiltersResponse {
  service_type_id: number;
  filters: SearchFilterMetadata[];
}

export interface SearchProvidersRequest {
  service_type_id: number;
  latitude?: number;
  longitude?: number;
  radius_km?: number; // default 10
  filters?: Record<string, any>;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  verified_only?: boolean;
  booking_date?: string;
  start_time?: string;
  check_in_date?: string;
  check_out_date?: string;
  number_of_pets?: number; // default 1
  sort_by?: SortBy; // default distance
  skip?: number; // default 0
  limit?: number; // default 20
}

export interface ProviderSearchResult {
  provider_id: number;
  business_name: string;
  provider_service_id: number;
  service_type_id: number;
  service_type: {
    service_type_id: number;
    name_en: string;
    name_fa: string;
    icon_media_id: number;
    icon_url: string;
    icon_thumb_url: string;
  };
  average_rating: number;
  total_reviews: number;
  verified: boolean;
  distance_km: number | null;
  response_time_hours: number | null;
  service_data: Record<string, any>;
  avatar_url: string | null;
  full_name: string;
}

export interface SearchProvidersResponse {
  total: number;
  count: number;
  results: ProviderSearchResult[];
  applied_filters: Record<string, any>;
  available_filters: SearchAvailableFiltersResponse;
  pagination: {
    skip: number;
    limit: number;
  };
}

export interface SearchProviderDetailResponse {
  provider_service_id: number;
  provider: {
    provider_id: number;
    business_name: string;
    verified: boolean;
    average_rating: number;
    total_reviews: number;
    city: string;
    latitude: number;
    longitude: number;
  };
  service_type: {
    service_type_id: number;
    name_en: string;
    name_fa: string;
    icon_media_id: number;
    icon_url: string;
    icon_thumb_url: string;
  };
  service_data: Record<string, any>;
  status: string;
  is_active: boolean;
}

// API Functions
export async function getDiscoveryServiceTypes() {
  return apiFetch<SearchDiscoveryServiceTypesResponse>(API_ENDPOINTS.search.discoveryServiceTypes);
}

export async function getAvailableFilters(serviceTypeId: number) {
  return apiFetch<SearchAvailableFiltersResponse>(API_ENDPOINTS.search.filters.replace("{service_type_id}", serviceTypeId.toString()));
}

export async function searchProviders(data: SearchProvidersRequest) {
  return apiFetch<SearchProvidersResponse>(API_ENDPOINTS.search.providers, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProviderDetail(providerServiceId: number) {
  return apiFetch<SearchProviderDetailResponse>(API_ENDPOINTS.search.providerDetail.replace("{provider_service_id}", providerServiceId.toString()));
}
