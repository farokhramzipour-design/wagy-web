
export interface VerificationStatusResponse {
  national_code: {
    added: boolean;
    value?: string;
  };
  shahkar: {
    verified: boolean;
    verified_at?: string;
  };
  postal_code: {
    added: boolean;
    value?: string;
    address?: string;
  };
  provider_address: {
    submitted: boolean;
    status: "pending" | "approved" | "rejected";
    postal_code?: string;
    full_address?: string;
    reviewed_at?: string;
    rejection_reason?: string;
  };
  documents: {
    national_card_front: {
      status: string | null;
      uploaded_at: string | null;
    };
    national_card_back: {
      status: string | null;
      uploaded_at: string | null;
    };
    birth_certificate: {
      status: string | null;
      uploaded_at: string | null;
    };
  };
}

export interface SubmitAddressPayload {
  postal_code: string;
  country: string;
  address_line1: string;
  address_line2?: string;
  lat: number;
  lng: number;
}

export async function submitProviderAddress(payload: SubmitAddressPayload) {
  const response = await fetch("/api/verification/provider-address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit address");
  }

  return response.json();
}

export async function getVerificationStatus() {
  const response = await fetch("/api/verification/status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load verification status");
  }

  return response.json() as Promise<VerificationStatusResponse>;
}
