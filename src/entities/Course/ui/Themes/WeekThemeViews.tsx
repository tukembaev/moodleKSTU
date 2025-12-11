import { WeekTheme } from "entities/Course/model/types/course";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
import empty from "/src/assets/empty.svg";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { TestCard } from "entities/Test";
import { Test } from "entities/Test/model/types/test";
import { FormQuery } from "shared/config";
import ThemeFiles from "./ThemeDetail/ThemeFiles";


export const categories: {
  key: string;
  title: string;
  icon: React.ReactNode;
  badgeClass: string;
  iconClass: string;
}[] = [
  { 
    key: "lb", 
    title: "Лабораторные", 
    icon: <LuFlaskConical />,
    badgeClass: "bg-purple-50 text-purple-600/80 border-purple-200/50 dark:bg-purple-950/30 dark:text-purple-400/80 dark:border-purple-800/30",
    iconClass: "text-purple-600 dark:text-purple-400"
  },
  { 
    key: "pr", 
    title: "Практика", 
    icon: <LuHammer />,
    badgeClass: "bg-blue-50 text-blue-600/80 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400/80 dark:border-blue-800/30",
    iconClass: "text-blue-600 dark:text-blue-400"
  },
  { 
    key: "lc", 
    title: "Лекции", 
    icon: <LuBookOpen />,
    badgeClass: "bg-emerald-50 text-emerald-600/80 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400/80 dark:border-emerald-800/30",
    iconClass: "text-emerald-600 dark:text-emerald-400"
  },
  { 
    key: "srs", 
    title: "СРС", 
    icon: <LuNotebookPen />,
    badgeClass: "bg-amber-50 text-amber-600/80 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400/80 dark:border-amber-800/30",
    iconClass: "text-amber-600 dark:text-amber-400"
  },
  { 
    key: "test", 
    title: "Тесты", 
    icon: <LuShapes />,
    badgeClass: "bg-rose-50 text-rose-600/80 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400/80 dark:border-rose-800/30",
    iconClass: "text-rose-600 dark:text-rose-400"
  },
  { 
    key: "other", 
    title: "Прочее", 
    icon: <LuPuzzle />,
    badgeClass: "bg-slate-50 text-slate-600/80 border-slate-200/50 dark:bg-slate-950/30 dark:text-slate-400/80 dark:border-slate-800/30",
    iconClass: "text-slate-600 dark:text-slate-400"
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
    if (isStudent) {
      return (
        <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
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
        </FadeIn>
      );
    }
    return (
      <div className="py-8 text-center text-muted-foreground">
        Нет тем для этой недели
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 pb-10">
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
            className={`transition-all duration-300 justify-center py-2 ${
              isThemeExpanded ? "col-span-1 sm:col-span-2 lg:col-span-3" : ""
            }`}
          >
            <CardContent className="flex flex-col justify-between p-3 sm:p-4">
              <div
                className={`flex items-center mb-2 gap-2 ${
                  !isStudent ? "justify-between" : "justify-between flex-wrap"
                }`}
              >
                
                <Badge className={`gap-2 ${category?.badgeClass || ""}`}>
                  <span className={category?.iconClass}>{category?.icon}</span>
                  <span>{category?.title} </span>
                </Badge>
                {theme.locked && (
                  <Badge className="bg-gray-300 text-primary text-xs sm:text-sm h-5 sm:h-6">
                    Доступ ограничен
                  </Badge>
                )}
              </div>
              <div className="flex items-start justify-between gap-2 pb-2">
                <span
                  className={`text-base sm:text-lg font-semibold flex-1 ${
                    theme.locked ? "blur-sm pointer-events-none select-none" : ""
                  }`}
                >
                  {theme.title}
                </span>
                {isStudent && (
                  <div className="flex items-center">
                    {theme.status ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shrink-0">
                        {theme.result} балла
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-muted-foreground shrink-0"
                      >
                        Не сдано
                      </Badge>
                    )}
                  </div>
                )}
          
              </div>
              <span
                className={`text-sm sm:text-base text-foreground/80 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none ${
                  theme.locked ? "blur-sm pointer-events-none select-none" : ""
                }`}
              >
                {theme.description}
              </span>
              <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-0">
                <div className="flex gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-foreground/80">
                  {theme.max_points && (
                    <UseTooltip text="Максимальное количество балла">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <LuHandCoins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{theme.max_points}</span>
                      </div>
                    </UseTooltip>
                  )}
                </div>
                {!theme.locked && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] touch-manipulation"
                    onClick={() =>
                      setExpandedId(isThemeExpanded ? null : theme.id)
                    }
                  >
                    {isThemeExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              {isThemeExpanded && <ThemeFiles id={theme.id} isOwner={isOwner} />}
            </CardContent>
          </Card>
        );
      })}
      
      {isOwner && (
        <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
          <HoverLift>
            <UseTooltip text="Добавить задание">
              <button
                className="flex flex-col justify-center items-center gap-2 sm:gap-3 touch-manipulation min-h-[44px] w-full"
                onClick={() =>
                  openForm(FormQuery.ADD_THEME, {
                   
                    id: id_week || "",
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
        </FadeIn>
      )}
    </div>
  );
};

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
    if (isStudent) {
      return (
        <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
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
        </FadeIn>
      );
    }
    return (
      <div className="py-8 text-center text-muted-foreground">
        Нет тем для этой недели
      </div>
    );
  }

  return (
    <div className="w-full pt-3 sm:pt-4 py-8 pb-10">
      {/* Render test cards in list view if any */}
      {tests.length > 0 && (
        <div className="w-full mb-4">
          {tests.map((item) => (
            <TestCard key={item.id} item={item} id_week={id_week || ""} viewMode="list" />
          ))}
        </div>
      )}

      {/* Render all themes in accordion */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
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
          return (
            <AccordionItem
              key={theme.id}
              value={theme.id}
              disabled={theme.locked}
              className="border border-b last:border-b mb-3 sm:mb-4 rounded-lg"
              ref={(el) => {
                themeRefs.current[theme.id] = el;
              }}
            >
              <AccordionTrigger
                className={`px-3 sm:px-5 py-3 sm:py-4 hover:no-underline items-center touch-manipulation ${
                  theme.locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                    <span
                      className={`text-base sm:text-lg font-semibold ${
                        theme.locked ? "blur-sm pointer-events-none select-none" : ""
                      }`}
                    >
                      {theme.title}
                    </span>
                    {!isMobile && (
                      <span
                        className={`text-xs text-foreground/80 hidden md:inline ${
                          theme.locked
                            ? "blur-sm pointer-events-none select-none"
                            : ""
                        }`}
                      >
                        {theme.description}
                      </span>
                    )}
                    <Badge
                      className={`gap-2 shrink-0 ${category?.badgeClass || ""}`}
                    >
                      <span className={category?.iconClass}>{category?.icon}</span>
                      <span>{category?.title}</span>
                    </Badge>
                  </div>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                  <div className="flex gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-foreground/80">
                    {theme.max_points && (
                      <UseTooltip text="Максимальное количество балла">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <LuHandCoins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="whitespace-nowrap">
                            {theme.max_points}
                          </span>
                        </div>
                      </UseTooltip>
                    )}
                  </div>
                  {isStudent && (
                    <div className="flex items-center">
                      {theme.locked ? (
                        <Badge className="bg-gray-300 text-primary text-xs sm:text-sm h-5 sm:h-6 shrink-0">
                          Доступ ограничен
                        </Badge>
                      ) : theme.status ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shrink-0">
                          {theme.result} балла
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-muted-foreground shrink-0"
                        >
                          Не сдано
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 sm:px-5 py-3 sm:py-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                {isMobile && (
                  <span
                    className={`text-sm text-foreground/80 ${
                      theme.locked ? "blur-sm pointer-events-none select-none" : ""
                    }`}
                  >
                    {theme.description}
                  </span>
                )}
                <ThemeFiles id={theme.id} isOwner={isOwner} />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
        })}
      </Accordion>

      {isOwner && (
        <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48 mt-4">
          <HoverLift>
            <UseTooltip text="Добавить задание">
              <button
                className="flex flex-col justify-center items-center gap-2 sm:gap-3 touch-manipulation min-h-[44px] w-full"
                onClick={() =>
                  openForm(FormQuery.ADD_THEME, {
                   
                    id: id_week || "",
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
        </FadeIn>
      )}
    </div>
  );
};

