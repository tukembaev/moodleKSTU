import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { COURSE_FEED_TAB, openCourse, openTestPass } from "shared/lib/navigation/hidden-ids";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { todayQueries } from "../model/todayApi";
import {
  ReviewItem,
  TodayAnnouncement,
  TodayItemKind,
  TodayTheme,
} from "../model/types";
import { TodayCalendar } from "./TodayCalendar";
import { TodayFeed } from "./TodayFeed";
import { TodayQueue } from "./TodayQueue";

const TodayPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useQuery(
    todayQueries.today(auth.isStudent)
  );
  const role = data?.role ?? (auth.isStudent ? "student" : "teacher");
  const courses = data?.courses ?? [];
  const themes = courseId
    ? (data?.items ?? []).filter((theme) => theme.courseId === courseId)
    : (data?.items ?? []);
  const announcements = courseId
    ? (data?.announcements ?? []).filter((item) => item.courseId === courseId)
    : (data?.announcements ?? []);

  const openItem = (item: {
    id: string;
    courseId: string;
    kind: TodayItemKind;
  }) => {
    if (role === "student" && item.kind === "test") {
      openTestPass(navigate, item.id, item.courseId);
      return;
    }
    openCourse(navigate, item.courseId, {
      selectedItem: { kind: item.kind, id: item.id },
    });
  };

  const openTheme = (theme: TodayTheme) => openItem(theme);

  const openReview = (review: ReviewItem) => {
    openCourse(navigate, review.courseId, {
      selectedItem: { kind: review.kind, id: review.themeId },
    });
  };

  const openAnnouncement = (item: TodayAnnouncement) => {
    openCourse(navigate, item.courseId, { tab: COURSE_FEED_TAB });
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Сегодня</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {format(new Date(), "d MMMM, EEEE", { locale: ru })}
          {" · "}
          {role === "teacher"
            ? "Сначала те, кто сдал раньше"
            : "Что сдавать и что скоро откроется"}
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Загрузка…</p>
      ) : isError || !data ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed px-4 py-8">
          <p className="text-sm text-muted-foreground">
            Не удалось загрузить сводку
          </p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Повторить
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <TodayQueue
            role={role}
            courses={courses}
            themes={themes}
            reviews={data.reviews}
            courseId={courseId}
            onOpenTheme={openTheme}
            onOpenReview={openReview}
          />
          <aside className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {courses.map((course) => {
                const selected = courseId === course.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setCourseId((current) =>
                        current === course.id ? null : course.id
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-opacity",
                      courseId && !selected && "opacity-45"
                    )}
                    style={
                      selected
                        ? {
                            borderColor: course.color,
                            backgroundColor: `${course.color}22`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    {course.title}
                  </button>
                );
              })}
            </div>
            <TodayCalendar
              courses={courses}
              themes={themes}
              onOpenTheme={openTheme}
            />
            <TodayFeed
              items={announcements}
              courses={courses}
              onOpen={openAnnouncement}
            />
          </aside>
        </div>
      )}
    </div>
  );
};

export default TodayPage;
