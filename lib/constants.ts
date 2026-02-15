import { Language } from "@/types";

export const DEFAULT_LANGUAGE: Language = "en";

export const DIRECTION_BY_LANGUAGE: Record<Language, "ltr" | "rtl"> = {
  en: "ltr",
  fa: "rtl"
};

export const LANG_STORAGE_KEY = "waggy-language";
