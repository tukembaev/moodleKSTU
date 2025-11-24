import { CourseCardSkeleton, CourseDetail } from "entities/Course";

import { userQueries } from "entities/User";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { LuBookmark, LuClock, LuHandCoins, LuTarget } from "react-icons/lu";
import {
  FadeInList,
  HoverScale,
  SpringPopupList,
  UseTooltip,
} from "shared/components";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import ThemeFiles from "../Themes/ThemeFiles";

const FavoriteThemes = ({
  data,
  isLoading,
}: {
  data: CourseDetail[];
  isLoading: boolean;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { mutate: delete_favorite } = userQueries.delete_favorite();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {isLoading ? (
        <SpringPopupList>
          {Array.from({ length: 5 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </SpringPopupList>
      ) : (
        <FadeInList>
          {data
            ?.filter((theme) => expandedId === null || expandedId === theme.id)
            .map((theme) => {
              const isExpanded = expandedId === theme.id;
              return (
                <Card
                  key={theme.id}
                  className={`transition-all duration-300 ${
                    isExpanded ? "col-span-3" : ""
                  }`}
                >
                  <CardContent className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={"secondary"}>Методы оптимизации</Badge>
                      <HoverScale>
                        <UseTooltip text="Убрать из избранного">
                          <LuBookmark
                            size={24}
                            className="fill-primary hover:fill-none"
                            onClick={() =>
                              delete_favorite({
                                id: theme.id,
                                type: "theme",
                              })
                            }
                          />
                        </UseTooltip>
                      </HoverScale>
                    </div>

                    <span
                      className={`text-lg font-semibold flex gap-2 items-center ${
                        theme.locked
                          ? "blur-sm pointer-events-none select-none"
                          : ""
                      }`}
                    >
                      {theme.title}
                      <Badge className={"bg-green-300 text-black"}>Сдано</Badge>
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

                    <div className="flex justify-between text-sm text-foreground/80 pt-6">
                      <div className="flex gap-4">
                        
                        {theme.max_points && (
                          <UseTooltip text="Максимальное количество баллов">
                            <div className="flex items-center gap-2 cursor-pointer">
                              <LuHandCoins className="h-4 w-4" />
                              <span
                                className={
                                  theme.locked ? "blur-sm select-none" : ""
                                }
                              >
                                {theme.max_points}
                              </span>
                            </div>
                          </UseTooltip>
                        )}
                        <UseTooltip text="Дата сдачи темы">
                          <div className="flex items-center gap-2 cursor-pointer">
                            <LuTarget className="h-4 w-4" />
                            <span
                              className={
                                theme.locked
                                  ? "blur-sm pointer-events-none select-none"
                                  : ""
                              }
                            >
                              {theme?.deadline &&
                                new Date(theme.deadline).toLocaleDateString(
                                  "ru-RU",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                            </span>
                          </div>
                        </UseTooltip>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (isExpanded) {
                            setExpandedId(null);
                          } else {
                            setExpandedId(theme.id);
                          }
                        }}
                      >
                        {isExpanded ? <ChevronDown /> : <ChevronRight />}
                      </Button>
                    </div>

                    {isExpanded && <ThemeFiles id={theme.id} isOwner={true} />}
                  </CardContent>
                </Card>
              );
            })}
        </FadeInList>
      )}
    </div>
  );
};

export default FavoriteThemes;
