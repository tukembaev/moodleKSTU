import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";

import { LuCheckCheck } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import StudentDetailDialog from "./StudentCourseDetail";

// Компонент для отображения детальной статистики студента


const CourseResultTable = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery(
    courseQueries.allStudentPerfomance(id as string)
  );

  if (isLoading) {
    return (
      <div className="rounded-md border mt-4 overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px] sm:w-[300px]">Имя студента</TableHead>
              <TableHead className="min-w-[80px] sm:w-[100px]">Группа</TableHead>
              <TableHead className="min-w-[120px] sm:w-[150px]">Модуль 1</TableHead>
              <TableHead className="min-w-[120px] sm:w-[150px]">Модуль 2</TableHead>
              <TableHead className="min-w-[80px] sm:w-[100px]">Баллы</TableHead>
              <TableHead className="min-w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0" />
                    <Skeleton className="h-4 sm:h-6 w-24 sm:w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 sm:h-6 w-16 sm:w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 sm:h-6 w-16 sm:w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 sm:h-6 w-16 sm:w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 sm:h-6 w-16 sm:w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4 overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[200px] sm:w-[300px]">Имя студента</TableHead>
            <TableHead className="min-w-[80px] sm:w-[100px]">Группа</TableHead>
            <TableHead className="min-w-[120px] sm:w-[150px]">Модуль 1</TableHead>
            <TableHead className="min-w-[120px] sm:w-[150px]">Модуль 2</TableHead>
            <TableHead className="min-w-[80px] sm:w-[100px]">Баллы</TableHead>
            <TableHead className="min-w-[60px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((student) => {
            // Модуль 1: первый модуль (если есть) - все типы заданий
            const module1 = student.modules[0];
            const module1Points = module1
              ? module1.thems.lb.reduce((sum, item) => sum + (item.stud_points || 0), 0) +
                module1.thems.pr.reduce((sum, item) => sum + (item.stud_points || 0), 0) +
                module1.thems.srs.reduce((sum, item) => sum + (item.stud_points || 0), 0) +
                module1.thems.other.reduce((sum, item) => sum + (item.stud_points || 0), 0)
              : 0;
            
            const module1MaxPoints = module1
              ? module1.thems.lb.reduce((sum, item) => sum + item.max_points, 0) +
                module1.thems.pr.reduce((sum, item) => sum + item.max_points, 0) +
                module1.thems.srs.reduce((sum, item) => sum + item.max_points, 0) +
                module1.thems.other.reduce((sum, item) => sum + item.max_points, 0)
              : 0;

            // Модуль 2: второй модуль (если есть) - все типы заданий
            const module2 = student.modules[1];
            const module2Points = module2
              ? module2.thems.lb.reduce((sum, item) => sum + (item.stud_points || 0), 0) +
                module2.thems.pr.reduce((sum, item) => sum + (item.stud_points || 0), 0) +
                module2.thems.srs.reduce((sum, item) => sum + (item.stud_points || 0), 0) +
                module2.thems.other.reduce((sum, item) => sum + (item.stud_points || 0), 0)
              : 0;
            
            const module2MaxPoints = module2
              ? module2.thems.lb.reduce((sum, item) => sum + item.max_points, 0) +
                module2.thems.pr.reduce((sum, item) => sum + item.max_points, 0) +
                module2.thems.srs.reduce((sum, item) => sum + item.max_points, 0) +
                module2.thems.other.reduce((sum, item) => sum + item.max_points, 0)
              : 0;

            // Дополнительные баллы
            const extraPoints = student.extra_points.reduce((sum, item) => sum + (item.points || 0), 0);

            const totalPoints = module1Points + module2Points + extraPoints;

            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                      <AvatarImage src={student.avatar} />
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base truncate">{`${student.first_name} ${student.last_name}`}</p>
                      {student.is_end && (
                        <Badge
                          variant="outline"
                          className="flex gap-1 px-1 sm:px-1.5 text-muted-foreground [&_svg]:size-3 w-fit mt-1 text-xs"
                        >
                          <LuCheckCheck className="text-green-500 dark:text-green-400" />
                          Сдано
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm sm:text-base">{student.group || '—'}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-semibold text-xs sm:text-sm">
                    {module1Points} / {module1MaxPoints}
                  </Badge>
                </TableCell>
                <TableCell>
                  {module2MaxPoints > 0 ? (
                    <Badge variant="secondary" className="font-semibold text-xs sm:text-sm">
                      {module2Points} / {module2MaxPoints}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs sm:text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className="font-semibold text-xs sm:text-sm">
                    {totalPoints} / {student.max_points_course}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <StudentDetailDialog student={student} />
                    {/* <UseTooltip text="Поставить итоговую оценку">
                      <Button
                        variant={"outline"}
                        size="sm"
                        onClick={() =>
                          openForm(FormQuery.END_COURSE, {
                            user_id: String(student.user_id),
                            points: String(totalPoints),
                          })
                        }
                      >
                        <LuSparkles />
                      </Button>
                    </UseTooltip> */}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseResultTable;
