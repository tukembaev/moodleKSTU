import { addDays, endOfDay, isAfter, startOfDay } from "date-fns";
import { TYPE_LESS } from "features/Course/forms/add-theme/add-theme-constants";
import i18n from "shared/config/i18n/i18n";
import {
  ReviewItem,
  StudentBucket,
  StudentState,
  TodayAnnouncement,
  TodayCourse,
  TodayData,
  TodayItemKind,
  TodayRole,
  TodayTheme,
} from "./types";

export const UPCOMING_DAYS = 7;

const COURSE_COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#f43f5e",
  "#14b8a6",
  "#6366f1",
  "#eab308",
];

type RawCourse = { id?: string; title?: string };
type RawItem = {
  id?: string;
  courseId?: string;
  title?: string;
  kind?: string;
  typeLess?: string;
  opening?: string | null;
  deadline?: string | null;
  studentState?: string | null;
  submittedAt?: string | null;
};
type RawReview = {
  id?: string;
  courseId?: string;
  themeId?: string;
  kind?: string;
  typeLess?: string;
  themeTitle?: string;
  courseTitle?: string;
  deadline?: string | null;
  studentName?: string;
  submittedAt?: string | null;
};
type RawAnnouncement = {
  id?: string;
  courseId?: string;
  author?: string;
  text?: string;
  createdAt?: string | null;
  pinned?: boolean;
};
type RawToday = {
  role?: string;
  courses?: RawCourse[];
  items?: RawItem[];
  reviews?: RawReview[];
  announcements?: RawAnnouncement[];
};

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function asKind(kind: string | undefined, typeLess: string | undefined): TodayItemKind {
  if (kind === "test" || typeLess === "test") return "test";
  return "theme";
}

function asStudentState(value: string | null | undefined): StudentState | null {
  if (value === "todo" || value === "waiting") return value;
  return null;
}

export function typeLabel(typeLess: string) {
  return TYPE_LESS[typeLess] ?? TYPE_LESS.other;
}

function intlLocale() {
  const language = i18n.language || "ru";
  if (language.startsWith("en")) return "en-US";
  if (language.startsWith("ky")) return "ky";
  return "ru-RU";
}

export function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat(intlLocale(), {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function isLateSubmission(submittedAt: Date, deadline: Date | null) {
  if (!deadline) return false;
  return isAfter(submittedAt, endOfDay(deadline));
}

export function studentBucket(
  theme: TodayTheme,
  now = new Date()
): StudentBucket | null {
  if (theme.typeLess === "lc") return null;
  if (theme.studentState == null) return null;
  if (theme.studentState === "waiting") return "waiting";

  const current = startOfDay(now);
  const open = theme.opening ? startOfDay(theme.opening) : null;
  const due = theme.deadline ? startOfDay(theme.deadline) : null;

  if (open && open > addDays(current, UPCOMING_DAYS)) return null;
  if (open && open > current) return "upcoming";
  if (due && due < current) return "overdue";
  return "open";
}

export function themeRange(theme: TodayTheme): { from: Date; to: Date } | null {
  const from = theme.opening ? startOfDay(theme.opening) : null;
  const to = theme.deadline ? startOfDay(theme.deadline) : null;
  if (!from && !to) return null;
  if (!from) return { from: to as Date, to: to as Date };
  if (!to) return { from, to: from };
  if (to < from) return { from: to, to: from };
  return { from, to };
}

export function formatThemeSpan(theme: TodayTheme) {
  if (theme.opening && theme.deadline) {
    return `${formatDayLabel(theme.opening)} — ${formatDayLabel(theme.deadline)}`;
  }
  const single = theme.opening ?? theme.deadline;
  return single ? formatDayLabel(single) : "";
}

export function mapTodayResponse(raw: RawToday): TodayData {
  const role: TodayRole = raw.role === "teacher" ? "teacher" : "student";
  const courses: TodayCourse[] = (raw.courses ?? [])
    .filter((course): course is { id: string; title?: string } => Boolean(course.id))
    .map((course, index) => ({
      id: course.id,
      title: course.title?.trim() || i18n.t("Курс"),
      color: COURSE_COLORS[index % COURSE_COLORS.length],
    }));

  const items: TodayTheme[] = (raw.items ?? []).flatMap((item) => {
    if (!item.id || !item.courseId) return [];
    return [
      {
        id: item.id,
        courseId: item.courseId,
        title: item.title?.trim() || i18n.t("Без названия"),
        kind: asKind(item.kind, item.typeLess),
        typeLess: item.typeLess || "other",
        opening: parseDate(item.opening),
        deadline: parseDate(item.deadline),
        studentState: asStudentState(item.studentState),
        submittedAt: parseDate(item.submittedAt),
      },
    ];
  });

  const reviews: ReviewItem[] = (raw.reviews ?? []).flatMap((review) => {
    const submittedAt = parseDate(review.submittedAt);
    if (!review.id || !review.courseId || !review.themeId || !submittedAt) return [];
    return [
      {
        id: review.id,
        courseId: review.courseId,
        themeId: review.themeId,
        kind: asKind(review.kind, review.typeLess),
        typeLess: review.typeLess || "other",
        themeTitle: review.themeTitle?.trim() || i18n.t("Без названия"),
        courseTitle: review.courseTitle?.trim() || i18n.t("Курс"),
        deadline: parseDate(review.deadline),
        studentName: review.studentName?.trim() || i18n.t("Студент"),
        submittedAt,
      },
    ];
  });

  const announcements: TodayAnnouncement[] = (raw.announcements ?? []).flatMap(
    (item) => {
      const createdAt = parseDate(item.createdAt);
      if (!item.id || !item.courseId || !createdAt) return [];
      return [
        {
          id: item.id,
          courseId: item.courseId,
          author: item.author?.trim() || "",
          text: item.text?.trim() || "",
          createdAt,
          pinned: Boolean(item.pinned),
        },
      ];
    }
  );

  return { role, courses, items, reviews, announcements };
}
