"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getMe } from "../../services/auth-api";

export function TokenLoginBootstrap() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

    const token = searchParams.get("token") || searchParams.get("access_token");
    if (!token) {
      if (pathname === "/google") {
        startedRef.current = true;
        router.replace("/auth?error=google_missing_token");
      }
      return;
    }
    startedRef.current = true;

    const refreshToken = searchParams.get("refresh_token") || undefined;
    const expiresInRaw = Number(searchParams.get("expires_in") || "3600");
    const expiresIn = Number.isFinite(expiresInRaw) && expiresInRaw > 0 ? expiresInRaw : 3600;

    const run = async () => {
      let displayName = "Google User";
      try {
        const me = await getMe(token);
        displayName = me.phone_e164 || me.email || displayName;
      } catch {
        // Keep fallback display name.
      }

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "user",
          name: displayName,
          access_token: token,
          refresh_token: refreshToken,
          access_expires_in: expiresIn
        })
      });

      if (!response.ok) {
        router.replace("/auth?error=token_login_failed");
        return;
      }

      window.location.href = "/";
    };

    void run();
  }, [pathname, router, searchParams]);

  return null;
}
