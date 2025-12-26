import { WeekTheme } from "entities/Course/model/types/course";
import React from "react";
import { useNavigate } from "react-router-dom";
import empty from "/src/assets/empty.svg";
import {
  LuHandCoins,
  LuPlus,
} from "react-icons/lu";
import { FadeIn, HoverLift, UseTooltip } from "shared/components";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { TestCard } from "entities/Test";
import { Test } from "entities/Test/model/types/test";
import { FormQuery } from "shared/config";
import { categories, mapTypeLessToCategory } from "../../model/consts/themeConsts";




interface WeekThemeViewProps {
  themes: WeekTheme[];
  tests: Test[];
  isStudent: boolean;
  isOwner: boolean;
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
  themeRefs,
  openForm,
  isMobile,
  id_week,
  
}) => {
  const navigate = useNavigate();

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

  const handleNavigateToTheme = (themeId: string) => {
    navigate(`/courses/week/${id_week}/theme/${themeId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 pb-10">
      {/* Render all tests first */}
      {tests.map((item) => (
        <TestCard key={item.id} item={item} id_week={id_week || ""} viewMode="grid" />
      ))}
      
      {/* Render all themes */}
      {themes.map((theme) => {
        const categoryKey = mapTypeLessToCategory(theme.type_less);
        const category = categories.find((c) => c.key === categoryKey);
        return (
          <Card
            key={theme.id}
            id={theme.id}
            ref={(el) => {
              themeRefs.current[theme.id] = el;
            }}
            className="transition-all duration-300 flex flex-col"
          >
            <CardContent className="flex flex-col h-full justify-between p-3 sm:p-4">
              <div>
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
                    className={`text-base sm:text-lg font-semibold flex-1 line-clamp-2 ${
                      theme.locked ? "blur-sm pointer-events-none select-none" : ""
                    }`}
                  >
                    {theme.title}
                  </span>
                  {isStudent && (
                    <div className="flex items-center shrink-0">
                      {theme.status ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                          {theme.result} балла
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-muted-foreground"
                        >
                          Не сдано
                        </Badge>
                      )}
                    </div>
                  )}
            
                </div>
                <span
                  className={`text-sm sm:text-base text-foreground/80 mb-2 sm:mb-3 line-clamp-3 ${
                    theme.locked ? "blur-sm pointer-events-none select-none" : ""
                  }`}
                >
                  {theme.description}
                </span>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-0 mt-3">
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
                    variant="default"
                    size="sm"
                    className="min-h-[36px] touch-manipulation"
                    onClick={() => handleNavigateToTheme(theme.id)}
                  >
                    Перейти
                  </Button>
                )}
              </div>
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
  themeRefs,
  openForm,
  isMobile,
  id_week,
  
}) => {
  const navigate = useNavigate();

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

  const handleNavigateToTheme = (themeId: string) => {
    navigate(`/courses/week/${id_week}/theme/${themeId}`);
  };

  return (
    <div className="w-full pt-3 sm:pt-4 py-8 pb-10">
      {/* Render test cards in list view if any */}
      {tests.length > 0 && (
        <div className="w-full mb-4 space-y-3">
          {tests.map((item) => (
            <TestCard key={item.id} item={item} id_week={id_week || ""} viewMode="list" />
          ))}
        </div>
      )}

      {/* Render all themes as cards */}
      <div className="w-full space-y-3 sm:space-y-4">
        {themes.map((theme) => {
          const categoryKey = mapTypeLessToCategory(theme.type_less);
          const category = categories.find((c) => c.key === categoryKey);
          return (
            <Card
              key={theme.id}
              ref={(el) => {
                themeRefs.current[theme.id] = el;
              }}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Left content section */}
                  <div className="flex-1 min-w-0">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={`gap-2 ${category?.badgeClass || ""}`}>
                        <span className={category?.iconClass}>{category?.icon}</span>
                        <span>{category?.title}</span>
                      </Badge>
                      
                      {theme.locked && (
                        <Badge className="bg-gray-300 text-primary text-xs sm:text-sm">
                          Доступ ограничен
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-base sm:text-lg font-semibold mb-2 ${
                        theme.locked ? "blur-sm pointer-events-none select-none" : ""
                      }`}
                    >
                      {theme.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-sm text-muted-foreground mb-3 line-clamp-2 ${
                        theme.locked ? "blur-sm pointer-events-none select-none" : ""
                      }`}
                    >
                      {theme.description}
                    </p>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      {theme.max_points && (
                        <UseTooltip text="Максимальное количество балла">
                          <div className="flex items-center gap-1.5">
                            <LuHandCoins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>{theme.max_points} баллов</span>
                          </div>
                        </UseTooltip>
                      )}
                    </div>
                  </div>

                  {/* Right action section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 shrink-0">
                    {/* Status badge for students */}
                    {isStudent && (
                      <div>
                        {theme.status ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                            {theme.result} балла
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-muted-foreground">
                            Не сдано
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Navigate button */}
                    {!theme.locked && (
                      <Button
                        variant="default"
                        size="sm"
                        className="min-h-[36px] w-full sm:w-auto touch-manipulation"
                        onClick={() => handleNavigateToTheme(theme.id)}
                      >
                        Перейти
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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

