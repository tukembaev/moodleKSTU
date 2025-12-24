import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuClock } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { Badge } from "shared/shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { Progress } from "shared/shadcn/ui/progress";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";

export const StudentCourseStatisticsTab = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery(courseQueries.studentCourseDetail(id || null));

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
        <p className="font-semibold">Ошибка при загрузке статистики курса</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Неизвестная ошибка"}
        </p>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-muted-foreground">Нет данных для отображения</div>;
  }

  const {

    overall_statistics,
    tasks_statistics,
    tests_statistics,
    materials_statistics,
    discussion_statistics,
    comparison_statistics,
  } = data;

  // Безопасные значения по умолчанию
  const tasksList = tasks_statistics?.tasks_list || [];
  const testsList = tests_statistics?.tests_list || [];
  const tasksByType = tasks_statistics?.by_type || {};
  const tasksOverall = tasks_statistics?.overall;
  const testsOverall = tests_statistics?.overall;

  return (
    <div className="flex flex-col gap-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Общий прогресс</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_statistics.completion_percentage.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overall_statistics.completion_percentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {overall_statistics.current_points} / {overall_statistics.max_points} баллов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Дополнительные баллы</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {overall_statistics.extra_points?.total || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {overall_statistics.extra_points?.items?.length || 0} начислений
            </p>
          </CardContent>
        </Card>

        {tasksOverall && (
          <Card>
            <CardHeader>
              <CardDescription>Задания</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {tasksOverall.completed || 0} / {tasksOverall.total || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={tasksOverall.completion_percentage || 0} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {(tasksOverall.completion_percentage || 0).toFixed(1)}% выполнено
              </p>
            </CardContent>
          </Card>
        )}

        {testsOverall && (
          <Card>
            <CardHeader>
              <CardDescription>Тесты</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {testsOverall.completed || 0} / {testsOverall.total || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Средний балл: {(testsOverall.average_score || 0).toFixed(1)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Сравнение с группой и потоком */}
      {comparison_statistics && (comparison_statistics.group || comparison_statistics.stream) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparison_statistics.group && (
            <Card>
              <CardHeader>
                <CardTitle>Позиция в группе</CardTitle>
                <CardDescription>{comparison_statistics.group.group || "Группа"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold">{comparison_statistics.group.position}</p>
                  <p className="text-sm text-muted-foreground">
                    из {comparison_statistics.group.total_students} студентов
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Лучше {comparison_statistics.group.percentage_better.toFixed(1)}% студентов
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {comparison_statistics.stream && (
            <Card>
              <CardHeader>
                <CardTitle>Позиция в потоке</CardTitle>
                <CardDescription>{comparison_statistics.stream.stream || "Поток"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold">{comparison_statistics.stream.position}</p>
                  <p className="text-sm text-muted-foreground">
                    из {comparison_statistics.stream.total_students} студентов
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Лучше {comparison_statistics.stream.percentage_better.toFixed(1)}% студентов
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Табы с детальной статистикой */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Задания</TabsTrigger>
          <TabsTrigger value="tests">Тесты</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Статистика по заданиям</CardTitle>
              <CardDescription>Ваша статистика выполнения заданий</CardDescription>
            </CardHeader>
            <CardContent>
              {/* По типам заданий */}
              {Object.keys(tasksByType).length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">По типам заданий</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(tasksByType).map(([type, stats]) => (
                      <Card key={type}>
                        <CardHeader>
                          <CardTitle className="text-lg">{type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Выполнено</span>
                              <span className="font-medium">
                                {stats.completed || 0} / {stats.total || 0}
                              </span>
                            </div>
                            <Progress value={stats.completion_percentage || 0} className="h-2" />
                            {stats.earned_points !== undefined && (
                              <div className="flex justify-between mt-2">
                                <span className="text-sm text-muted-foreground">Баллы</span>
                                <span className="font-medium">
                                  {stats.earned_points} / {stats.max_points || 0}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Список заданий */}
              {tasksList.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Список заданий</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Задание</TableHead>
                          <TableHead>Тип</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Баллы</TableHead>
                          <TableHead>Дедлайн</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasksList.map((task) => (
                          <TableRow key={task.course_detail.id}>
                            <TableCell className="font-medium">
                              {task.course_detail.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{task.course_detail.type_less}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  task.status === "completed"
                                    ? "default"
                                    : task.status === "on_review"
                                      ? "secondary"
                                      : task.status === "overdue"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {task.status === "completed"
                                  ? "Выполнено"
                                  : task.status === "on_review"
                                    ? "На проверке"
                                    : task.status === "overdue"
                                      ? "Просрочено"
                                      : "Не начато"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {task.task_files ? (
                                <span className="font-medium">
                                  {task.task_files.points} / {task.course_detail.max_points}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <LuClock className="h-4 w-4" />
                                {format(new Date(task.course_detail.deadline), "dd.MM.yyyy", {
                                  locale: ru,
                                })}
                              </div>
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
              <CardTitle>Статистика по тестам</CardTitle>
              <CardDescription>Ваши результаты тестов</CardDescription>
            </CardHeader>
            <CardContent>
              {testsList.length > 0 ? (
                <div className="space-y-4">
                  {testsList.map((test) => (
                    <Card key={test.testing.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{test.testing.title}</CardTitle>
                          <Badge variant="outline">{test.testing.max_points} баллов</Badge>
                        </div>
                        <CardDescription>{test.testing.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {test.result_testing ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Балл</p>
                              <p className="text-xl font-bold">
                                {test.result_testing.score} / {test.result_testing.total_questions}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Правильность</p>
                              <p className="text-xl font-bold">
                                {test.correct_percentage?.toFixed(1) || 0}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Попыток</p>
                              <p className="text-xl font-bold">{test.attempts_count}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Лучший результат</p>
                              <p className="text-xl font-bold">{test.best_score || "-"}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-4">
                            Тест еще не пройден
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">Нет тестов</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Дополнительная информация */}
      {(materials_statistics || discussion_statistics) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials_statistics && (
            <Card>
              <CardHeader>
                <CardTitle>Материалы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Просмотрено</span>
                    <span className="font-medium">
                      {materials_statistics.viewed_count} / {materials_statistics.total_count}
                    </span>
                  </div>
                  <Progress value={materials_statistics.view_percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {discussion_statistics && (
            <Card>
              <CardHeader>
                <CardTitle>Обсуждения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Комментарии</span>
                    <span className="font-medium">{discussion_statistics.comments_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ответы</span>
                    <span className="font-medium">{discussion_statistics.replies_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Лайки</span>
                    <span className="font-medium">{discussion_statistics.likes_received}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

