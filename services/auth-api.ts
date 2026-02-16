import { apiFetch, API_BASE_URL } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export interface OtpRequestPayload {
  phone: string;
}

export interface OtpRequestResponse {
  message: string;
  expires_in: number;
  otp?: string | null;
}

export interface OtpVerifyPayload {
  phone: string;
  otp: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id?: number | null;
}

export interface RefreshAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MeResponse {
  user_id: number;
  email?: string | null;
  phone_e164: string;
  status: string;
  locale: string;
  timezone: string;
}

export async function requestOtp(payload: OtpRequestPayload) {
  return apiFetch<OtpRequestResponse>(API_ENDPOINTS.auth.otpRequest, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function verifyOtp(payload: OtpVerifyPayload) {
  return apiFetch<TokenResponse>(API_ENDPOINTS.auth.otpVerify, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getMe(accessToken: string) {
  return apiFetch<MeResponse>(API_ENDPOINTS.auth.me, {
    method: "GET",
    token: accessToken
  });
}

export async function refreshAccessToken(refreshToken: string) {
  return apiFetch<RefreshAccessTokenResponse>(API_ENDPOINTS.auth.refresh, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken })
  });
}

export function getGoogleLoginUrl() {
  return `${API_BASE_URL}${API_ENDPOINTS.auth.googleLogin}`;
}
