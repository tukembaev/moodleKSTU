import { WeekTheme } from "entities/Course/model/types/course";
import { TestCard } from "entities/Test";
import { Test } from "entities/Test/model/types/test";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Lock,
  Trophy
} from "lucide-react";
import React from "react";
import {
  LuBookOpen,
  LuFlaskConical,
  LuHammer,
  LuHandCoins,
  LuNotebookPen,
  LuPlus,
  LuPuzzle,
  LuShapes,
} from "react-icons/lu";
import { FadeIn, HoverLift, UseTooltip } from "shared/components";
import { FormQuery } from "shared/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { Progress } from "shared/shadcn/ui/progress";
import ThemeFiles from "./ThemeDetail/ThemeFiles";
import empty from "/src/assets/empty.svg";

export const categories: {
  key: string;
  title: string;
  icon: React.ReactNode;
  badgeClass: string;
  iconClass: string;

  borderClass: string;
}[] = [
    {
      key: "lb",
      title: "Лабораторные",
      icon: <LuFlaskConical />,
      badgeClass: "bg-purple-50 text-purple-600/80 border-purple-200/50 dark:bg-purple-950/30 dark:text-purple-400/80 dark:border-purple-800/30",
      iconClass: "text-purple-600 dark:text-purple-400",

      borderClass: "hover:border-purple-300 dark:hover:border-purple-700"
    },
    {
      key: "pr",
      title: "Практика",
      icon: <LuHammer />,
      badgeClass: "bg-blue-50 text-blue-600/80 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400/80 dark:border-blue-800/30",
      iconClass: "text-blue-600 dark:text-blue-400",

      borderClass: "hover:border-blue-300 dark:hover:border-blue-700"
    },
    {
      key: "lc",
      title: "Лекции",
      icon: <LuBookOpen />,
      badgeClass: "bg-emerald-50 text-emerald-600/80 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400/80 dark:border-emerald-800/30",
      iconClass: "text-emerald-600 dark:text-emerald-400",

      borderClass: "hover:border-emerald-300 dark:hover:border-emerald-700"
    },
    {
      key: "srs",
      title: "СРС",
      icon: <LuNotebookPen />,
      badgeClass: "bg-amber-50 text-amber-600/80 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400/80 dark:border-amber-800/30",
      iconClass: "text-amber-600 dark:text-amber-400",

      borderClass: "hover:border-amber-300 dark:hover:border-amber-700"
    },
    {
      key: "test",
      title: "Тесты",
      icon: <LuShapes />,
      badgeClass: "bg-rose-50 text-rose-600/80 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400/80 dark:border-rose-800/30",
      iconClass: "text-rose-600 dark:text-rose-400",

      borderClass: "hover:border-rose-300 dark:hover:border-rose-700"
    },
    {
      key: "other",
      title: "Прочее",
      icon: <LuPuzzle />,
      badgeClass: "bg-slate-50 text-slate-600/80 border-slate-200/50 dark:bg-slate-950/30 dark:text-slate-400/80 dark:border-slate-800/30",
      iconClass: "text-slate-600 dark:text-slate-400",

      borderClass: "hover:border-slate-300 dark:hover:border-slate-700"
    },
  ];

// Map type_less values to category keys
const mapTypeLessToCategory = (type_less: string): string => {
  const mapping: Record<string, string> = {
    "Пр": "pr",
    "Лб": "lb",
    "Лк": "lc",
    "СРС": "srs",
    "Тест": "test",
  };
  return mapping[type_less] || "other";
};

