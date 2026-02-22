import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface PhoneRequestPayload {
  phone: string;
}

export interface PhoneRequestResponse {
  message: string;
  phone: string;
  otp_sent: boolean;
  expires_in: number;
}

export interface PhoneVerifyPayload {
  phone: string;
  otp: string;
}

export interface PhoneVerifyResponse {
  message: string;
  // Response structure wasn't strictly defined by user ("doesn't matter"), 
  // but usually returns success status or token if relevant.
  // We'll treat it as a generic success response for now.
  [key: string]: any;
}

export async function requestPhoneOtp(payload: PhoneRequestPayload) {
  return apiFetch<PhoneRequestResponse>(API_ENDPOINTS.profile.phoneRequest, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyPhoneOtp(payload: PhoneVerifyPayload) {
  return apiFetch<PhoneVerifyResponse>(API_ENDPOINTS.profile.phoneVerify, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
