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
}

export interface SearchAddressResult {
  title: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
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

// Mock function for reverse geocoding
export async function getAddressFromCoordinates(lat: number, lng: number): Promise<Partial<CreateAddressDto>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    country_code: "IR",
    province_id: 1,
    city_id: 1,
    postal_code: "1234567890",
    address_line1: `Mock Address at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    address_line2: "Unit 1, No 1",
    label: "",
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
