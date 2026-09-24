export const LANGUAGE_STORAGE_KEY = "unet-lms-lang";

export const SUPPORTED_LANGUAGES = ["ru", "ky", "en"] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_OPTIONS: { code: AppLanguage; short: string; label: string }[] = [
  { code: "ru", short: "РУ", label: "Русский" },
  { code: "ky", short: "КЫ", label: "Кыргызча" },
  { code: "en", short: "EN", label: "English" },
];

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
}
