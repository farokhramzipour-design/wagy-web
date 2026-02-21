export const AUTH_COOKIES = {
  SESSION: "waggy_session",
  ACCESS_TOKEN: "waggy_access_token",
  REFRESH_TOKEN: "waggy_refresh_token",
  NEXT_URL: "waggy_auth_next"
} as const;

export const AUTH_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 60 * 60, // 1 hour
  REFRESH_TOKEN_EXPIRY: 60 * 60 * 24 * 30, // 30 days
  SESSION_EXPIRY: 60 * 60 * 24 * 7 // 7 days
} as const;
