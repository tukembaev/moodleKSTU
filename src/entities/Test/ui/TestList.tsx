import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { LuHandCoins, LuPlus, LuTarget } from "react-icons/lu";
import { ru } from "date-fns/locale";

import { useNavigate } from "react-router-dom";
import {
  FadeIn,
  HoverLift,
  SpringPopupList,
  UseTooltip,
} from "shared/components";
import { AppSubRoutes } from "shared/config";
import { useAuth } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { testQueries } from "../model/services/testQueryFactory";
import { CourseCardSkeleton } from "entities/Course";

// const data = [
//   {∏∏
//     id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     title: "string",
//     description: "string",
//     status: false,
//     deadline: "2025-04-04T07:40:24.638Z",
//     max_points: 2147483647,
//     test_owner: {
//       id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       user_id: 0,
//       first_name: "string",
//       last_name: "string",
//       middle_name: "string",
//       avatar: "string",
//       is_employee: true,
//       position: "string",
//       group: "string",
//     },
//     link_form: "string",
//     link_doc: "string",
//   },
// ];
const TestList = () => {
  const { isStudent } = useAuth();
  const { data: test_list, isLoading } = useQuery(testQueries.allTest("/"));
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col pt-3 pb-4">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-left">
          Мои тесты
        </h2>
        <p className="mt-1.5 text-lg text-muted-foreground">
          {isStudent
            ? "Все актуальные тесты, которые вам надо пройти"
            : "Все тесты, которые вы создавали "}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <SpringPopupList>
            {Array.from({ length: 5 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </SpringPopupList>
        ) : (
          test_list?.map((theme) => {
            return (
              <Card key={theme.id} className={`transition-all duration-300 `}>
                <CardContent className="flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <HoverLift>
                      {test_list?.[0]?.resides.theme.length ? (
                        <UseTooltip
                          text={theme?.resides?.course[0]?.discipline_name}
                        >
                          <Badge
                            variant="outline"
                            className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                            onClick={() =>
                              navigate(
                                "/courses/" +
                                  AppSubRoutes.COURSE_THEMES +
                                  "/" +
                                  theme.resides?.course[0]?.id +
                                  `?themeId=${theme.resides?.theme[0]?.id}`
                              )
                            }
                          >
                            {theme?.resides?.theme[0]?.title}
                          </Badge>
                        </UseTooltip>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                          onClick={() =>
                            navigate(
                              "/courses/" +
                                AppSubRoutes.COURSE_THEMES +
                                "/" +
                                theme.resides?.course[0]?.id
                            )
                          }
                        >
                          {theme?.resides?.course[0]?.discipline_name}
                        </Badge>
                      )}
                    </HoverLift>
                  </div>

                  <span
                    className={`text-lg font-semibold flex gap-2 items-center`}
                  >
                    {theme.title}
                    {!isStudent ? null : theme.status ? (
                      <Badge className={"bg-green-300 text-primary max-h-6"}>
                        Сдано на 52 балла
                      </Badge>
                    ) : (
                      <Badge variant={"outline"} className={"max-h-6"}>
                        Не сдано
                      </Badge>
                    )}
                  </span>
                  <div className="flex gap-6 text-sm text-foreground/80 items-center py-2">
                    {theme.max_points && (
                      <UseTooltip text="Максимальное количество баллов">
                        <div className="flex items-center gap-2">
                          <LuHandCoins className="h-4 w-4" />
                          <span>{theme.max_points}</span>
                        </div>
                      </UseTooltip>
                    )}
                    {theme.deadline && (
                      <UseTooltip text="Дедлайн сдачи задания">
                        <div className="flex items-center gap-2">
                          <LuTarget className="h-4 w-4" />
                          <span>
                            {format(theme.deadline, "PPP", {
                              locale: ru,
                            })}
                            {/* {(format(theme.deadline, "PPP"), { locale: ru })} */}
                          </span>
                        </div>
                      </UseTooltip>
                    )}
                  </div>
                  <span className={`text-md text-foreground/80 `}>
                    {theme.description}
                  </span>

                  {!isStudent || theme.status ? (
                    <Button
                      className="shadow-none w-full mt-4"
                      variant={"outline"}
                      onClick={() =>
                        navigate(
                          "/test/result/" +
                            theme.id +
                            `?course_id=${theme.resides.course[0].id}`
                        )
                      }
                    >
                      Открыть результаты <ChevronRight />
                    </Button>
                  ) : (
                    <Button
                      className="shadow-none w-full mt-4"
                      variant={"outline"}
                      onClick={() =>
                        navigate("/test/pass" + `?url=${theme.link_form}`)
                      }
                    >
                      Пройти тест <ChevronRight />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}

        <FadeIn className="flex border rounded-xl py-4 px-5 min-w-1/3 justify-center items-center min-h-48">
          <HoverLift>
            <UseTooltip text="Добавить тест">
              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => navigate("/test/add-quiz")}
              >
                <LuPlus size={35} className="text-muted-foreground" />
                <p>Добавьте новый тест</p>
              </div>
            </UseTooltip>
          </HoverLift>
        </FadeIn>
      </div>
      {/* <Blog03Page /> */}
    </div>
  );
};

export default TestList;
