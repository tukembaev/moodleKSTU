import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { ky } from "./locales/ky";
import { isAppLanguage, LANGUAGE_STORAGE_KEY } from "./languages";

const stored =
  typeof localStorage !== "undefined"
    ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
    : null;

const initialLanguage = isAppLanguage(stored) ? stored : "ru";

void i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: {} },
    en: { translation: en },
    ky: { translation: ky },
  },
  lng: initialLanguage,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
  keySeparator: false,
  nsSeparator: false,
  returnNull: false,
  returnEmptyString: false,
  react: { useSuspense: false },
});

function persistLanguage(language: string) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = language === "ky" ? "ky" : language;
  }
}

persistLanguage(i18n.language);
i18n.on("languageChanged", persistLanguage);

export default i18n;
