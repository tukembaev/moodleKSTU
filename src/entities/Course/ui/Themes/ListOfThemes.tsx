import {
  CourseThemes,
  CourseThemesTypes,
} from "entities/Course/model/types/course";
import { ChevronDown, ChevronRight, Grid, List } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import empty from "/src/assets/empty.svg";

import {
  LuBookmark,
  LuBookOpen,
  LuClock,
  LuFlaskConical,
  LuHammer,
  LuHandCoins,
  LuNotebookPen,
  LuPlus,
  LuPuzzle,
  LuShapes,
} from "react-icons/lu";
import { FadeIn, HoverLift, HoverScale, UseTooltip } from "shared/components";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";

import { TestCard } from "entities/Test";
import { Test } from "entities/Test/model/types/test";
import { userQueries } from "entities/User";
import { useParams, useSearchParams } from "react-router-dom";
import UseTabs from "shared/components/UseTabs";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import ThemeFiles from "./ThemeFiles";

const categories: {
  key: keyof CourseThemesTypes;
  title: string;
  icon: React.ReactNode;
}[] = [
  { key: "lb", title: "Лабораторные", icon: <LuFlaskConical /> },
  { key: "pr", title: "Практика", icon: <LuHammer /> },
  { key: "lc", title: "Лекции", icon: <LuBookOpen /> },
  { key: "srs", title: "СРС", icon: <LuNotebookPen /> },
  { key: "test", title: "Тесты", icon: <LuShapes /> },
  { key: "other", title: "Прочее", icon: <LuPuzzle /> },
];

