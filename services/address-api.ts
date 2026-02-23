import { apiFetch } from "@/lib/api-client";

export interface Address {
  address_id: number;
  user_id: number;
  country_code: string;
  province_id: number;
  city_id: number;
  postal_code: string;
  address_line1: string;
  address_line2: string;
  lat: number;
  lng: number;
  label: string;
  is_default: boolean;
  full_address: string;
}

export interface CreateAddressDto {
  country: string;
  province: string;
  city: string;
  postal_code: string;
  address_line1: string;
  address_line2: string;
  lat: number;
  lng: number;
  label: string;
  is_default: boolean;
}

export interface SearchAddressResult {
  title: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
}

export interface Country {
  country_code: string;
  name: string;
}

export interface Province {
  province_id: number;
  country_code: string;
  name_fa: string;
  name_en: string;
  code: string;
}

export interface City {
  city_id: number;
  province_id: number;
  name_fa: string;
  name_en: string;
}

export async function getCountries() {
  return apiFetch<Country[]>("/api/v1/addresses/countries", {
    method: "GET",
  });
}

export async function getProvinces(countryCode: string) {
  return apiFetch<Province[]>(`/api/v1/addresses/provinces?country_code=${countryCode}`, {
    method: "GET",
  });
}

export async function getCities(provinceId: number) {
  return apiFetch<City[]>(`/api/v1/addresses/cities?province_id=${provinceId}`, {
    method: "GET",
  });
}

export async function getAddresses(token?: string) {
  // Server-side fetch uses direct API call
  return apiFetch<Address[]>("/api/v1/addresses", {
    method: "GET",
    token,
    cache: "no-store",
  });
}

// Used by server components or when token is available
export async function createAddress(data: CreateAddressDto, token?: string) {
  return apiFetch<Address>("/api/v1/addresses", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

// Used by client components, calls local proxy
export async function createAddressClient(data: CreateAddressDto) {
  const response = await fetch("/api/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create address");
  }

  return response.json();
}

export async function updateAddressClient(id: number, data: CreateAddressDto) {
  const response = await fetch(`/api/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update address");
  }

  return response.json();
}

export async function deleteAddressClient(id: number) {
  const response = await fetch(`/api/addresses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete address");
  }

  return response.json();
}

// Mock function for reverse geocoding
export async function getAddressFromCoordinates(lat: number, lng: number): Promise<Partial<CreateAddressDto>> {
  const response = await fetch(`/api/addresses/reverse-geocode?lat=${lat}&lon=${lng}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch address details");
  }

  const data = await response.json();

  return {
    country: data.country || "ایران",
    province: data.province || "تهران",
    city: data.city,
    postal_code: data.postal_code,
    address_line1: data.address,
    address_line2: "",
  };
}

// Mock function for address search
export async function searchAddress(query: string): Promise<SearchAddressResult[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  if (!query || query.length < 2) return [];

  return [
    {
      title: "Milad Tower",
      address: "Tehran, Milad Tower",
      lat: 35.7448,
      lng: 51.3753,
      type: "landmark",
    },
    {
      title: "Azadi Tower",
      address: "Tehran, Azadi Square",
      lat: 35.6997,
      lng: 51.3380,
      type: "landmark",
    },
    {
      title: "Tehran Grand Bazaar",
      address: "Tehran, 15 Khordad St",
      lat: 35.6775,
      lng: 51.4198,
      type: "commercial",
    },
    {
      title: "Tabiat Bridge",
      address: "Tehran, Modarres Hwy",
      lat: 35.7554,
      lng: 51.4230,
      type: "park",
    }
  ].filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.address.toLowerCase().includes(query.toLowerCase())
  );
}
