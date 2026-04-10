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
    

     console.log(student);
    // Модуль 1: первый модуль (если есть)
    const module1 = student.modules[0];
    const module1Points = {
      lb: module1?.thems.lb.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
      pr: module1?.thems.pr.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
      srs: module1?.thems.srs.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
      other: module1?.thems.other.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
    };
  
    const module1MaxPoints = {
      lb: module1?.thems.lb.reduce((sum, item) => sum + item.max_points, 0) || 0,
      pr: module1?.thems.pr.reduce((sum, item) => sum + item.max_points, 0) || 0,
      srs: module1?.thems.srs.reduce((sum, item) => sum + item.max_points, 0) || 0,
      other: module1?.thems.other.reduce((sum, item) => sum + item.max_points, 0) || 0,
    };
  
    const totalModule1 = module1Points.lb + module1Points.pr + module1Points.srs + module1Points.other;
    const maxModule1 = module1MaxPoints.lb + module1MaxPoints.pr + module1MaxPoints.srs + module1MaxPoints.other;

    // Модуль 2: второй модуль (если есть)
    const module2 = student.modules[1];
    const module2Points = {
      lb: module2?.thems.lb.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
      pr: module2?.thems.pr.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
      srs: module2?.thems.srs.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
      other: module2?.thems.other.reduce((sum, item) => sum + (item.stud_points || 0), 0) || 0,
    };
  
    const module2MaxPoints = {
      lb: module2?.thems.lb.reduce((sum, item) => sum + item.max_points, 0) || 0,
      pr: module2?.thems.pr.reduce((sum, item) => sum + item.max_points, 0) || 0,
      srs: module2?.thems.srs.reduce((sum, item) => sum + item.max_points, 0) || 0,
      other: module2?.thems.other.reduce((sum, item) => sum + item.max_points, 0) || 0,
    };
  
    const totalModule2 = module2Points.lb + module2Points.pr + module2Points.srs + module2Points.other;
    const maxModule2 = module2MaxPoints.lb + module2MaxPoints.pr + module2MaxPoints.srs + module2MaxPoints.other;
  
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
                <p className="text-xs sm:text-sm text-muted-foreground font-normal">{student.group || '—'}</p>
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
                {module1?.thems.lb && module1.thems.lb.length > 0 && (
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
                      {module1.thems.lb.map((lab) => (
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
                {module1?.thems.pr && module1.thems.pr.length > 0 && (
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
                      {module1.thems.pr.map((practice) => (
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

                {/* СРС */}
                {module1?.thems.srs && module1.thems.srs.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                        СРС
                      </h4>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {module1Points.srs} / {module1MaxPoints.srs}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      {module1.thems.srs.map((srs) => (
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
                {module1?.thems.other && module1.thems.other.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                        Прочее
                      </h4>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {module1Points.other} / {module1MaxPoints.other}
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      {module1.thems.other.map((other) => (
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
  
            {/* Модуль 2 (если есть второй модуль) */}
            {module2 && (totalModule2 > 0 || maxModule2 > 0) && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                    <span>Модуль 2</span>
                    <Badge variant="outline" className="text-sm sm:text-lg font-bold shrink-0">
                      {totalModule2} / {maxModule2}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {module2.title || 'Дополнительные задания и самостоятельная работа'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  {/* Лабораторные работы */}
                  {module2.thems.lb && module2.thems.lb.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                          Лабораторные работы
                        </h4>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {module2Points.lb} / {module2MaxPoints.lb}
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {module2.thems.lb.map((lab) => (
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
                  {module2.thems.pr && module2.thems.pr.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                          Практические работы
                        </h4>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {module2Points.pr} / {module2MaxPoints.pr}
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {module2.thems.pr.map((practice) => (
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

                  {/* СРС */}
                  {module2.thems.srs && module2.thems.srs.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                          СРС
                        </h4>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {module2Points.srs} / {module2MaxPoints.srs}
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {module2.thems.srs.map((srs) => (
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
                  {module2.thems.other && module2.thems.other.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase text-muted-foreground">
                          Прочее
                        </h4>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {module2Points.other} / {module2MaxPoints.other}
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        {module2.thems.other.map((other) => (
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

            {/* Дополнительные баллы */}
            {student.extra_points && student.extra_points.length > 0 && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                    <span>Дополнительные баллы</span>
                    <Badge variant="outline" className="text-sm sm:text-lg font-bold shrink-0">
                      {student.extra_points.reduce((sum, item) => sum + (item.points || 0), 0)}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Бонусные баллы за дополнительные активности
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-4 sm:p-6 pt-0">
                  {student.extra_points.map((extra) => (
                    <div key={extra.id} className="flex items-center justify-between py-2 px-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{extra.reason}</p>
                      </div>
                      <Badge variant="default" className="font-semibold text-xs">
                        +{extra.points}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  export default StudentDetailDialog;