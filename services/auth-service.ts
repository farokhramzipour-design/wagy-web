import type { OtpRequestPayload, OtpVerifyPayload } from "@/types/auth";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function requestOtpStub(payload: OtpRequestPayload) {
  await wait(500);
  return {
    message: `Code sent to ${payload.phone}`,
    expiresIn: 60
  };
}

export async function verifyOtpStub(payload: OtpVerifyPayload) {
  await wait(700);
  if (payload.code.length !== 6) {
    throw new Error("INVALID_OTP");
  }

  const isAdmin = payload.phone.endsWith("99");

  return {
    role: isAdmin ? "admin" : "user",
    name: isAdmin ? "Admin Jane" : "Behnam",
    token: "mock-access-token",
    refreshToken: "mock-refresh-token"
  } as const;
}

export async function googleLoginStub() {
  await wait(500);
  return {
    role: "user",
    name: "Behnam",
    token: "mock-google-access",
    refreshToken: "mock-google-refresh"
  } as const;
}
