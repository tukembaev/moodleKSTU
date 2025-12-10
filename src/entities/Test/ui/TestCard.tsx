import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LuCalendarDays, LuHandCoins } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UseTooltip } from "shared/components";
import { AppSubRoutes } from "shared/config";
import { useAuth } from "shared/hooks";
import { getFormattedDate } from "shared/lib";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Test } from "../model/types/test";
import { ChevronRight } from "lucide-react";

  const TestCard = ({item, course_id}: {item: Test, course_id: string}) => {
  const { isStudent } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Card className="min-h-68 flex flex-col justify-between">
      <div className="flex flex-col w-full">
        <CardHeader className="text-lg font-semibold w-full break-all">
          {!isStudent ? null : item.status && item.result !== null ? (
            <Badge className={"bg-green-300 text-primary max-h-6"}>
              Сдано на {item.result} балла
            </Badge>
          ) : (
            <Badge variant={"outline"} className="max-h-6">
              Не сдано
            </Badge>
          )}
          <span className="flex gap-2 my-2">{item.title}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 ">
          <p>{item.description}</p>

          <div className="flex flex-col gap-3">
            <UseTooltip text="Максимальное количество баллов" side="right">
              <div className="flex items-center gap-2 w-fit">
                <LuHandCoins className="h-4 w-4" />
                <span>{item.max_points}</span>
              </div>
            </UseTooltip>
            <UseTooltip
              text={`Дата открытия : ${format(new Date(item.opening_date), "PPP", {
                locale: ru,
              })}`}
              side="top"
            >
              <div className="flex items-center gap-2 w-fit">
                <LuCalendarDays className="h-4 w-4" />
                <span>{getFormattedDate(new Date(item.opening_date))}</span>
              </div>
            </UseTooltip>
            {/* <UseTooltip
              text={`Дедлайн : ${format(item.deadline, "PPP", {
                locale: ru,
              })}`}
              side="top"
            >
              <div className="flex items-center gap-2 w-fit">
                <LuTarget className="h-4 w-4" />
                <span>{getFormattedDate(item.deadline)}</span>
              </div>
            </UseTooltip> */}
          </div>
       
          {!isStudent ? (
            <Button
              className="shadow-none w-full mt-4"
              variant={"outline"}
              onClick={() =>
                navigate(
                  "/test/result" +
                  `?test_id=${item.id}` +
                    `&course_id=${course_id}` 
                    
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
           {/* <Button
              className="shadow-none w-full mt-4"
              variant={"outline"}
              onClick={() => navigate("/test/" + AppSubRoutes.TEST_PASS + "/" + item.id)}
            >
              Пройти тест <ChevronRight />
            </Button> */}
        </CardContent>
      </div>
    </Card>
  );
};

export default TestCard;
