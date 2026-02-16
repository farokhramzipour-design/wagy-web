export type AppLanguage = "en" | "fa";
export type AppRole = "guest" | "user" | "admin";
export type SitterStatus = "draft" | "pending_review" | "approved";

export interface AppUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface AuthState {
  user: AppUser | null;
  role: AppRole;
  sitterStatus: SitterStatus;
}

export interface OtpRequestPayload {
  phone: string;
}

export interface OtpVerifyPayload {
  phone: string;
  code: string;
}
