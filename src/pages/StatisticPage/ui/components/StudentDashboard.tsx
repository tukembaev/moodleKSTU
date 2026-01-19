import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuBookOpen, LuClock, LuTrendingUp } from "react-icons/lu";
import { Link } from "react-router-dom";
import { AppSubRoutes, RoutePath } from "shared/config";
import { Badge } from "shared/shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { Progress } from "shared/shadcn/ui/progress";
import { Skeleton } from "shared/shadcn/ui/skeleton";

export const StudentDashboard = () => {
  const { data, isLoading, error } = useQuery(courseQueries.studentDashboard());

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        <p className="font-semibold">Ошибка при загрузке статистики</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Неизвестная ошибка"}
        </p>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-muted-foreground">Нет данных для отображения</div>;
  }

  const { overall_progress, courses = [], upcoming_deadlines = [] } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Общий прогресс */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Общий прогресс</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_progress.completion_percentage.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overall_progress.completion_percentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {overall_progress.current_points} / {overall_progress.max_points} баллов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Средний балл</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_progress.average_score.toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuTrendingUp className="h-4 w-4" />
              <span>По всем курсам</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Активные курсы</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_progress.active_courses_count}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuBookOpen className="h-4 w-4" />
              <span>Завершено: {overall_progress.completed_courses_count}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Общая сумма баллов</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_progress.total_points}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Всего набрано баллов</p>
          </CardContent>
        </Card>
      </div>

      {/* Курсы */}
      <Card>
        <CardHeader>
          <CardTitle>Мои курсы</CardTitle>
          <CardDescription>Статистика по каждому курсу</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={RoutePath[AppSubRoutes.COURSE_THEMES].replace(":id", course.id)}
                className="block p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.discipline_name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Группа: {course.course_students.group}</span>
                      <span>Поток: {course.course_students.stream}</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Прогресс</span>
                        <span className="text-sm font-medium">
                          {course.completion_percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={course.completion_percentage} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Задания</p>
                          <p className="text-sm font-medium">
                            {course.tasks_statistics.completed} / {course.tasks_statistics.total}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Тесты</p>
                          <p className="text-sm font-medium">
                            {course.tests_statistics.completed} / {course.tests_statistics.total}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-2xl font-bold">{course.current_points}</p>
                    <p className="text-sm text-muted-foreground">/ {course.max_points}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ближайшие дедлайны */}
      {upcoming_deadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ближайшие дедлайны</CardTitle>
            <CardDescription>Задания, которые нужно выполнить</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming_deadlines.map((deadline) => (
                <div
                  key={deadline.course_detail.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{deadline.course_detail.title}</h4>
                      <Badge variant="outline">{deadline.course_detail.type_less}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {deadline.course.discipline_name}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <LuClock className="h-4 w-4" />
                      <span>
                        {format(new Date(deadline.course_detail.deadline), "dd MMMM yyyy", {
                          locale: ru,
                        })}
                      </span>
                      <Badge variant={deadline.days_remaining <= 3 ? "destructive" : "secondary"}>
                        {deadline.days_remaining} {deadline.days_remaining === 1 ? "день" : "дней"}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-medium">{deadline.course_detail.max_points} баллов</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
};