// Компонент статуса темы
const ThemeStatusBadge: React.FC<{
  status: boolean;
  result: string | number;
  locked: boolean;
}> = ({ status, result, locked }) => {
  if (locked) {
    return (
      <Badge className="gap-1.5 bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
        <Lock className="h-3 w-3" />
        Ограничен
      </Badge>
    );
  }

  if (status) {
    return (
      <Badge className="gap-1.5 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800">
        <Trophy className="h-3 w-3" />
        {result} балла
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1.5 text-muted-foreground">
      <AlertCircle className="h-3 w-3" />
      Не сдано
    </Badge>
  );
};

// Компонент пустого состояния
const EmptyState: React.FC<{
  isStudent: boolean;
  isOwner: boolean;
  openForm: any;
  id_week?: string;
  isMobile?: boolean;
}> = ({ isStudent, isOwner, openForm, id_week, isMobile }) => {
  if (isStudent) {
    return (
      <FadeIn className="flex border-2 border-dashed rounded-2xl py-8 sm:py-12 px-4 sm:px-6 w-full justify-center items-center bg-gradient-to-br from-muted/30 to-transparent">
        <HoverLift>
          <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 text-center px-4">
            <div className="relative">
              <img
                src={empty}
                alt=""
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 opacity-80"
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-muted rounded-full">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-medium text-foreground">
                Темы скоро появятся
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Преподаватель еще не добавил материалы для этой недели
              </p>
            </div>
          </div>
        </HoverLift>
      </FadeIn>
    );
  }

  if (isOwner) {
    return (
      <AddThemeCard openForm={openForm} id_week={id_week} isMobile={isMobile} />
    );
  }

  return (
    <div className="py-12 text-center">
      <div className="inline-flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-5 w-5" />
        <span>Нет тем для этой недели</span>
      </div>
    </div>
  );
};

// Компонент добавления темы
const AddThemeCard: React.FC<{
  openForm: any;
  id_week?: string;
  isMobile?: boolean;
}> = ({ openForm, id_week, isMobile }) => (
  <FadeIn className="group flex border-2 border-dashed rounded-2xl py-6 sm:py-8 px-4 sm:px-6 w-full justify-center items-center min-h-40 sm:min-h-52 bg-gradient-to-br from-primary/5 via-transparent to-transparent hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer">
    <HoverLift>
      <UseTooltip text="Добавить новое задание">
        <button
          className="flex flex-col justify-center items-center gap-3 sm:gap-4 touch-manipulation min-h-[44px] w-full"
          onClick={() =>
            openForm(FormQuery.ADD_THEME, {
              id: id_week || "",
            })
          }
        >
          <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
            <LuPlus
              size={isMobile ? 28 : 32}
              className="text-primary"
            />
          </div>
          <div className="text-center">
            <p className="text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              Добавить задание
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Нажмите, чтобы создать новую тему
            </p>
          </div>
        </button>
      </UseTooltip>
    </HoverLift>
  </FadeIn>
);

interface WeekThemeViewProps {
  themes: WeekTheme[];
  tests: Test[];
  isStudent: boolean;
  isOwner: boolean;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  themeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  openForm: any;
  isMobile: boolean | undefined;
  id_week?: string;
  course_name: string;
}

// ============================================
// GRID VIEW COMPONENT
// ============================================
export const GridWeekThemes: React.FC<WeekThemeViewProps> = ({
  themes,
  tests,
  isStudent,
  isOwner,
  expandedId,
  setExpandedId,
  themeRefs,
  openForm,
  isMobile,
  id_week,
}) => {
  if (themes.length === 0 && tests.length === 0) {
    return (
      <div className="pt-4 pb-10">
        <EmptyState
          isStudent={isStudent}
          isOwner={isOwner}
          openForm={openForm}
          id_week={id_week}
          isMobile={isMobile}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-4 pb-10">
      {/* Render all tests first */}
      {tests.map((item) => (
        <TestCard key={item.id} item={item} id_week={id_week || ""} viewMode="grid" />
      ))}

      {/* Render all themes */}
      {themes.map((theme) => {
        const isThemeExpanded = expandedId === theme.id;
        const categoryKey = mapTypeLessToCategory(theme.type_less);
        const category = categories.find((c) => c.key === categoryKey);

        return (
          <Card
            key={theme.id}
            id={theme.id}
            ref={(el) => {
              themeRefs.current[theme.id] = el;
            }}
            className={`
              group relative overflow-hidden transition-all duration-300 
              ${isThemeExpanded ? "col-span-1 sm:col-span-2 lg:col-span-3 shadow-lg" : "hover:shadow-md"}
              ${category?.borderClass || ""}
              ${theme.locked ? "opacity-75" : ""}
            `}
          >
            {/* Gradient accent */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <CardContent className="relative flex flex-col justify-between p-4 sm:p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`gap-1.5 ${category?.badgeClass || ""}`}>
                    <span className={category?.iconClass}>{category?.icon}</span>
                    <span>{category?.title}</span>
                  </Badge>
                </div>
                {isStudent && (
                  <ThemeStatusBadge
                    status={theme.status}
                    result={theme.result}
                    locked={theme.locked}
                  />
                )}
                {!isStudent && theme.locked && (
                  <Badge className="gap-1.5 bg-gray-100 text-gray-600 border-gray-200">
                    <Lock className="h-3 w-3" />
                    Ограничен
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 line-clamp-2 ${theme.locked ? "blur-sm pointer-events-none select-none" : ""
                }`}>
                {theme.title}
              </h3>

              {/* Description */}
              {theme.description && (
                <p className={`text-sm text-muted-foreground mb-4 line-clamp-2 ${theme.locked ? "blur-sm pointer-events-none select-none" : ""
                  }`}>
                  {theme.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-border/50">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {theme.max_points && (
                    <UseTooltip text="Максимальный балл">
                      <div className="flex items-center gap-1.5 font-medium">
                        <div className="p-1 rounded bg-primary/10">
                          <LuHandCoins className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span>{theme.max_points} баллов</span>
                      </div>
                    </UseTooltip>
                  )}
                </div>

                {!theme.locked && (
                  <Button
                    variant={isThemeExpanded ? "default" : "outline"}
                    size="sm"
                    className="gap-1.5 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto touch-manipulation transition-all duration-200"
                    onClick={() => setExpandedId(isThemeExpanded ? null : theme.id)}
                  >
                    {isThemeExpanded ? (
                      <>
                        <span className="hidden sm:inline">Свернуть</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Открыть</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Expanded content */}
              {isThemeExpanded && (
                <div className="mt-4 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                  <ThemeFiles id={theme.id} isOwner={isOwner} />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Add theme button for owner */}
      {isOwner && (
        <AddThemeCard openForm={openForm} id_week={id_week} isMobile={isMobile} />
      )}
    </div>
  );
};

// ============================================
// LIST VIEW COMPONENT
// ============================================
export const ListWeekThemes: React.FC<WeekThemeViewProps> = ({
  themes,
  tests,
  isStudent,
  isOwner,
  expandedId,
  setExpandedId,
  themeRefs,
  openForm,
  isMobile,
  id_week,
}) => {
  if (themes.length === 0 && tests.length === 0) {
    return (
      <div className="pt-4 pb-10">
        <EmptyState
          isStudent={isStudent}
          isOwner={isOwner}
          openForm={openForm}
          id_week={id_week}
          isMobile={isMobile}
        />
      </div>
    );
  }

  return (
    <div className="w-full pt-4 pb-10 space-y-4">
      {/* Render test cards in list view if any */}
      {tests.length > 0 && (
        <div className="space-y-3">
          {tests.map((item) => (
            <TestCard key={item.id} item={item} id_week={id_week || ""} viewMode="list" />
          ))}
        </div>
      )}

      {/* Render all themes in accordion */}
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-3"
        value={expandedId || undefined}
        onValueChange={(value) => {
          if (value) {
            const theme = themes.find((t) => t.id === value);
            if (theme && !theme.locked) {
              setExpandedId(value);
            }
          } else {
            setExpandedId(null);
          }
        }}
      >
        {themes.map((theme) => {
          const categoryKey = mapTypeLessToCategory(theme.type_less);
          const category = categories.find((c) => c.key === categoryKey);
          const isExpanded = expandedId === theme.id;

          return (
            <AccordionItem
              key={theme.id}
              value={theme.id}
              disabled={theme.locked}
              className={`
                group relative overflow-hidden border rounded-xl transition-all duration-300
                ${isExpanded ? "shadow-md border-primary/30" : "hover:shadow-sm"}
                ${category?.borderClass || ""}
                ${theme.locked ? "opacity-75" : ""}
              `}
              ref={(el) => {
                themeRefs.current[theme.id] = el;
              }}
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <AccordionTrigger
                className={`
                  relative px-4 sm:px-5 py-4 hover:no-underline items-center
                  ${theme.locked ? "cursor-not-allowed" : "cursor-pointer"}
                  touch-manipulation
                `}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-4">
                  {/* Left side - Title and badge */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {/* Category icon with background */}
                    <div className={`p-2 rounded-lg ${category?.badgeClass || ""} shrink-0`}>
                      <span className={`text-lg ${category?.iconClass}`}>
                        {category?.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-base sm:text-lg font-semibold ${theme.locked ? "blur-sm pointer-events-none select-none" : ""
                          }`}>
                          {theme.title}
                        </span>
                        <Badge className={`${category?.badgeClass || ""} text-xs`}>
                          {category?.title}
                        </Badge>
                      </div>

                      {!isMobile && theme.description && (
                        <p className={`text-sm text-muted-foreground mt-1 line-clamp-1 ${theme.locked ? "blur-sm pointer-events-none select-none" : ""
                          }`}>
                          {theme.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side - Stats and status */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    {theme.max_points && (
                      <UseTooltip text="Максимальный балл">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <div className="p-1 rounded bg-primary/10">
                            <LuHandCoins className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span>{theme.max_points}</span>
                        </div>
                      </UseTooltip>
                    )}

                    {isStudent && (
                      <ThemeStatusBadge
                        status={theme.status}
                        result={theme.result}
                        locked={theme.locked}
                      />
                    )}

                    {!isStudent && theme.locked && (
                      <Badge className="gap-1.5 bg-gray-100 text-gray-600 border-gray-200">
                        <Lock className="h-3 w-3" />
                        Ограничен
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 sm:px-5 pb-5">
                <div className="flex flex-col gap-4 pt-2">
                  {/* Mobile description */}
                  {isMobile && theme.description && (
                    <p className={`text-sm text-muted-foreground ${theme.locked ? "blur-sm pointer-events-none select-none" : ""
                      }`}>
                      {theme.description}
                    </p>
                  )}

                  {/* Progress indicator for student */}
                  {isStudent && theme.status && theme.max_points && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          Ваш результат
                        </span>
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                          {theme.result} / {theme.max_points}
                        </span>
                      </div>
                      <Progress
                        value={(Number(theme.result) / theme.max_points) * 100}
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Theme files */}
                  <ThemeFiles id={theme.id} isOwner={isOwner} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Add theme button for owner */}
      {isOwner && (
        <AddThemeCard openForm={openForm} id_week={id_week} isMobile={isMobile} />
      )}
    </div>
  );
};
