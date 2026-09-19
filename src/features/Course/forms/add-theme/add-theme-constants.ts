import { LuCaptionsOff } from "react-icons/lu";

export const TYPE_SELECT_ORDER = [
  "md",
  "sb",
  "wp",
  "gl",
  "lc",
  "pr",
  "lb",
  "srs",
  "rgz",
  "test",
  "lit",
  "other",
] as const;

export const TYPE_LABELS: Record<string, string> = {
  md: "Модуль дисциплины",
  sb: "Силлабус",
  wp: "Рабочая программа",
  gl: "Глоссарии",
  lc: "Лекционные материалы",
  pr: "Практические материалы",
  lb: "Лабораторные",
  srs: "СРС",
  rgz: "РГЗ/РП",
  test: "Тесты",
  lit: "Литература",
  other: "Другое",
};

export const TYPE_LESS: Record<string, string> = {
  md: "Мд",
  sb: "Сил",
  wp: "РП",
  gl: "Гл",
  lc: "Лк",
  pr: "Пр",
  lb: "Лб",
  srs: "СРС",
  rgz: "РГЗ",
  test: "Тест",
  lit: "Лит",
  other: "Другое",
};

export const GRADED_THEME_TYPES = ["lc", "pr", "lb", "srs", "rgz"] as const;

export const TYPE_LABEL_ORDER = TYPE_SELECT_ORDER.map((key) => TYPE_LABELS[key]);

const TYPE_ALIASES: Record<string, string> = {
  "лекционное занятие": TYPE_LABELS.lc,
  "лекционные материла": TYPE_LABELS.lc,
  "практическое занятие": TYPE_LABELS.pr,
  "лабораторная работа": TYPE_LABELS.lb,
  глоссарий: TYPE_LABELS.gl,
  тест: TYPE_LABELS.test,
  тесты: TYPE_LABELS.test,
  ргз: TYPE_LABELS.rgz,
  ргр: TYPE_LABELS.rgz,
  "ргз/рп": TYPE_LABELS.rgz,
  rgr: TYPE_LABELS.rgz,
};

const normalizeThemeType = (value: string) =>
  value.trim().toLowerCase().replace(/\.+$/, "");

const THEME_TYPE_LOOKUP = (() => {
  const lookup = new Map<string, string>();

  const add = (value: string | undefined, label: string) => {
    if (!value) return;
    lookup.set(normalizeThemeType(value), label);
  };

  for (const key of TYPE_SELECT_ORDER) {
    const label = TYPE_LABELS[key];
    add(key, label);
    add(label, label);
    add(TYPE_LESS[key], label);
  }

  for (const [alias, label] of Object.entries(TYPE_ALIASES)) {
    add(alias, label);
  }

  return lookup;
})();

export const resolveThemeTypeLabel = (type?: string | null): string => {
  if (!type?.trim()) return TYPE_LABELS.other;
  return THEME_TYPE_LOOKUP.get(normalizeThemeType(type)) ?? TYPE_LABELS.other;
};

const GRADED_LABELS = new Set(
  GRADED_THEME_TYPES.map((key) => TYPE_LABELS[key])
);

export const isGradableThemeType = (type?: string | null): boolean => {
  if (!type) return false;
  return GRADED_LABELS.has(resolveThemeTypeLabel(type));
};

export const isTestThemeType = (type?: string | null): boolean => {
  if (!type) return false;
  return resolveThemeTypeLabel(type) === TYPE_LABELS.test;
};

export const themeTypeSortIndex = (label: string) => {
  const canonical = resolveThemeTypeLabel(label);
  const index = TYPE_LABEL_ORDER.indexOf(canonical);
  return index >= 0 ? index : TYPE_LABEL_ORDER.length;
};

export const LOCKED_OPTIONS = [
  {
    label: "Закрытый",
    description: "Эта тема будет закрыта по умолчанию для каждого студента",
    value: "locked",
    icon: LuCaptionsOff,
  },
];
