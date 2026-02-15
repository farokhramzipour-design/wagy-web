"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { DIRECTION_BY_LANGUAGE, DEFAULT_LANGUAGE } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    const activeLanguage = language ?? DEFAULT_LANGUAGE;
    i18n.changeLanguage(activeLanguage);
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = DIRECTION_BY_LANGUAGE[activeLanguage];
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  );
}
