import {
  CharityCase,
  CharityCaseDetails,
  CharityDonation,
  DonatePayload,
} from "@/types/charity-public";

const BASE_URL = "/api/v1/charity";

async function internalFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const charityPublicApi = {
  getCases: async (): Promise<CharityCase[]> => {
    return internalFetch<CharityCase[]>(`${BASE_URL}/cases`);
  },

  getCaseDetails: async (id: number): Promise<CharityCaseDetails> => {
    return internalFetch<CharityCaseDetails>(`${BASE_URL}/cases/${id}`);
  },

  getCaseDonations: async (id: number): Promise<CharityDonation[]> => {
    return internalFetch<CharityDonation[]>(`${BASE_URL}/cases/${id}/donations`);
  },

  donate: async (payload: DonatePayload): Promise<void> => {
    // This calls the Next.js Proxy Route.
    // The browser automatically attaches the HttpOnly cookies (session/token) to this request.
    // The Proxy Route (app/api/v1/charity/donate/route.ts) then extracts the token
    // and forwards the request to the backend with the Authorization header.
    return internalFetch<void>(`${BASE_URL}/donate`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
