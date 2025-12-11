import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LuCalendarDays, LuCheckCheck, LuHandCoins, LuTarget, LuTrendingUp, LuUsers, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "shared/shadcn/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { Separator } from "shared/shadcn/ui/separator";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { testQueries } from "../model/services/testQueryFactory";
import TestTable from "./lib/TestTable";

const TestResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const weekId = searchParams.get("weekId");
  const test_id = searchParams.get("test_id");

  const { data: test_list, isLoading: isLoadingResults } = useQuery(
    testQueries.TestResult(test_id, weekId)
  );
  const { data: testDetails, isLoading: isLoadingDetails } = useQuery(
    testQueries.TestQuestions(test_id)
  );

  // Вычисление статистики
  const totalStudents = test_list?.length || 0;
  const passedStudents = test_list?.filter((s) => s.result !== null && s.result !== undefined) || [];
  const passedCount = passedStudents.length;
  const passedPercentage = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0;
  const averageScore = passedCount > 0
    ? Math.round(
        (passedStudents.reduce((sum, s) => sum + (s.result || 0), 0) / passedCount) * 10
      ) / 10
    : 0;
  const maxScore = testDetails?.maxPoints || 0;


  const openingDate = testDetails?.opening_date ? new Date(testDetails.opening_date) : null;

  if (isLoadingDetails || isLoadingResults) {
    return (
      <div className="min-h-screen flex flex-col gap-6 py-6 px-4 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-6 py-6 px-4 mx-auto">
      {/* Заголовок и навигация */}
      <div className="flex flex-col gap-4">
     

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {testDetails?.title || "Результаты теста"}
          </h1>
          {testDetails?.description && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
              {testDetails.description}
            </p>
          )}
        </div>

        {/* Информация о тесте */}
        <div className="flex flex-wrap gap-4 mt-2">
          {maxScore > 0 && (
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
              <LuHandCoins className="h-4 w-4" />
              <span>Максимум: {maxScore} баллов</span>
            </Badge>
          )}
       
          {openingDate && (
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
              <LuCalendarDays className="h-4 w-4" />
              <span>
                Открыт: {format(openingDate, "d MMMM yyyy", { locale: ru })}
              </span>
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <LuUsers className="h-4 w-4" />
              Всего студентов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <LuCheckCheck className="h-4 w-4 text-green-600" />
              Сдали тест
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{passedCount}</p>
            <p className="text-sm text-muted-foreground mt-1">{passedPercentage}% от общего числа</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <LuX className="h-4 w-4 text-red-600" />
              Не сдали
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{totalStudents - passedCount}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {totalStudents > 0 ? Math.round(((totalStudents - passedCount) / totalStudents) * 100) : 0}% от общего числа
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <LuTrendingUp className="h-4 w-4 text-blue-600" />
              Средний балл
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {averageScore > 0 ? averageScore : "-"}
            </p>
            {averageScore > 0 && maxScore > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                из {maxScore} возможных
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base sm:text-lg ">
          Результаты студентов
        </h2>
      <TestTable data={test_list || []} />

      </div>

     
    </div>
  );
};

export default TestResults;
