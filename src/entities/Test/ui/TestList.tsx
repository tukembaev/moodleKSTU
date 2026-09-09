import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { LuHandCoins, LuPlus } from "react-icons/lu";

import { CourseCardSkeleton } from "entities/Course";
import { useNavigate } from "react-router-dom";
import {
  FadeIn,
  SpringPopupList,
  UseConfirmationDialog,
  UseTooltip,
} from "shared/components";
import { useAuth } from "shared/hooks";
import { openTestEdit, openTestPass } from "shared/lib/navigation/hidden-ids";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { testQueries } from "../model/services/testQueryFactory";

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
  const { data: test_list, isLoading } = useQuery(testQueries.allTest());
  const { mutate: deleteTest, isPending: isDeleting } = testQueries.delete_test();
  const navigate = useNavigate();
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {!isStudent ? null : theme.passed === true ? (
                      <Badge className="bg-green-300 text-primary  text-md px-1.5">
                        Пройден: {theme.result}
                      </Badge>
                    ) : theme.passed === false ? (
                      <Badge variant="destructive" className=" text-md px-1.5">
                        Не пройден{theme.result != null ? `: ${theme.result}` : ""}
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
                  {!isStudent ? (
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <Button
                        className="shadow-none h-8 w-full sm:flex-1 text-sm"
                        variant="outline"
                        onClick={() => openTestEdit(navigate, theme.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Редактировать
                      </Button>
                      <UseConfirmationDialog
                        title="Удалить тест?"
                        description={`«${theme.title}» будет удалён вместе с вопросами и результатами без возможности восстановления.`}
                        onConfirm={() => deleteTest(theme.id)}
                        trigger={
                          <Button
                            className="shadow-none h-8 w-full sm:flex-1 text-sm"
                            variant="destructive"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                            Удалить
                          </Button>
                        }
                      />
                    </div>
                  ) : theme.passed == null ? (
                    <Button
                      className="shadow-none w-full mt-2 h-8 text-sm"
                      variant="outline"
                        onClick={() => openTestPass(navigate, theme.id)}
                    >
                      Пройти тест <ChevronRight className="h-3 w-3" />
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })
        )}

        {!isStudent && (
        <FadeIn className="flex border rounded-xl py-4 px-5 w-full justify-center items-center min-h-48">
          
            <UseTooltip text="Добавить тест">
              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => navigate("/test/add-quiz")}
              >
                <LuPlus size={35} className="text-muted-foreground" />
                <p>Добавьте новый тест</p>
              </div>
            </UseTooltip>
          
        </FadeIn>
        )}
      </div>
      {/* <Blog03Page /> */}
    </div>
  );
};

export default TestList;
