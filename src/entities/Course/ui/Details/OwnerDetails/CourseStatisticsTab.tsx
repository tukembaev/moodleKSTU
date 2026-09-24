import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import type { TaskDetail, TeacherCourseDetail, TeacherCourseTasksStatistics, TestDetail } from "entities/Course/model/types/statistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { Progress } from "shared/shadcn/ui/progress";
import { Badge } from "shared/shadcn/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import { LuUsers, LuFileCheck } from "react-icons/lu";

export const CourseStatisticsTab = () => {
  const { t } = useTranslation();
  const id = useCourseId();
  const { data, isLoading, error } = useQuery(courseQueries.teacherCourseDetail(id || null));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <p className="font-semibold">{t("Ошибка при загрузке статистики курса")}</p>
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
    students_statistics,
    tasks_statistics,
    tests_statistics,
    top_students,
  } = data;

  const tasksDetail = tasks_statistics?.tasks_detail ?? [];
  const testsDetail = tests_statistics?.tests_detail ?? [];
  const tasksByType = tasks_statistics?.by_type ?? {};
  const scoreDistribution = students_statistics?.score_distribution;
  const hasTopStudents = Boolean(top_students?.length);

  return (
    <div className="flex flex-col gap-6">
      {students_statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardDescription>{t("Всего студентов")}</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {students_statistics.total_students}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LuUsers className="h-4 w-4" />
                <span>
                  {t("Активных: {{count}}", { count: students_statistics.active_students })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>{t("Средний балл")}</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {students_statistics.average_score.toFixed(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>{t("Макс: {{score}}", { score: students_statistics.max_score })}</p>
                <p>{t("Мин: {{score}}", { score: students_statistics.min_score })}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>{t("Завершили курс")}</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {students_statistics.completed_students}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={students_statistics.completion_percentage}
                className="h-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {students_statistics.completion_percentage.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          {tasks_statistics?.overall && (
            <Card>
              <CardHeader>
                <CardDescription>{t("Непроверенных работ")}</CardDescription>
                <CardTitle className="text-3xl font-semibold text-destructive">
                  {tasks_statistics.overall.unchecked_responses}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LuFileCheck className="h-4 w-4" />
                  <span>{t("Требуют внимания")}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {scoreDistribution && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Распределение баллов")}</CardTitle>
            <CardDescription>{t("По категориям успеваемости")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scoreDistribution.excellent && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{t("Отлично")}</p>
                  <p className="text-2xl font-bold">
                    {scoreDistribution.excellent.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scoreDistribution.excellent.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scoreDistribution.excellent.range}
                  </p>
                </div>
              )}
              {scoreDistribution.good && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{t("Хорошо")}</p>
                  <p className="text-2xl font-bold">
                    {scoreDistribution.good.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scoreDistribution.good.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scoreDistribution.good.range}
                  </p>
                </div>
              )}
              {scoreDistribution.satisfactory && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{t("Удовлетворительно")}</p>
                  <p className="text-2xl font-bold">
                    {scoreDistribution.satisfactory.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scoreDistribution.satisfactory.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scoreDistribution.satisfactory.range}
                  </p>
                </div>
              )}
              {scoreDistribution.unsatisfactory && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{t("Неудовлетворительно")}</p>
                  <p className="text-2xl font-bold">
                    {scoreDistribution.unsatisfactory.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scoreDistribution.unsatisfactory.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scoreDistribution.unsatisfactory.range}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">{t("Задания")}</TabsTrigger>
          <TabsTrigger value="tests">{t("Тесты")}</TabsTrigger>
          {hasTopStudents && <TabsTrigger value="top">{t("Топ студентов")}</TabsTrigger>}
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Статистика по заданиям")}</CardTitle>
              <CardDescription>
                {t("Общая статистика выполнения заданий студентами")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks_statistics?.overall && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Всего заданий")}</p>
                    <p className="text-2xl font-bold">{tasks_statistics.overall.total_tasks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Проверено")}</p>
                    <p className="text-2xl font-bold">
                      {tasks_statistics.overall.checked_responses} / {tasks_statistics.overall.total_responses}
                    </p>
                    {tasks_statistics.overall.total_responses > 0 && (
                      <Progress
                        value={
                          (tasks_statistics.overall.checked_responses /
                            tasks_statistics.overall.total_responses) *
                          100
                        }
                        className="h-2 mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Средний балл")}</p>
                    <p className="text-2xl font-bold">
                      {tasks_statistics.overall.average_score.toFixed(1)}
                    </p>
                  </div>
                </div>
              )}

              {Object.keys(tasksByType).length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">{t("По типам заданий")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.entries(tasksByType) as [string, TeacherCourseTasksStatistics["by_type"][string]][]).map(([type, stats]) => (
                      <Card key={type}>
                        <CardHeader>
                          <CardTitle className="text-lg">{type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{t("Всего заданий")}</span>
                              <span className="font-medium">{stats.total_tasks}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{t("Проверено")}</span>
                              <span className="font-medium">
                                {stats.checked_responses} / {stats.total_responses}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{t("Средний балл")}</span>
                              <span className="font-medium">{stats.average_score.toFixed(1)}</span>
                            </div>
                            <Progress value={stats.completion_percentage} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {tasksDetail.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">{t("Детали по заданиям")}</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("Задание")}</TableHead>
                          <TableHead>{t("Тип")}</TableHead>
                          <TableHead>{t("Ответов")}</TableHead>
                          <TableHead>{t("Проверено")}</TableHead>
                          <TableHead>{t("Средний балл")}</TableHead>
                          <TableHead>{t("Просрочено")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasksDetail.map((task: TaskDetail) => (
                          <TableRow key={task.course_detail.id}>
                            <TableCell className="font-medium">
                              {task.course_detail.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{task.course_detail.type_less}</Badge>
                            </TableCell>
                            <TableCell>{task.responses_count}</TableCell>
                            <TableCell>
                              {task.checked_count} / {task.responses_count}
                            </TableCell>
                            <TableCell>{task.average_score.toFixed(1)}</TableCell>
                            <TableCell>
                              {task.overdue_responses > 0 ? (
                                <Badge variant="destructive">{task.overdue_responses}</Badge>
                              ) : (
                                <span className="text-muted-foreground">0</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Статистика по тестам")}</CardTitle>
              <CardDescription>{t("Общая статистика прохождения тестов")}</CardDescription>
            </CardHeader>
            <CardContent>
              {tests_statistics?.overall && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Всего тестов")}</p>
                    <p className="text-2xl font-bold">{tests_statistics.overall.total_tests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Попыток")}</p>
                    <p className="text-2xl font-bold">{tests_statistics.overall.total_attempts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Средний балл")}</p>
                    <p className="text-2xl font-bold">
                      {tests_statistics.overall.average_score.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Процент прохождения")}</p>
                    <p className="text-2xl font-bold">
                      {tests_statistics.overall.completion_percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {testsDetail.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">{t("Детали по тестам")}</h3>
                  {testsDetail.map((test: TestDetail) => (
                    <Card key={test.testing.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{test.testing.title}</CardTitle>
                          <Badge variant="outline">{t("{{count}} баллов", { count: test.testing.max_points })}</Badge>
                        </div>
                        {test.testing.description && (
                          <CardDescription>{test.testing.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{t("Попыток")}</p>
                            <p className="text-xl font-bold">{test.attempts_count}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t("Средний балл")}</p>
                            <p className="text-xl font-bold">{test.average_score.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t("Макс / Мин")}</p>
                            <p className="text-xl font-bold">
                              {test.max_score} / {test.min_score}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t("Правильность")}</p>
                            <p className="text-xl font-bold">
                              {test.average_correct_percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {hasTopStudents && (
          <TabsContent value="top" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Топ студентов")}</CardTitle>
                <CardDescription>{t("Студенты с наивысшими баллами")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Место")}</TableHead>
                        <TableHead>{t("Студент")}</TableHead>
                        <TableHead>{t("Группа")}</TableHead>
                        <TableHead>{t("Баллы")}</TableHead>
                        <TableHead>{t("Статус")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {top_students.map((student: NonNullable<TeacherCourseDetail["top_students"]>[number], index: number) => (
                        <TableRow key={student.user_data.id}>
                          <TableCell>
                            <Badge variant={index < 3 ? "default" : "outline"}>
                              {student.position}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.user_data.last_name} {student.user_data.first_name}
                          </TableCell>
                          <TableCell>{student.user_data.group}</TableCell>
                          <TableCell className="font-bold">{student.overall_score}</TableCell>
                          <TableCell>
                            <Badge
                              variant={student.course_students.is_end ? "default" : "secondary"}
                            >
                              {student.course_students.is_end ? t("Завершен") : t("Активен")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
