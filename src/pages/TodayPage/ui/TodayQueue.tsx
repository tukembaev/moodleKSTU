import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "shared/config/i18n/dateLocale";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import {
  formatDayLabel,
  isLateSubmission,
  studentBucket,
  typeLabel,
} from "../model/today";
import {
  ReviewItem,
  StudentBucket,
  TodayCourse,
  TodayTheme,
} from "../model/types";

type TodayQueueProps = {
  role: "student" | "teacher";
  courses: TodayCourse[];
  themes: TodayTheme[];
  reviews: ReviewItem[];
  courseId: string | null;
  onOpenTheme: (theme: TodayTheme) => void;
  onOpenReview: (review: ReviewItem) => void;
};

function courseFilter(courseId: string | null, id: string) {
  return !courseId || courseId === id;
}

function courseOf(courses: TodayCourse[], id: string) {
  return courses.find((course) => course.id === id);
}

export function TodayQueue({
  role,
  courses,
  themes,
  reviews,
  courseId,
  onOpenTheme,
  onOpenReview,
}: TodayQueueProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = getDateLocale(i18n.language);

  const studentSections: { id: StudentBucket; title: string }[] = [
    { id: "overdue", title: t("Просрочено") },
    { id: "open", title: t("Сделать сейчас") },
    { id: "upcoming", title: t("Откроется в ближайшие 7 дней") },
    { id: "waiting", title: t("На проверке") },
  ];

  const studentWhen = (theme: TodayTheme, bucket: StudentBucket) => {
    if (bucket === "upcoming" && theme.opening) {
      return t("откроется {{date}}", { date: formatDayLabel(theme.opening) });
    }
    if (bucket === "waiting" && theme.submittedAt) {
      return t("сдано {{date}}", {
        date: format(theme.submittedAt, "d MMM, HH:mm", { locale: dateLocale }),
      });
    }
    if (bucket === "overdue" && theme.deadline) {
      return t("срок был {{date}}", { date: formatDayLabel(theme.deadline) });
    }
    if (theme.deadline) {
      return t("до {{date}}", { date: formatDayLabel(theme.deadline) });
    }
    return "";
  };

  if (role === "teacher") {
    const rows = reviews
      .filter((review) => courseFilter(courseId, review.courseId))
      .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());

    return (
      <section className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold">{t("На проверку")}</h2>
          <span className="text-xs text-muted-foreground">
            {rows.length === 0
              ? t("пусто")
              : t("{{count}} работ", { count: rows.length })}
          </span>
        </div>
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {t("Непроверенных работ нет")}
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {rows.map((review) => {
              const course = courseOf(courses, review.courseId);
              const late = isLateSubmission(review.submittedAt, review.deadline);
              return (
                <li key={review.id}>
                  <button
                    type="button"
                    onClick={() => onOpenReview(review)}
                    className="flex w-full items-start gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
                  >
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: course?.color }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-medium">
                          {review.studentName}
                        </span>
                        {late && (
                          <Badge variant="destructive" className="font-normal">
                            {t("После срока")}
                          </Badge>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm">
                        <span className="text-muted-foreground">
                          {typeLabel(review.typeLess)} ·{" "}
                        </span>
                        {review.themeTitle}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {review.courseTitle || course?.title} ·{" "}
                        {format(review.submittedAt, "d MMM, HH:mm", {
                          locale: dateLocale,
                        })}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    );
  }

  const grouped = studentSections
    .map((section) => ({
      ...section,
      items: themes
        .filter((theme) => courseFilter(courseId, theme.courseId))
        .filter((theme) => studentBucket(theme) === section.id)
        .sort((a, b) => {
          if (section.id === "upcoming") {
            return (a.opening?.getTime() ?? 0) - (b.opening?.getTime() ?? 0);
          }
          if (section.id === "waiting") {
            return (a.submittedAt?.getTime() ?? 0) - (b.submittedAt?.getTime() ?? 0);
          }
          return (a.deadline?.getTime() ?? 0) - (b.deadline?.getTime() ?? 0);
        }),
    }))
    .filter((section) => section.items.length > 0);

  if (!grouped.length) {
    return (
      <p className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        {courseId
          ? t("По этому курсу сейчас нечего сдавать")
          : t("Сейчас нечего сдавать")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {grouped.map((section) => (
        <section key={section.id} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold">{section.title}</h2>
            <span className="text-xs text-muted-foreground">
              {section.items.length}
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {section.items.map((theme) => {
              const course = courseOf(courses, theme.courseId);
              return (
                <li key={theme.id}>
                  <button
                    type="button"
                    onClick={() => onOpenTheme(theme)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
                    )}
                  >
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: course?.color }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm">
                        <span className="text-muted-foreground">
                          {typeLabel(theme.typeLess)} ·{" "}
                        </span>
                        {theme.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {course?.title} · {studentWhen(theme, section.id)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
