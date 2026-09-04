import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "shared/shadcn/ui/dialog";
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
    
    // Подсчет баллов за все задания
    const totalPoints = student.themes.reduce((sum, theme) => sum + (theme.stud_points || 0), 0);
    const totalMaxPoints = student.themes.reduce((sum, theme) => sum + theme.max_points, 0);
  
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
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6" hideClose>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 sm:gap-3 justify-between">
              
               
              <div className="min-w-0 flex gap-2">
                 <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                <AvatarImage src={student.avatar || undefined} />
              </Avatar>
              
                <div className="flex flex-col">
                  <p className="text-base sm:text-lg truncate">{`${student.first_name} ${student.last_name}`}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal">{student.group || '—'}</p>
                </div>
                
              </div>
              
               <Badge variant="outline" className="text-sm sm:text-lg font-bold shrink-0">
                    {totalPoints} / {totalMaxPoints}
                  </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Детальная статистика успеваемости студента
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Все задания */}
            {student.themes && student.themes.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    {student.themes.map((theme) => (
                      <TaskListItem
                        key={theme.id}
                        title={theme.title}
                        points={theme.stud_points ?? null}
                        maxPoints={theme.max_points}
                        id={theme.id_answer_task}
                        deadline={theme.due_date || undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет доступных заданий
                  </p>
                )}
            {/* <Card>
              <CardHeader className="px-4 sm:p-6">
                <CardTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
                  <span>Задания курса</span>
                
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Общая успеваемость по всем заданиям
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pt-0">
                
              </CardContent>
            </Card> */}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  export default StudentDetailDialog;