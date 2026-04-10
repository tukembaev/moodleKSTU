import { useQuery } from "@tanstack/react-query";
import { Grid, List, Sparkles } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import WeekTabs from "./WeekTabs";

interface ModuleThemesListProps {
  course_id: string;
  course_name?: string;
  course_owner?: { user_id: number }[];
}

const ModuleThemesList: React.FC<ModuleThemesListProps> = ({
  course_id,
  course_name,
  course_owner,
}) => {
  const isMobile = useIsMobile();

  const { data: courseModulesData, isLoading, error } = useQuery(
    courseQueries.courseModules(course_id)
  );

  const modules = courseModulesData?.modules;

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("theme_view") as "grid" | "list";
    return saved || "grid";
  });

  useEffect(() => {
    if (modules && modules.length > 0) {
      setActiveModuleId((prev) => prev ?? modules[0].id);
    }
  }, [modules]);

  useEffect(() => {
    if (isMobile !== undefined) {
      if (isMobile) {
        setViewMode("list");
      } else {
        const saved = localStorage.getItem("theme_view") as "grid" | "list";
        if (saved) {
          setViewMode(saved);
        }
      }
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile !== undefined && !isMobile) {
      localStorage.setItem("theme_view", viewMode);
    }
  }, [viewMode, isMobile]);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const activeModule = useMemo(
    () => modules?.find((item) => item.id === activeModuleId) || null,
    [modules, activeModuleId]
  );

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Загрузка модулей...</div>;
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Ошибка при загрузке модулей: {error.message}
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Нет модулей для этого курса
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-full">
      <div className="flex flex-col gap-3">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xl sm:text-2xl font-semibold leading-tight">Навигация по модулям</span>
            </div>
            {/* <h2 className="text-xl sm:text-2xl font-semibold leading-tight">
              {course_name || courseModulesData?.discipline_name || "Модули курса"}
            </h2> */}
            <p className="text-sm text-foreground/70">
              Выберите модуль, чтобы изучить его недели и темы. Для удобства
              переключайтесь между сеткой и списком просмотра.
            </p>
          </div>

          {!isMobile && (
            <div className="flex gap-2 rounded-full px-2 py-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                isAnimated={false}
                onClick={() => handleViewModeChange("grid")}
                className="touch-manipulation"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                isAnimated={false}
                onClick={() => handleViewModeChange("list")}
                className="touch-manipulation"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 pt-1 -mx-1 px-1 snap-x">
          {modules.map((module) => {
            const isActive = module.id === activeModuleId;
            const weeksCount = module.weeks.length;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                className={`snap-start min-w-[240px] rounded-2xl border transition-all duration-200 text-left px-4 py-3 bg-gradient-to-br ${isActive
                  ? "from-primary/10 via-primary/5 to-background border-primary/60 shadow-md shadow-primary/10"
                  : "from-muted/10 via-background to-background border-border/60 hover:border-primary/30 hover:shadow-sm"
                  }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold line-clamp-1">
                    {module.title} модуль
                  </span>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {weeksCount} нед.
                  </Badge>
                </div>
                <p className="text-xs text-foreground/70 line-clamp-2">
                  Нажмите, чтобы открыть недели и темы модуля.
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {activeModule ? (
        <WeekTabs
          module={activeModule}
          course_id={course_id}
          course_name={course_name || courseModulesData?.discipline_name || ""}
          viewMode={viewMode}
          course_owner={course_owner || courseModulesData?.course_owner}
        />
      ) : (
        <div className="py-6 text-center text-muted-foreground">
          Выберите модуль, чтобы увидеть его недели
        </div>
      )}
    </div>
  );
};

export default ModuleThemesList;

