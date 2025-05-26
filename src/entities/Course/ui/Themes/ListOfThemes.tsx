import {
  CourseThemes,
  CourseThemesTypes,
} from "entities/Course/model/types/course";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

import { TestCard } from "entities/Test";
import { Test } from "entities/Test/model/types/test";
import { userQueries } from "entities/User";
import { useParams, useSearchParams } from "react-router-dom";
import UseTabs from "shared/components/UseTabs";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
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
  const [searchParams] = useSearchParams();
  const theme_id = searchParams.get("themeId");
  const themeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openForm = useForm();

  const { mutate: make_favorite } = userQueries.make_favorite();
  const { mutate: delete_favorite } = userQueries.delete_favorite();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (theme_id && themeRefs.current[theme_id]) {
      const element = themeRefs.current[theme_id];
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      setExpandedId(theme_id);
    }
  }, [theme_id]);

  const renderThemes = (key: keyof CourseThemesTypes) => {
    if (key === "test") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {tests?.map((item) => (
            <TestCard key={item.id} {...item} />
          ))}
        </div>
      );
    }
    const themes = data?.detail[key] || [];
    if (!themes.length && isStudent)
      return (
        <>
          <FadeIn className="flex border rounded-xl py-4 px-5 max-w-1/3 justify-center items-center min-h-48">
            <HoverLift>
              <div className="flex flex-col justify-center items-center">
                <img src={empty} alt="" className="size-22" />
                <p>Преподователь еще не добавил темы</p>
              </div>
            </HoverLift>
          </FadeIn>
        </>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {themes.map((theme) => {
          const isThemeExpanded = expandedId === theme.id;
          return (
            <Card
              key={theme.id}
              id={theme.id}
              ref={(el) => {
                themeRefs.current[theme.id] = el;
              }}
              className={`transition-all duration-300 justify-center ${
                isThemeExpanded ? "col-span-3" : ""
              }`}
            >
              <CardContent className="flex flex-col justify-between">
                <div
                  className={`flex items-center mb-2 ${
                    !isStudent ? "justify-end" : "justify-between"
                  }`}
                >
                  {!isStudent ? null : theme.locked ? (
                    <Badge className="bg-gray-300 text-primary max-h-6">
                      Причина закрытия
                    </Badge>
                  ) : theme.status ? (
                    <Badge className="bg-green-300 text-primary max-h-6">
                      Сдано на {theme.result}
                    </Badge>
                  ) : (
                    <Badge>Не сдано</Badge>
                  )}
                </div>
                <span
                  className={`text-lg font-semibold flex justify-between pb-2 ${
                    theme.locked
                      ? "blur-sm pointer-events-none select-none"
                      : ""
                  }`}
                >
                  {theme.title}
                  <HoverScale>
                    {theme.is_favorite ? (
                      <UseTooltip text="Убрать из избранного">
                        <LuBookmark
                          size={24}
                          className="fill-primary hover:fill-none"
                          onClick={() =>
                            delete_favorite({ id: theme.id, type: "theme" })
                          }
                        />
                      </UseTooltip>
                    ) : (
                      <UseTooltip text="Добавить в избранное">
                        <LuBookmark
                          size={24}
                          className="hover:fill-primary"
                          onClick={() => make_favorite({ theme: theme.id })}
                        />
                      </UseTooltip>
                    )}
                  </HoverScale>
                </span>
                <span
                  className={`text-md text-foreground/80 ${
                    theme.locked
                      ? "blur-sm pointer-events-none select-none"
                      : ""
                  }`}
                >
                  {theme.description}
                </span>
                <div className="flex justify-between items-end">
                  <div className="flex gap-6 text-sm text-foreground/80">
                    <UseTooltip text="Время на выполнение">
                      <div className="flex items-center gap-2">
                        <LuClock className="h-4 w-4" />
                        <span>{theme.count_hours}</span>
                      </div>
                    </UseTooltip>
                    {theme.max_points && (
                      <UseTooltip text="Максимальное количество баллов">
                        <div className="flex items-center gap-2">
                          <LuHandCoins className="h-4 w-4" />
                          <span>{theme.max_points}</span>
                        </div>
                      </UseTooltip>
                    )}
                    {/* {theme.deadline && (
                      <UseTooltip
                        text={`Дедлайн сдачи задания: ${format(
                          theme.deadline,
                          "PPP",
                          { locale: ru }
                        )}`}
                      >
                        <div className="flex items-center gap-2">
                          <LuTarget className="h-4 w-4" />
                          <span>{getFormattedDate(theme.deadline)}</span>
                        </div>
                      </UseTooltip>
                    )} */}
                  </div>
                  {!theme.locked && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setExpandedId(isThemeExpanded ? null : theme.id)
                      }
                    >
                      {isThemeExpanded ? <ChevronDown /> : <ChevronRight />}
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
          <FadeIn className="flex border rounded-xl py-4 px-5 min-w-1/3 justify-center items-center min-h-48">
            <HoverLift>
              <UseTooltip text="Добавить тему">
                <div
                  className="flex flex-col justify-center items-center"
                  onClick={() =>
                    openForm(FormQuery.ADD_THEME, {
                      type: key,
                      id: id_theme || "",
                    })
                  }
                >
                  <LuPlus size={35} className="text-muted-foreground" />
                  <p>Добавьте новую тему</p>
                </div>
              </UseTooltip>
            </HoverLift>
          </FadeIn>
        )}
      </div>
    );
  };

  const tabs = categories.map(({ key, title, icon }) => ({
    name: title,
    value: key,
    icon,
    count: key === "test" ? tests.length : data?.detail[key]?.length || 0,
    content: renderThemes(key),
  }));

  return (
    <div className="flex justify-between">
      <UseTabs tabs={tabs}>
        {/* <Button variant={"outline"}>
          Синхронизировать с Google Календарем
        </Button> */}
      </UseTabs>
    </div>
  );
};

export default ListOfThemes;
