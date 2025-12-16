import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
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
  const { id } = useParams();
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
    students_statistics,
    tasks_statistics,
    tests_statistics,
    top_students = [],
  } = data;

  // Безопасные значения по умолчанию для опциональных полей
  const tasksDetail = tasks_statistics?.tasks_detail || [];
  const testsDetail = tests_statistics?.tests_detail || [];
  const tasksByType = tasks_statistics?.by_type || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Общая статистика по студентам */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Всего студентов</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {students_statistics.total_students}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuUsers className="h-4 w-4" />
              <span>
                Активных: {students_statistics.active_students}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Средний балл</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {students_statistics.average_score.toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Макс: {students_statistics.max_score}</p>
              <p>Мин: {students_statistics.min_score}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Завершили курс</CardDescription>
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

        <Card>
          <CardHeader>
            <CardDescription>Непроверенных работ</CardDescription>
            <CardTitle className="text-3xl font-semibold text-destructive">
              {tasks_statistics?.overall?.unchecked_responses || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuFileCheck className="h-4 w-4" />
              <span>Требуют внимания</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Распределение баллов */}
      {students_statistics.score_distribution && (
        <Card>
          <CardHeader>
            <CardTitle>Распределение баллов</CardTitle>
            <CardDescription>По категориям успеваемости</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {students_statistics.score_distribution.excellent && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Отлично</p>
                  <p className="text-2xl font-bold">
                    {students_statistics.score_distribution.excellent.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {students_statistics.score_distribution.excellent.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {students_statistics.score_distribution.excellent.range}
                  </p>
                </div>
              )}
              {students_statistics.score_distribution.good && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Хорошо</p>
                  <p className="text-2xl font-bold">
                    {students_statistics.score_distribution.good.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {students_statistics.score_distribution.good.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {students_statistics.score_distribution.good.range}
                  </p>
                </div>
              )}
              {students_statistics.score_distribution.satisfactory && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Удовлетворительно</p>
                  <p className="text-2xl font-bold">
                    {students_statistics.score_distribution.satisfactory.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {students_statistics.score_distribution.satisfactory.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {students_statistics.score_distribution.satisfactory.range}
                  </p>
                </div>
              )}
              {students_statistics.score_distribution.unsatisfactory && (
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Неудовлетворительно</p>
                  <p className="text-2xl font-bold">
                    {students_statistics.score_distribution.unsatisfactory.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {students_statistics.score_distribution.unsatisfactory.percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {students_statistics.score_distribution.unsatisfactory.range}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Табы с детальной статистикой */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Задания</TabsTrigger>
          <TabsTrigger value="tests">Тесты</TabsTrigger>
          <TabsTrigger value="top">Топ студентов</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Статистика по заданиям</CardTitle>
              <CardDescription>
                Общая статистика выполнения заданий студентами
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks_statistics?.overall && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Всего заданий</p>
                  <p className="text-2xl font-bold">{tasks_statistics.overall.total_tasks || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Проверено</p>
                  <p className="text-2xl font-bold">
                    {tasks_statistics.overall.checked_responses || 0} / {tasks_statistics.overall.total_responses || 0}
                  </p>
                  {tasks_statistics.overall.total_responses > 0 && (
                  <Progress
                    value={
                      ((tasks_statistics.overall.checked_responses || 0) /
                        tasks_statistics.overall.total_responses) *
                      100
                    }
                    className="h-2 mt-2"
                  />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Средний балл</p>
                  <p className="text-2xl font-bold">
                    {(tasks_statistics.overall.average_score || 0).toFixed(1)}
                  </p>
                </div>
              </div>
              )}

              {/* По типам заданий */}
              {Object.keys(tasksByType).length > 0 && (
              <div className="space-y-4">
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
                            <span className="text-sm text-muted-foreground">Всего заданий</span>
                            <span className="font-medium">{stats.total_tasks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Проверено</span>
                            <span className="font-medium">
                              {stats.checked_responses} / {stats.total_responses}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Средний балл</span>
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

              {/* Детали по заданиям */}
              {tasksDetail.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Детали по заданиям</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Задание</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Ответов</TableHead>
                        <TableHead>Проверено</TableHead>
                        <TableHead>Средний балл</TableHead>
                        <TableHead>Просрочено</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasksDetail.slice(0, 10).map((task) => (
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
              <CardTitle>Статистика по тестам</CardTitle>
              <CardDescription>Общая статистика прохождения тестов</CardDescription>
            </CardHeader>
            <CardContent>
              {tests_statistics?.overall && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Всего тестов</p>
                  <p className="text-2xl font-bold">{tests_statistics.overall.total_tests || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Попыток</p>
                  <p className="text-2xl font-bold">{tests_statistics.overall.total_attempts || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Средний балл</p>
                  <p className="text-2xl font-bold">
                    {(tests_statistics.overall.average_score || 0).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Процент прохождения</p>
                  <p className="text-2xl font-bold">
                    {(tests_statistics.overall.completion_percentage || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
              )}

              {/* Детали по тестам */}
              {testsDetail.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Детали по тестам</h3>
                {testsDetail.map((test) => (
                  <Card key={test.testing.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{test.testing.title}</CardTitle>
                        <Badge variant="outline">{test.testing.max_points} баллов</Badge>
                      </div>
                      <CardDescription>{test.testing.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Попыток</p>
                          <p className="text-xl font-bold">{test.attempts_count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Средний балл</p>
                          <p className="text-xl font-bold">{test.average_score.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Макс / Мин</p>
                          <p className="text-xl font-bold">
                            {test.max_score} / {test.min_score}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Правильность</p>
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

        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Топ студентов</CardTitle>
              <CardDescription>Студенты с наивысшими баллами</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Место</TableHead>
                      <TableHead>Студент</TableHead>
                      <TableHead>Группа</TableHead>
                      <TableHead>Баллы</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {top_students.map((student, index) => (
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
                            {student.course_students.is_end ? "Завершен" : "Активен"}
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
      </Tabs>
    </div>
  );
};

