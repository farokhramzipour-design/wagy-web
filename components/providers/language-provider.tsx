"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "fa";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLang = "en"
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    document.cookie = `waggy_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "fa" ? "rtl" : "ltr";
    router.refresh();
  };

  // Sync with effect to ensure document attributes are correct on client-side navigation
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir: lang === "fa" ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
