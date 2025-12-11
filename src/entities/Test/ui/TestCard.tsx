import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LuCalendarDays, LuHandCoins, LuShapes } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UseTooltip } from "shared/components";
import { AppSubRoutes } from "shared/config";
import { useAuth } from "shared/hooks";
import { getFormattedDate } from "shared/lib";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { Test } from "../model/types/test";
import { ChevronRight } from "lucide-react";

  const TestCard = ({item, id_week, viewMode = "grid"}: {item: Test, id_week: string, viewMode?: "grid" | "list"}) => {
  const { isStudent } = useAuth();
  const navigate = useNavigate();
  
  // List view mode
  if (viewMode === "list") {
    return (
      <Card className="border border-b rounded-lg mb-3 sm:mb-4 p-0">
        <CardContent className="p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <span className="text-base sm:text-lg font-semibold">
                {item.title}
              </span>
              <span className="text-xs text-foreground/80 hidden md:inline">
                {item.description}
              </span>
              <Badge className="gap-2 shrink-0 bg-rose-50 text-rose-600/80 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400/80 dark:border-rose-800/30">
                <span className="text-rose-600 dark:text-rose-400"><LuShapes /></span>
                <span>Тестирование</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 flex-wrap">
              <div className="flex gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-foreground/80">
                <UseTooltip text="Максимальное количество баллов">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <LuHandCoins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{item.max_points}</span>
                  </div>
                </UseTooltip>
                <UseTooltip
                  text={`Дата открытия : ${format(new Date(item.opening_date), "PPP", {
                    locale: ru,
                  })}`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <LuCalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{getFormattedDate(new Date(item.opening_date))}</span>
                  </div>
                </UseTooltip>
              </div>
              {isStudent && (
                <div className="flex items-center">
                  {item.status && item.result !== null ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shrink-0">
                      {item.result} балла
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground shrink-0">
                      Не сдано
                    </Badge>
                  )}
                </div>
              )}
              {!isStudent ? (
                <Button
                  className="shadow-none"
                  size="sm"
                  variant={"outline"}
                  onClick={() =>
                    navigate(
                      "/test/result" +
                      `?test_id=${item.id}` +
                        `&weekId=${id_week}` 
                        
                    )
                  }
                >
                  Результаты <ChevronRight className="h-4 w-4" />
                </Button>
              ) : isStudent && !item.status ? (
                <Button
                  className="shadow-none"
                  size="sm"
                  variant={"outline"}
                  onClick={() => navigate("/test/" + AppSubRoutes.TEST_PASS + "/" + item.id)}
                >
                  Пройти <ChevronRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Grid view mode (default)
  return (
    <Card className="min-h-68 flex flex-col justify-between">
      <div className="flex flex-col w-full">
        <CardContent className="flex flex-col gap-2 p-3 sm:p-4">
          <div className="flex items-center mb-2 gap-2 justify-between flex-wrap">
            <Badge className="gap-2 bg-rose-50 text-rose-600/80 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400/80 dark:border-rose-800/30">
              <span className="text-rose-600 dark:text-rose-400"><LuShapes /></span>
              <span>Тестирование</span>
            </Badge>
            {isStudent && (
              item.status && item.result !== null ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  Сдано на {item.result} балла
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-muted-foreground">
                  Не сдано
                </Badge>
              )
            )}
          </div>
          
          <span className="text-base sm:text-lg font-semibold mb-2">{item.title}</span>
          <p className="text-sm sm:text-base text-foreground/80 mb-2">{item.description}</p>

          <div className="flex gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-foreground/80">
            <UseTooltip text="Максимальное количество баллов">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <LuHandCoins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{item.max_points}</span>
              </div>
            </UseTooltip>
            <UseTooltip
              text={`Дата открытия : ${format(new Date(item.opening_date), "PPP", {
                locale: ru,
              })}`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <LuCalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{getFormattedDate(new Date(item.opening_date))}</span>
              </div>
            </UseTooltip>
          </div>
       
          
          {!isStudent ? (
            <Button
              className="shadow-none w-full mt-4"
              variant={"outline"}
              onClick={() =>
                navigate(
                  "/test/result" +
                  `?test_id=${item.id}` +
                    `&weekId=${id_week}` 
                    
                )
              }
            >
              Открыть результаты <ChevronRight />
            </Button>
          ) : isStudent && !item.status ? (
            <Button
              className="shadow-none w-full mt-4"
              variant={"outline"}
              onClick={() => navigate("/test/" + AppSubRoutes.TEST_PASS + "/" + item.id)}
            >
              Пройти тест <ChevronRight />
            </Button>
          ) : null}
        </CardContent>
      </div>
    </Card>
  );
};

export default TestCard;