const ListOfThemes = ({
  data,
  tests,
}: {
  data: CourseThemes;
  tests: Test[];
}) => {
  const { id, isStudent } = useAuth();

  const { id: id_theme } = useParams();
  const isOwner = id === data?.course_owner[0]?.user_id;
  console.log(isStudent );
  const [searchParams] = useSearchParams();
  const theme_id = searchParams.get("themeId");
  const themeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openForm = useForm();
  const isMobile = useIsMobile();

  const { mutate: make_favorite } = userQueries.make_favorite();
  const { mutate: delete_favorite } = userQueries.delete_favorite();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    // На десктопе используем сохраненное значение или grid по умолчанию
    const saved = localStorage.getItem("theme_view") as "grid" | "list";
    return saved || "grid";
  });

  useEffect(() => {
    // На мобильных автоматически переключаемся на list view
    if (isMobile !== undefined) {
      if (isMobile) {
        setViewMode("list");
      } else {
        // На десктопе восстанавливаем сохраненное значение
        const saved = localStorage.getItem("theme_view") as "grid" | "list";
        if (saved) {
          setViewMode(saved);
        }
      }
    }
  }, [isMobile]);

  useEffect(() => {
    // Сохраняем только на десктопе и только когда isMobile определен
    if (isMobile !== undefined && !isMobile) {
      localStorage.setItem("theme_view", viewMode);
    }
  }, [viewMode, isMobile]);

  useEffect(() => {
    if (theme_id && themeRefs.current[theme_id]) {
      // Проверяем, не заблокирована ли тема
      const allThemes = Object.values(data?.detail || {}).flat();
      const theme = allThemes.find(t => t.id === theme_id);
      
      if (theme && !theme.locked) {
        const element = themeRefs.current[theme_id];
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        setExpandedId(theme_id);
      }
    }
  }, [theme_id, data]);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const renderGridThemes = (key: keyof CourseThemesTypes) => {
    if (key === "test") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4">
          {tests?.map((item) => (
            <TestCard key={item.id} {...item} />
          ))}
        </div>
      );
    }
    const themes = data?.detail[key] || [];
    if (!themes.length && isStudent)
      return (
        <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
          <HoverLift>
            <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 text-center px-2">
              <img src={empty} alt="" className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22" />
              <p className="text-sm sm:text-base">Преподаватель еще не добавил темы</p>
            </div>
          </HoverLift>
        </FadeIn>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4">
        {themes.map((theme) => {
          console.log(theme)
          const isThemeExpanded = expandedId === theme.id;
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
                    !isStudent ? "justify-end" : "justify-between flex-wrap"
                  }`}
                >
                  {!isStudent ? null : theme.locked ? (
                    <Badge className="bg-gray-300 text-primary text-xs sm:text-sm h-5 sm:h-6">
                      Доступ ограничен
                    </Badge>
                  ) : theme.status ? (
                    <Badge className="bg-green-300 text-primary text-xs sm:text-sm h-5 sm:h-6">
                      Сдано на {theme.result}
                    </Badge>
                  ) : (
                    <Badge className="text-xs sm:text-sm h-5 sm:h-6">Не сдано</Badge>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2 pb-2">
                  <span
                    className={`text-base sm:text-lg font-semibold flex-1 ${
                      theme.locked
                        ? "blur-sm pointer-events-none select-none"
                        : ""
                    }`}
                  >
                    {theme.title}
                  </span>
                  <HoverScale>
                    {theme.is_favorite ? (
                      <UseTooltip text="Убрать из избранного">
                        <button
                          className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center touch-manipulation"
                          onClick={() =>
                            delete_favorite({ id: theme.id, type: "theme" })
                          }
                        >
                          <LuBookmark
                            size={isMobile ? 20 : 24}
                            className="fill-primary hover:fill-none"
                          />
                        </button>
                      </UseTooltip>
                    ) : (
                      <UseTooltip text="Добавить в избранное">
                        <button
                          className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center touch-manipulation"
                          onClick={() => make_favorite({ theme: theme.id })}
                        >
                          <LuBookmark
                            size={isMobile ? 20 : 24}
                            className="hover:fill-primary"
                          />
                        </button>
                      </UseTooltip>
                    )}
                  </HoverScale>
                </div>
                <span
                  className={`text-sm sm:text-base text-foreground/80 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none ${
                    theme.locked
                      ? "blur-sm pointer-events-none select-none"
                      : ""
                  }`}
                >
                  {theme.description}
                </span>
                <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-0">
                  <div className="flex gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-foreground/80">
                    <UseTooltip text="Время на выполнение">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <LuClock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{theme.count_hours}</span>
                      </div>
                    </UseTooltip>
                    {theme.max_points && (
                      <UseTooltip text="Максимальное количество баллов">
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
                {isThemeExpanded && (
                  <ThemeFiles id={theme.id} isOwner={isOwner} />
                )}
              </CardContent>
            </Card>
          );
        })}
        {isOwner && (
          <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
            <HoverLift>
              <UseTooltip text="Добавить тему">
                <button
                  className="flex flex-col justify-center items-center gap-2 sm:gap-3 touch-manipulation min-h-[44px] w-full"
                  onClick={() =>
                    openForm(FormQuery.ADD_THEME, {
                      type: key,
                      id: id_theme || "",
                    })
                  }
                >
                  <LuPlus size={isMobile ? 28 : 35} className="text-muted-foreground" />
                  <p className="text-sm sm:text-base">Добавьте новую тему</p>
                </button>
              </UseTooltip>
            </HoverLift>
          </FadeIn>
        )}
      </div>
    );
  };

  const renderListThemes = (key: keyof CourseThemesTypes) => {
    if (key === "test") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4">
          {tests?.map((item) => (
            <TestCard key={item.id} {...item} />
          ))}
        </div>
      );
    }
    const themes = data?.detail[key] || [];
    if (!themes.length && isStudent)
      return (
        <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
          <HoverLift>
            <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 text-center px-2">
              <img src={empty} alt="" className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22" />
              <p className="text-sm sm:text-base">Преподаватель еще не добавил темы</p>
            </div>
          </HoverLift>
        </FadeIn>
      );

    return (
      <Accordion 
        type="single" 
        collapsible 
        className="w-full pt-3 sm:pt-4 py-8"
        value={expandedId || undefined}
        onValueChange={(value) => {
          // Не позволяем открывать заблокированные темы
          if (value) {
            const theme = themes.find(t => t.id === value);
            if (theme && !theme.locked) {
              setExpandedId(value);
            }
          } else {
            setExpandedId(null);
          }
        }}
      >
        {themes.map((theme) => (
          <AccordionItem
            key={theme.id}
            value={theme.id}
            disabled={theme.locked}
            className="border rounded-sm mb-3 sm:mb-4 last:mb-4"
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
                      theme.locked
                        ? "blur-sm pointer-events-none select-none"
                        : ""
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
                  {isStudent && (
                    <>
                      {theme.locked ? (
                        <Badge className="bg-gray-300 text-primary text-xs sm:text-sm h-5 sm:h-6 shrink-0">
                          Доступ ограничен
                        </Badge>
                      ) : theme.status ? (
                        <Badge className="bg-green-300 text-primary text-xs sm:text-sm h-5 sm:h-6 shrink-0">
                          Сдано на {theme.result}
                        </Badge>
                      ) : (
                        <Badge className="text-xs sm:text-sm h-5 sm:h-6 shrink-0">Не сдано</Badge>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                  <div className="flex gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-foreground/80">
                    <UseTooltip text="Время на выполнение">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <LuClock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="whitespace-nowrap">{theme.count_hours}</span>
                      </div>
                    </UseTooltip>
                    {theme.max_points && (
                      <UseTooltip text="Максимальное количество баллов">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <LuHandCoins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="whitespace-nowrap">{theme.max_points}</span>
                        </div>
                      </UseTooltip>
                    )}
                  </div>
                  <HoverScale>
                    {theme.is_favorite ? (
                      <UseTooltip text="Убрать из избранного">
                        <button
                          className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center touch-manipulation"
                          onClick={(e) => {
                            e.stopPropagation();
                            delete_favorite({ id: theme.id, type: "theme" });
                          }}
                        >
                          <LuBookmark
                            size={isMobile ? 20 : 24}
                            className="fill-primary hover:fill-none"
                          />
                        </button>
                      </UseTooltip>
                    ) : (
                      <UseTooltip text="Добавить в избранное">
                        <button
                          className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center touch-manipulation"
                          onClick={(e) => {
                            e.stopPropagation();
                            make_favorite({ theme: theme.id });
                          }}
                        >
                          <LuBookmark
                            size={isMobile ? 20 : 24}
                            className="hover:fill-primary"
                          />
                        </button>
                      </UseTooltip>
                    )}
                  </HoverScale>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 sm:px-5 py-3 sm:py-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                {isMobile && (
                  <span
                    className={`text-sm text-foreground/80 ${
                      theme.locked
                        ? "blur-sm pointer-events-none select-none"
                        : ""
                    }`}
                  >
                    {theme.description}
                  </span>
                )}
                <ThemeFiles id={theme.id} isOwner={isOwner} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        {isOwner && (
          <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
            <HoverLift>
              <UseTooltip text="Добавить тему">
                <button
                  className="flex flex-col justify-center items-center gap-2 sm:gap-3 touch-manipulation min-h-[44px] w-full"
                  onClick={() =>
                    openForm(FormQuery.ADD_THEME, {
                      type: key,
                      id: id_theme || "",
                    })
                  }
                >
                  <LuPlus size={isMobile ? 28 : 35} className="text-muted-foreground" />
                  <p className="text-sm sm:text-base">Добавьте новую тему</p>
                </button>
              </UseTooltip>
            </HoverLift>
          </FadeIn>
        )}
      </Accordion>
    );
  };

  const tabs = categories.map(({ key, title, icon }) => ({
    name: title,
    value: key,
    icon,
    count: key === "test" ? tests.length : data?.detail[key]?.length || 0,
    content:
      viewMode === "grid" ? renderGridThemes(key) : renderListThemes(key),
  }));

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 relative">
      <UseTabs tabs={tabs} classNames="flex-1 w-full" />
      {!isMobile && (
        <div className="flex gap-2 sm:absolute sm:right-0 sm:top-0">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            isAnimated={false}
            onClick={() => handleViewModeChange("grid")}
            className="touch-manipulation"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
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
  );
};

export default ListOfThemes;
