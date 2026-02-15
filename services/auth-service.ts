import { z } from "zod";
import { mockApi } from "@/services/api-client";

export const phoneSchema = z.object({
  phone: z.string().min(8)
});

export const otpSchema = z.object({
  otp: z.string().min(6).max(6)
});

export const authService = {
  requestOtp: async (phone: string) => mockApi({ ok: true, phone }),
  verifyOtp: async (otp: string) => mockApi({ ok: otp.length === 6 }),
  loginWithGoogle: async () => mockApi({ ok: true })
};
