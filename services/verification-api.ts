
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
    status: "pending" | "approved" | "rejected" | "expired" | null;
    postal_code?: string;
    full_address?: string;
    reviewed_at?: string;
    rejection_reason?: string;
  };
  documents: {
    national_card_front: {
      status: "pending" | "approved" | "rejected" | "expired" | null;
      uploaded_at: string | null;
      rejection_reason?: string;
    };
    national_card_back: {
      status: "pending" | "approved" | "rejected" | "expired" | null;
      uploaded_at: string | null;
      rejection_reason?: string;
    };
    birth_certificate: {
      status: "pending" | "approved" | "rejected" | "expired" | null;
      uploaded_at: string | null;
      rejection_reason?: string;
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

export interface VerifyNationalCodePayload {
  national_code: string;
}

export interface VerifyNationalCodeResponse {
  verified: boolean;
  national_code: string;
  phone: string;
  message: string;
  verified_at: string;
}

export async function verifyNationalCode(payload: VerifyNationalCodePayload) {
  const response = await fetch("/api/verification/national-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to verify national code");
  }

  return response.json() as Promise<VerifyNationalCodeResponse>;
}
