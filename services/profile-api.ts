import { apiFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface ProfileMeResponse {
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  date_of_birth: string | null;
  bio: string | null;
  avatar_media_id: number | null;
  email: string | null;
  phone_e164: string;
  status: string;
  locale: string;
  timezone: string;
  last_login_at: string;
  email_verified: boolean;
  phone_verified: boolean;
  is_base_verified: boolean;
  is_admin: boolean;
  admin_role: string;
  is_provider: boolean;
  provider_id: number | null;
  provider_status: string | null;
  provider_is_active: boolean | null;
  provider_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

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

export async function getProfile(token?: string) {
  return apiFetch<ProfileMeResponse>(API_ENDPOINTS.profile.me, {
    method: "GET",
    token,
  });
}

export async function requestPhoneOtp(payload: PhoneRequestPayload, token?: string) {
  return apiFetch<PhoneRequestResponse>(API_ENDPOINTS.profile.phoneRequest, {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export async function verifyPhoneOtp(payload: PhoneVerifyPayload, token?: string) {
  return apiFetch<PhoneVerifyResponse>(API_ENDPOINTS.profile.phoneVerify, {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}
