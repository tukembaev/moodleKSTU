import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Lock,
  LockOpen,
  PlayCircle,
  Trophy,
  XCircle
} from "lucide-react";
import {
  LuCalendarDays,
  LuHandCoins,
  LuShapes
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UseTooltip } from "shared/components";
import { AppSubRoutes } from "shared/config";
import { useAuth } from "shared/hooks";
import { getFormattedDate } from "shared/lib";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { studentCanTakeTest, Test } from "../model/types/test";

// Компонент статуса теста
const TestStatusBadge: React.FC<{
  passed?: boolean | null;
  result: number | null;
}> = ({ passed, result }) => {
  if (passed === true) {
    return (
      <Badge className="gap-1.5 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800">
        <CheckCircle2 className="h-3 w-3" />
        Пройден{result !== null ? `: ${result}` : ""}
      </Badge>
    );
  }

  if (passed === false) {
    return (
      <Badge className="gap-1.5 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800">
        <XCircle className="h-3 w-3" />
        Не пройден{result !== null ? `: ${result}` : ""}
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="gap-1.5 text-muted-foreground">
      <AlertCircle className="h-3 w-3" />
      Не сдано
    </Badge>
  );
};

const TestCard = ({
  item, 
  courseId,
  viewMode = "grid"
}: {
  item: Test; 
  courseId?: string;
  viewMode?: "grid" | "list";
}) => {
  const { isStudent } = useAuth();
  const navigate = useNavigate();
  const canTake = isStudent && studentCanTakeTest(item);
  const passPath =
    "/test/" +
    AppSubRoutes.TEST_PASS +
    "/" +
    item.id +
    (courseId ? `?course_id=${courseId}` : "");
  
  // Category styling for tests
  const testCategory = {
    badgeClass: "bg-rose-50 text-rose-600/80 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400/80 dark:border-rose-800/30",
    iconClass: "text-rose-600 dark:text-rose-400",
    gradientClass: "from-rose-500/10 via-transparent to-transparent",
    borderClass: "hover:border-rose-300 dark:hover:border-rose-700"
  };
  
  // List view mode
  if (viewMode === "list") {
    return (
      <Card className={`
        group relative overflow-hidden border rounded-xl transition-all duration-300 
        hover:shadow-sm ${testCategory.borderClass}
      `}>
        {/* Gradient accent */}
        <div className={`absolute inset-0 bg-gradient-to-r ${testCategory.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
        
        <CardContent className="relative p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-4">
            {/* Left side */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {/* Category icon with background */}
              <div className={`p-2 rounded-lg ${testCategory.badgeClass} shrink-0`}>
                <LuShapes className={`text-lg ${testCategory.iconClass}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-semibold">
                    {item.title}
                  </span>
                  <Badge className={`${testCategory.badgeClass} text-xs gap-1`}>
                    <LuShapes className="h-3 w-3" />
                    Тест
                  </Badge>
                  <Badge variant={item.is_open ? "default" : "outline"} className="text-xs gap-1">
                    {item.is_open ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {item.is_open ? "Открыт" : "Закрыт"}
                  </Badge>
                </div>
                
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1 hidden md:block">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
              {/* Stats */}
              <div className="flex gap-3 sm:gap-4 text-sm text-muted-foreground">
                <UseTooltip text="Максимальные баллы">
                  <div className="flex items-center gap-1.5 font-medium">
                    <div className="p-1 rounded bg-primary/10">
                      <LuHandCoins className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>{item.max_points}</span>
                  </div>
                </UseTooltip>
                
                <UseTooltip
                  text={`Дата открытия: ${format(new Date(item.opening_date), "PPP", { locale: ru })}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-muted">
                      <LuCalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span>{getFormattedDate(new Date(item.opening_date))}</span>
                  </div>
                </UseTooltip>
              </div>
              
              {/* Status for student */}
              {isStudent && (
                <TestStatusBadge passed={item.passed} result={item.result} />
              )}
              
              {/* Action button */}
              {!isStudent ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 shadow-none"
                  onClick={() =>
                    navigate(
                      "/test/result" +
                      `?test_id=${item.id}` +
                      `&course_id=${courseId || ""}`
                    )
                  }
                >
                  <BarChart3 className="h-4 w-4" />
                  Результаты
                </Button>
              ) : canTake ? (
                <Button
                  size="sm"
                  className="gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={() => navigate(passPath)}
                >
                  <PlayCircle className="h-4 w-4" />
                  Пройти
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
    <Card className={`
      group relative overflow-hidden transition-all duration-300 hover:shadow-md
      ${testCategory.borderClass}
    `}>
      {/* Gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${testCategory.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      
      <CardContent className="relative flex flex-col gap-3 p-4 sm:p-5 h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <Badge className={`gap-1.5 ${testCategory.badgeClass}`}>
            <LuShapes className={testCategory.iconClass} />
            <span>Тестирование</span>
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant={item.is_open ? "default" : "outline"} className="gap-1">
              {item.is_open ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {item.is_open ? "Открыт" : "Закрыт"}
            </Badge>
            {isStudent && (
              <TestStatusBadge passed={item.passed} result={item.result} />
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">
          {item.title}
        </h3>
        
        {/* Description */}
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {item.description}
          </p>
        )}
        
        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground pt-2">
          <UseTooltip text="Максимальные баллы">
            <div className="flex items-center gap-1.5 font-medium">
              <div className="p-1 rounded bg-primary/10">
                <LuHandCoins className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>{item.max_points} баллов</span>
            </div>
          </UseTooltip>
          
          <UseTooltip
            text={`Дата открытия: ${format(new Date(item.opening_date), "PPP", { locale: ru })}`}
          >
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-muted">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span>{getFormattedDate(new Date(item.opening_date))}</span>
            </div>
          </UseTooltip>
        </div>
        
        {/* Action button */}
        <div className="pt-3 mt-auto border-t border-border/50">
          {!isStudent ? (
            <Button
              className="w-full gap-2 shadow-none"
              variant="outline"
              onClick={() =>
                navigate(
                  "/test/result" +
                  `?test_id=${item.id}` +
                  `&course_id=${courseId || ""}`
                )
              }
            >
              <BarChart3 className="h-4 w-4" />
              Открыть результаты
            </Button>
          ) : canTake ? (
            <Button
              className="w-full gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(passPath)}
            >
              <PlayCircle className="h-4 w-4" />
              Пройти тест
            </Button>
          ) : item.passed === true ? (
            <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Пройден: {item.result ?? 0} / {item.max_points} баллов
              </span>
            </div>
          ) : item.passed === false ? (
            <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Не пройден: {item.result ?? 0} / {item.max_points} баллов
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCard;
