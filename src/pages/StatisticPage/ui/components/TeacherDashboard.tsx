import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuBookOpen, LuFileCheck, LuUsers } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { openCourse } from "shared/lib/navigation/hidden-ids";
import { Badge } from "shared/shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { Skeleton } from "shared/shadcn/ui/skeleton";

export const TeacherDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery(courseQueries.teacherDashboard());

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
        <p className="font-semibold">{t("Ошибка при загрузке статистики")}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : t("Неизвестная ошибка")}
        </p>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-muted-foreground">{t("Нет данных для отображения")}</div>;
  }

  const {
    overall_statistics,
    courses = [],
    recent_activity
  } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>{t("Всего курсов")}</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_statistics.total_courses}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuBookOpen className="h-4 w-4" />
              <span>
                {t("Активных: {{count}}", { count: overall_statistics.active_courses })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t("Всего студентов")}</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_statistics.total_students}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuUsers className="h-4 w-4" />
              <span>{t("По всем курсам")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t("Непроверенных работ")}</CardDescription>
            <CardTitle className="text-3xl font-semibold text-destructive">
              {overall_statistics.unchecked_works}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuFileCheck className="h-4 w-4" />
              <span>{t("Требуют внимания")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t("Средний балл")}</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_statistics.average_course_score.toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("По всем курсам")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t("Проверено сегодня")}</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {recent_activity.checked_today}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("За неделю: {{count}}", { count: recent_activity.checked_this_week })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Курсы */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Мои курсы")}</CardTitle>
          <CardDescription>{t("Статистика по каждому курсу")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <button
                type="button"
                key={course.course.id}
                onClick={() => openCourse(navigate, course.course.id)}
                className="block w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.course.discipline_name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("Студентов")}</p>
                        <p className="text-sm font-medium">
                          {course.students_statistics.total_students}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Активных: {{count}}", { count: course.students_statistics.active_students })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("Средний балл")}</p>
                        <p className="text-sm font-medium">
                          {course.students_statistics.average_score.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("Задания")}</p>
                        <p className="text-sm font-medium">
                          {course.tasks_statistics.checked_responses} / {course.tasks_statistics.total_responses}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Проверено: {{percent}}%", { percent: course.tasks_statistics.completion_percentage.toFixed(1) })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("Тесты")}</p>
                        <p className="text-sm font-medium">
                          {t("{{count}} попыток", { count: course.tests_statistics.total_attempts })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Средний: {{score}}", { score: course.tests_statistics.average_score.toFixed(1) })}
                        </p>
                      </div>
                    </div>
                    {course.unchecked_works_count > 0 && (
                      <div className="mt-3">
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <LuFileCheck className="h-3 w-3" />
                          {t("{{count}} непроверенных работ", { count: course.unchecked_works_count })}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Активность проверки */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Активность проверки")}</CardTitle>
          <CardDescription>{t("Статистика проверки работ")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("Проверено сегодня")}</p>
              <p className="text-2xl font-bold">{recent_activity.checked_today}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Проверено за неделю")}</p>
              <p className="text-2xl font-bold">{recent_activity.checked_this_week}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Среднее время проверки")}</p>
              <p className="text-2xl font-bold">
                {t("{{hours}} ч", { hours: recent_activity.average_check_time_hours.toFixed(1) })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

