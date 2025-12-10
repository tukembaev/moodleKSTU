import { useQuery } from "@tanstack/react-query";
import { Week } from "entities/Course/model/types/course";
import { Test } from "entities/Test/model/types/test";
import React, { useRef, useState } from "react";
import { useAuth, useForm } from "shared/hooks";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { GridWeekThemes, ListWeekThemes } from "./WeekThemeViews";
import { useParams, useSearchParams } from "react-router-dom";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";

interface WeekTabsProps {
  module: {
    id: string;
    title: string;
    weeks: Week[];
  };
  tests: Test[];
  course_id: string;
  course_name: string;
  viewMode: "grid" | "list";
  course_owner?: { user_id: number }[];
}

const WeekTabs: React.FC<WeekTabsProps> = ({
  module,
  tests,
  course_id,
  course_name,
  viewMode,
  course_owner,
}) => {
  const { id, isStudent } = useAuth();
  const { id: id_theme } = useParams();
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
    const { data: weekThemes, isLoading } = useQuery(
      courseQueries.weekThemes(week.id)
    );

    if (isLoading) {
      return <div className="py-8 text-center text-muted-foreground">Загрузка...</div>;
    }

    if (!weekThemes || weekThemes.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          Нет тем для этой недели
        </div>
      );
    }

    const commonProps = {
      themes: weekThemes,
      tests: tests,
      isStudent: isStudent,
      isOwner: isOwner,
      expandedId: expandedId,
      setExpandedId: setExpandedId,
      themeRefs: themeRefs,
      openForm: openForm,
      isMobile: isMobile,
      id_theme: id_theme,
      course_id: course_id,
      course_name: course_name,
    };

    return viewMode === "grid" ? (
      <GridWeekThemes {...commonProps} />
    ) : (
      <ListWeekThemes {...commonProps} />
    );
  };

  if (module.weeks.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Нет недель в этом модуле
      </div>
    );
  }

  const activeWeek = module.weeks.find((w) => w.id === activeWeekId) ?? module.weeks[0];

  return (
    <div className="flex flex-col gap-4 relative w-full max-w-full">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Недели модуля
            </span>
            <h3 className="text-lg sm:text-xl font-semibold leading-tight">
              {module.title}
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm">
            Всего недель: {module.weeks.length}
          </Badge>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 -mx-1 px-1 snap-x">
          {module.weeks.map((week, index) => {
            const isActive = week.id === activeWeek.id;
            return (
              <Button
                key={week.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`snap-start min-w-[140px] justify-between gap-2 rounded-full ${
                  isActive ? "shadow-sm" : "bg-background"
                }`}
                onClick={() => setActiveWeekId(week.id)}
              >
                <span className="truncate">{week.title}</span>
                <span className="text-[11px] text-muted-foreground">#{index + 1}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {activeWeek ? <WeekContent week={activeWeek} /> : null}
    </div>
  );
};

export default WeekTabs;

