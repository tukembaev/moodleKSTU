import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "shared/shadcn/ui/dialog";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/shadcn/ui/card";
  import { SetMark } from "features/Course/hooks/SetMark";
  import { useState } from "react";
  import { TablePerfomance } from "entities/Course/model/types/course";
  import { Badge } from "shared/shadcn/ui/badge";
  import { Button } from "shared/shadcn/ui/button";
  import { LuCheck, LuX } from "react-icons/lu";
  import { LuEye } from "react-icons/lu";
  import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";

const StudentDetailDialog = ({ student }: { student: TablePerfomance }) => {
    const [open, setOpen] = useState(false);
  
    // Подсчитываем баллы по модулям (здесь мы группируем все как один модуль)
    const module1Points = {
      lb: student.themes.lb.reduce((sum, item) => sum + (item.stud_points || 0), 0),
      pr: student.themes.pr.reduce((sum, item) => sum + (item.stud_points || 0), 0),
      tests: student.themes.tests.reduce((sum, item) => sum + (item.result || 0), 0),
    };
  
    const module1MaxPoints = {
      lb: student.themes.lb.reduce((sum, item) => sum + item.max_points, 0),
      pr: student.themes.pr.reduce((sum, item) => sum + item.max_points, 0),
      tests: student.themes.tests.reduce((sum, item) => sum + item.max_points, 0),
    };
  
    const totalModule1 = module1Points.lb + module1Points.pr + module1Points.tests;
    const maxModule1 = module1MaxPoints.lb + module1MaxPoints.pr + module1MaxPoints.tests;
  
    const TaskListItem = ({
      title,
      points,
      maxPoints,
      id,
      deadline,
    }: {
      title: string;
      points: number | null;
      maxPoints: number;
      id?: string | null;
      deadline?: string;
    }) => {
      const isPassed = points !== null && points >= maxPoints * 0.5;
      
      return (
        <SetMark
          text={title}
          id={id ?? undefined}
          max_points={maxPoints}
          points={points ?? 0}
        >
          <div className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="shrink-0">
                {isPassed ? (
                  <LuCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <LuX className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm truncate">{title}</p>
                {deadline && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Дата сдачи: {new Date(deadline).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Badge variant={isPassed ? "default" : "destructive"} className="font-semibold text-xs">
                {points ?? 0} / {maxPoints}
              </Badge>
            </div>
          </div>
        </SetMark>
      );
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <LuEye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 sm:gap-3">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                <AvatarImage src={student.avatar} />
              </Avatar>
              <div className="min-w-0">
                <p className="text-base sm:text-lg truncate">{`${student.first_name} ${student.last_name}`}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal">{student.group}</p>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Детальная статистика успеваемости студента
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 mt-4">
            {/* Модуль 1 */}
            <Card>
              <CardHeader className="px-4 sm:p-6">
                <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                  <span>Модуль 1</span>
                  <Badge variant="outline" className="text-sm sm:text-lg font-bold shrink-0">
                    {totalModule1} / {maxModule1}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Общая успеваемость по первому модулю
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pt-0">
                {/* Лабораторные работы */}
                {student.themes.lb.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                        Лабораторные работы
                      </h4>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {module1Points.lb} / {module1MaxPoints.lb}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      {student.themes.lb.map((lab) => (
                        <TaskListItem
                          key={lab.id}
                          title={lab.title}
                          points={lab.stud_points ?? null}
                          maxPoints={lab.max_points}
                          id={lab.id_answer_task}
                        />
                      ))}
                    </div>
                  </div>
                )}
  
                {/* Практические работы */}
                {student.themes.pr.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                        Практические работы
                      </h4>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {module1Points.pr} / {module1MaxPoints.pr}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      {student.themes.pr.map((practice) => (
                        <TaskListItem
                          key={practice.id}
                          title={practice.title}
                          points={practice.stud_points ?? null}
                          maxPoints={practice.max_points}
                          id={practice.id_answer_task}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Модульные тесты */}
                {student.themes.tests.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                        Модульные тесты
                      </h4>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {module1Points.tests} / {module1MaxPoints.tests}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      {student.themes.tests.map((test) => (
                        <TaskListItem
                          key={test.id}
                          title={test.title}
                          points={test.result}
                          maxPoints={test.max_points}
                          id={test.id_result}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
  
            {/* Модуль 2 (если есть СРС или другие задания) */}
            {(student.themes.srs.length > 0 || student.themes.other.length > 0) && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                    <span>Модуль 2</span>
                    <Badge variant="outline" className="text-sm sm:text-lg font-bold shrink-0">
                      {student.themes.srs.reduce((sum, item) => sum + (item.stud_points || 0), 0) +
                        student.themes.other.reduce((sum, item) => sum + (item.stud_points || 0), 0)} / {student.themes.srs.reduce((sum, item) => sum + item.max_points, 0) +
                        student.themes.other.reduce((sum, item) => sum + item.max_points, 0)}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Дополнительные задания и самостоятельная работа
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  {/* СРС */}
                  {student.themes.srs.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                          СРС
                        </h4>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {student.themes.srs.reduce((sum, item) => sum + (item.stud_points || 0), 0)} / {student.themes.srs.reduce((sum, item) => sum + item.max_points, 0)}
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {student.themes.srs.map((srs) => (
                          <TaskListItem
                            key={srs.id}
                            title={srs.title}
                            points={srs.stud_points ?? null}
                            maxPoints={srs.max_points}
                            id={srs.id_answer_task}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Прочее */}
                  {student.themes.other.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                          Прочее
                        </h4>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {student.themes.other.reduce((sum, item) => sum + (item.stud_points || 0), 0)} / {student.themes.other.reduce((sum, item) => sum + item.max_points, 0)}
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {student.themes.other.map((other) => (
                          <TaskListItem
                            key={other.id}
                            title={other.title}
                            points={other.stud_points ?? null}
                            maxPoints={other.max_points}
                            id={other.id_answer_task}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  export default StudentDetailDialog;