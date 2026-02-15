"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { DEFAULT_LANGUAGE } from "@/lib/constants";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      fa: { translation: fa }
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    returnNull: false
  });
}

export default i18n;
