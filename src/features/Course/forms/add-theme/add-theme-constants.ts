import { LuCaptionsOff } from "react-icons/lu";

export const TYPE_LABELS: Record<string, string> = {
  lc: "Лекционное занятие",
  pr: "Практическое занятие",
  lb: "Лабораторная работа",
  srs: "СРС",
  rgz: "РГЗ",
  rgr: "РГР",
  test: "Тест",
  sb: "Силлабус",
  gl: "Глоссарий",
  other: "Другое",
};

export const TYPE_LESS: Record<string, string> = {
  lc: "Лк",
  pr: "Пр",
  lb: "Лб",
  srs: "СРС",
  rgz: "РГЗ",
  rgr: "РГР",
  test: "Тест",
  sb: "Силлабус",
  gl: "Глоссарий",
  other: "Другое",
};

export const GRADED_THEME_TYPES = ["lc", "pr", "lb", "srs", "rgz", "rgr"] as const;

export const TYPE_SELECT_GROUPS: { label: string; keys: readonly string[] }[] = [
  {
    label: "Занятия",
    keys: GRADED_THEME_TYPES,
  },
  {
    label: "Контроль",
    keys: ["test"],
  },
  {
    label: "Материалы",
    keys: ["sb", "gl", "other"],
  },
];

export const TYPE_LABEL_ORDER = TYPE_SELECT_GROUPS.flatMap((group) =>
  group.keys.map((key) => TYPE_LABELS[key])
);

const normalizeThemeType = (value: string) =>
  value.trim().toLowerCase().replace(/\.+$/, "");

export const isGradableThemeType = (type?: string | null): boolean => {
  if (!type) return false;
  const normalized = normalizeThemeType(type);
  return GRADED_THEME_TYPES.some((key) =>
    [key, TYPE_LABELS[key], TYPE_LESS[key]].some(
      (label) => normalizeThemeType(label) === normalized
    )
  );
};

export const themeTypeSortIndex = (label: string) => {
  const normalized = normalizeThemeType(label);
  if (normalized === "тесты") {
    const testIndex = TYPE_LABEL_ORDER.indexOf(TYPE_LABELS.test);
    return testIndex >= 0 ? testIndex : TYPE_LABEL_ORDER.length;
  }
  const index = TYPE_LABEL_ORDER.findIndex(
    (item) => normalizeThemeType(item) === normalized
  );
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
