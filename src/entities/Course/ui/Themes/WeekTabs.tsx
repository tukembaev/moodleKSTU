import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { Week } from "entities/Course/model/types/course";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import React, { useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";
import { HoverLift, UseTooltip } from "shared/components";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import { GridWeekThemes, ListWeekThemes } from "./WeekThemeViews";
import empty from "/src/assets/empty.svg";

interface WeekTabsProps {
  module: {
    id: string;
    title: string;
    weeks: Week[];
  };
  course_id: string;
  course_name: string;
  viewMode: "grid" | "list";
  course_owner?: { user_id: number }[];
}

const WeekTabs: React.FC<WeekTabsProps> = ({
  module,

  course_name,
  viewMode,
  course_owner,
}) => {
  const { id, isStudent } = useAuth();
  const [searchParams] = useSearchParams();
  const theme_id = searchParams.get("themeId");
  const themeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openForm = useForm();
  const isMobile = useIsMobile();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeWeekId, setActiveWeekId] = useState<string | null>(
    module.weeks[0]?.id ?? null
  );

  const isOwner = id === course_owner?.[0]?.user_id;

  React.useEffect(() => {
    if (theme_id && themeRefs.current[theme_id]) {
      const element = themeRefs.current[theme_id];
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      setExpandedId(theme_id);
    }
  }, [theme_id]);

  React.useEffect(() => {
    // Обновлять выбранную неделю при смене модуля
    setActiveWeekId(module.weeks[0]?.id ?? null);
  }, [module]);

  const WeekContent = ({ week }: { week: Week }) => {
    const { data: weekThemes, isLoading, error, refetch } = useQuery(
      courseQueries.weekThemes(week.id)
    );

    // Fetch tests for this specific week
    const { data: weekTests } = useQuery(
      testQueries.allTest(`?week=${week.id}`)
    );

    // Loading state with skeleton
    if (isLoading) {
      return (
        <div className="min-h-[200px] space-y-3">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 space-y-3 bg-muted/20 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 flex items-center gap-3 bg-muted/20 animate-pulse"
                >
                  <div className="h-10 w-10 bg-muted rounded-full animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-8 bg-muted rounded animate-pulse flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Error state with retry button
    if (error) {
      return (
        <div className="py-12 min-h-[200px]">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Ошибка загрузки
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Не удалось загрузить темы"}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Попробовать снова
            </button>
          </div>
        </div>
      );
    }

    // Empty state
    if (!weekThemes || weekThemes.length === 0) {
      if (isStudent) {
        return (
          <div className="min-h-[200px] flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
            <HoverLift>
              <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 text-center px-2">
                <img
                  src={empty}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22"
                />
                <p className="text-sm sm:text-base">
                  Преподаватель еще не добавил темы
                </p>
              </div>
            </HoverLift>
          </div>
        );
      }
      return (
        <div className="min-h-[200px] flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
          <HoverLift>
            <UseTooltip text="Добавить задание">
              <button
                className="flex flex-col justify-center items-center gap-2 sm:gap-3 touch-manipulation min-h-[44px] w-full"
                onClick={() =>
                  openForm(FormQuery.ADD_THEME, {

                    id: week.id || "",
                  })
                }
              >
                <LuPlus
                  size={isMobile ? 28 : 35}
                  className="text-muted-foreground"
                />
                <p className="text-sm sm:text-base">Добавьте новое задание</p>
              </button>
            </UseTooltip>
          </HoverLift>
        </div>
      );
    }

    const commonProps = {
      themes: weekThemes,
      tests: weekTests || [],
      isStudent: isStudent,
      isOwner: isOwner,
      expandedId: expandedId,
      setExpandedId: setExpandedId,
      themeRefs: themeRefs,
      openForm: openForm,
      isMobile: isMobile,
      id_week: week.id,
      course_name: course_name,
    };

    return (
      <div className="min-h-[200px]">
        {viewMode === "grid" ? (
          <GridWeekThemes {...commonProps} />
          // <ListWeekThemes {...commonProps} />

        ) : (
          <ListWeekThemes {...commonProps} />
        )}
      </div>
    );
  };

  if (module.weeks.length === 0) {
    return (
      <div className="py-12 min-h-[200px]">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Нет недель
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              В этом модуле пока нет недель
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeWeek = module.weeks.find((w) => w.id === activeWeekId) ?? module.weeks[0];

  return (
    <div className="flex flex-col  w-full">
      {/* Week Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">
              {module.title} модуль
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {/* {module.weeks.length} {module.weeks.length === 1 ? "неделя" : "недель"} */}
              Текущая неделя
            </p>
          </div>
        </div>

        {/* Weeks Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {module.weeks.map((week, index) => {
            const isActive = week.id === activeWeek.id;
            return (
              <button
                key={week.id}
                onClick={() => setActiveWeekId(week.id)}
                className={`
                  flex-shrink-0 px-4 py-2.5 rounded-lg border transition-all duration-200
                  ${isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background hover:bg-muted border-border hover:border-primary/50"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {week.title} неделя
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${isActive
                      ? "bg-primary-foreground/20"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    #{index + 1}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Content */}
      {activeWeek ? <WeekContent week={activeWeek} /> : null}
    </div>
  );
};

export default WeekTabs;

