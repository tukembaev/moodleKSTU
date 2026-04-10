import { CourseThemes, CourseThemesTypes } from "entities/Course/model/types/course";
import { BookDown, ChevronDown, ChevronRight } from "lucide-react";
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import ThemeFiles from "./ThemeFiles";

export const categories: {
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

interface ThemeViewProps {
  categoryKey: keyof CourseThemesTypes;
  data: CourseThemes;
  tests: Test[];
  isStudent: boolean;
  isOwner: boolean;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  themeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  openForm: any;
  isMobile: boolean | undefined;
  id_theme?: string;
}

export const GridThemes: React.FC<ThemeViewProps> = ({
  categoryKey,
  data,
  tests,
  isStudent,
  isOwner,
  expandedId,
  setExpandedId,
  themeRefs,
  openForm,
  isMobile,
  id_theme,
}) => {
  const category = categories.find((c) => c.key === categoryKey);
  
  if (categoryKey === "test") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 w-full">
        {tests.length > 0 ? (
          tests.map((item) => <TestCard key={item.id} {...item} />)
        ) : (
          <Empty className="border border-dashed border-border bg-background rounded-lg w-full">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <BookDown size={24} />
              </EmptyMedia>
              <EmptyTitle>Добавить новый тест</EmptyTitle>
              <EmptyDescription>
                Нажмите кнопку ниже, чтобы добавить новый тест к учебному плану
              </EmptyDescription>

              <button
                onClick={() =>
                  openForm(FormQuery.ADD_QUIZ, {
                    course_id: data.id,
                    course_name: data.discipline_name,
                  })
                }
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Создать тест
              </button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    );
  }

  const themes = data?.detail[categoryKey] || [];
  if (!themes.length && isStudent)
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4">
      {themes.map((theme) => {
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
                  !isStudent ? "justify-between" : "justify-between flex-wrap"
                }`}
              >
                <Badge variant="outline" className="gap-2 text-muted-foreground">
                  {category?.icon}
                  <span>{category?.title}</span>
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
                <div className="flex items-center">
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
            <UseTooltip text="Добавить тему">
              <button
                className="flex flex-col justify-center items-center gap-2 sm:gap-3 touch-manipulation min-h-[44px] w-full"
                onClick={() =>
                  openForm(FormQuery.ADD_THEME, {
                    type: categoryKey,
                    id: id_theme || "",
                  })
                }
              >
                <LuPlus
                  size={isMobile ? 28 : 35}
                  className="text-muted-foreground"
                />
                <p className="text-sm sm:text-base">Добавьте новую тему</p>
              </button>
            </UseTooltip>
          </HoverLift>
        </FadeIn>
      )}
    </div>
  );
};

export const ListThemes: React.FC<ThemeViewProps> = ({
  categoryKey,
  data,
  tests,
  isStudent,
  isOwner,
  expandedId,
  setExpandedId,
  themeRefs,
  openForm,
  isMobile,
  id_theme,
}) => {
  const category = categories.find((c) => c.key === categoryKey);

  if (categoryKey === "test") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4">
        {tests?.map((item) => (
          <TestCard key={item.id} {...item} />
        ))}
      </div>
    );
  }

  const themes = data?.detail[categoryKey] || [];
  if (!themes.length && isStudent)
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

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full pt-3 sm:pt-4 py-8"
      value={expandedId || undefined}
      onValueChange={(value) => {
        // Не позволяем открывать заблокированные темы
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
                {isStudent && (
                  <Badge
                    variant="outline"
                    className="gap-2 text-muted-foreground shrink-0"
                  >
                    {category?.icon}
                    <span>{category?.title}</span>
                  </Badge>
                )}
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
      ))}
      {isOwner && (
        <FadeIn className="flex border rounded-xl py-4 sm:py-6 px-4 sm:px-5 w-full justify-center items-center min-h-32 sm:min-h-48">
          <HoverLift>
            <UseTooltip text="Добавить тему">
              <button
                className="flex flex-col justify-center items-center gap-2 sm:gap-3 touch-manipulation min-h-[44px] w-full"
                onClick={() =>
                  openForm(FormQuery.ADD_THEME, {
                    type: categoryKey,
                    id: id_theme || "",
                  })
                }
              >
                <LuPlus
                  size={isMobile ? 28 : 35}
                  className="text-muted-foreground"
                />
                <p className="text-sm sm:text-base">Добавьте новую тему</p>
              </button>
            </UseTooltip>
          </HoverLift>
        </FadeIn>
      )}
    </Accordion>
  );
};
