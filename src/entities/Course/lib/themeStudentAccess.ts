import { isBefore, isValid, startOfDay } from "date-fns";

type ThemeDateValue = string | number | null | undefined;

export type ThemeAccessSource = {
  locked?: boolean;
  open_date?: ThemeDateValue;
  opening_date?: ThemeDateValue;
} | null | undefined;

export type StudentThemeAccess = {
  /** `open_date` ещё не наступил. Материалы и обсуждение от этого не зависят от `locked`. */
  notYetOpen: boolean;
  /** Можно создать answer и отправить файлы. Это только `locked` с бэка, включая исключение преподавателя. */
  canSubmit: boolean;
};

const parseThemeDate = (value: ThemeDateValue): Date | null => {
  if (value == null || value === "") return null;

  if (typeof value === "number" || /^\d+$/.test(String(value).trim())) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return null;
    const date = new Date(numeric < 1e12 ? numeric * 1000 : numeric);
    return isValid(date) ? date : null;
  }

  const date = new Date(value);
  return isValid(date) ? date : null;
};

/** Календарный день открытия ещё не наступил. В сам день открытия тема уже доступна. */
export const isBeforeThemeOpenDay = (
  value: ThemeDateValue,
  now = new Date()
): boolean => {
  const open = parseThemeDate(value);
  if (!open) return false;
  return isBefore(startOfDay(now), startOfDay(open));
};

/** Срок ещё не открыт или дедлайн уже прошёл: новые answers создавать нельзя. */
export const isThemeSubmissionLockedBySchedule = (
  openDate: ThemeDateValue,
  deadline: ThemeDateValue,
  now = new Date()
): boolean => {
  if (isBeforeThemeOpenDay(openDate, now)) return true;
  const due = parseThemeDate(deadline);
  if (!due) return false;
  return now.getTime() > due.getTime();
};

/**
 * Материалы и обсуждение зависят только от `open_date`.
 * Сдача файлов зависит только от `locked`: бэк уже учитывает срок и исключение преподавателя.
 * `locked === false` разрешает answer даже до `open_date` и после дедлайна.
 */
export const resolveStudentThemeAccess = (
  theme: ThemeAccessSource,
  isStudent: boolean,
  now = new Date()
): StudentThemeAccess => {
  if (!isStudent || !theme) {
    return { notYetOpen: false, canSubmit: true };
  }

  return {
    notYetOpen: isBeforeThemeOpenDay(
      theme.open_date ?? theme.opening_date,
      now
    ),
    canSubmit: theme.locked !== true,
  };
};
