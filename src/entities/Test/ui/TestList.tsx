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
              <Card key={theme.id} className="transition-all duration-300">
                <CardContent className="flex flex-col p-4 gap-2">
                  <span className="text-lg font-semibold flex gap-2 items-center flex-wrap">
                    {theme.title}
                    {!isStudent ? null : theme.status ? (
                      <Badge className="bg-green-300 text-primary  text-md px-1.5">
                        Сдано на {theme.result}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className=" text-md px-1.5">
                        Не сдано
                      </Badge>
                    )}
                  </span>
                  <div className="flex gap-4 text-md text-foreground/80 items-center">
                    {theme.max_points && (
                      <UseTooltip text="Максимальное количество баллов">
                        <div className="flex items-center gap-1.5">
                          <LuHandCoins className="h-3.5 w-3.5" />
                          <span>{theme.max_points}</span>
                        </div>
                      </UseTooltip>
                    )}
                  
                  </div>
                  <span className="text-md text-foreground/80 line-clamp-2">
                    {theme.description}
                  </span>
                  {!isStudent || theme.status ? (
                    <Button
                      className="shadow-none w-full mt-2 h-8 text-md"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          "/test/result" +
                          `?test_id=${theme.id}` +
                          `&course_id=${theme.resides.course[0].id}`
                        )
                      }
                    >
                      Открыть результаты <ChevronRight className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      className="shadow-none w-full mt-2 h-8 text-md"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          "/test/" + AppSubRoutes.TEST_PASS + "/" + theme.id
                        )
                      }
                    >
                      Пройти тест <ChevronRight className="h-3 w-3" />
                    </Button>
                  )}
                   {/* <Button
                      className="shadow-none w-full mt-2 h-8 text-md"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          "/test/" + AppSubRoutes.TEST_PASS + "/" + theme.id
                        )
                      }
                    >
                      Пройти тест <ChevronRight className="h-3 w-3" />
                    </Button> */}
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
