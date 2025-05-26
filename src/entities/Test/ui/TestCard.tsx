import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { LuCalendarDays, LuHandCoins } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UseTooltip } from "shared/components";
import { useAuth } from "shared/hooks";
import { getFormattedDate } from "shared/lib";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Test } from "../model/types/test";

const TestCard = (item: Test) => {
  const { isStudent } = useAuth();
  const navigate = useNavigate();

  return (
    <Card className="min-h-68 flex flex-col justify-between">
      <div className="flex flex-col w-full">
        <CardHeader className="text-lg font-semibold w-full break-all">
          {!isStudent ? null : item.status ? (
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
              text={`Дата открытия : ${format(item.opening_date, "PPP", {
                locale: ru,
              })}`}
              side="top"
            >
              <div className="flex items-center gap-2 w-fit">
                <LuCalendarDays className="h-4 w-4" />
                <span>{getFormattedDate(item.opening_date)}</span>
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
                  "/test/result/" +
                    item.id +
                    `?course_id=${item.resides.course[0].id}` +
                    `?max_points=${item.max_points}`
                )
              }
            >
              Открыть результаты <ChevronRight />
            </Button>
          ) : isStudent && !item.status ? (
            <Button
              className="shadow-none w-full mt-4"
              variant={"outline"}
              onClick={() => navigate("/test/pass" + `?url=${item.link_form}`)}
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
