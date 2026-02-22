export type SessionRole = "user" | "admin";

export interface SessionData {
  role: SessionRole;
  name: string;
  isAdmin: boolean;
  adminRole: string | null;
  isProvider: boolean;
  phone: string | null;
}

const DEFAULT_NAME = "Guest";

export function normalizeRole(value: unknown): SessionRole {
  return value === "admin" ? "admin" : "user";
}

export function normalizeName(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_NAME;
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_NAME;
  return trimmed.slice(0, 50);
}

export function serializeSession(session: SessionData): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function parseSession(raw: string | undefined): SessionData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<SessionData>;
    return {
      role: normalizeRole(parsed.role),
      name: normalizeName(parsed.name),
      isAdmin: Boolean(parsed.isAdmin),
      adminRole: typeof parsed.adminRole === "string" ? parsed.adminRole : null,
      isProvider: Boolean(parsed.isProvider),
      phone: typeof parsed.phone === "string" ? parsed.phone : null
    };
  } catch {
    return null;
  }
}

