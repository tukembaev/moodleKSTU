import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";

import { LuCheckCheck } from "react-icons/lu";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
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
  const id = useCourseId();
  const { data, isLoading } = useQuery(
    courseQueries.allStudentPerfomance(id as string)
  );
  console.log(data)
  if (isLoading) {
    return (
      <div className="rounded-md border mt-4 overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px] sm:w-[300px]">Имя студента</TableHead>
              <TableHead className="min-w-[80px] sm:w-[100px]">Группа</TableHead>
              <TableHead className="min-w-[120px] sm:w-[150px]">Баллы за задания</TableHead>
              <TableHead className="min-w-[80px] sm:w-[100px]">Итого</TableHead>
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
            <TableHead className="min-w-[120px] sm:w-[150px]">Баллы за задания</TableHead>
            <TableHead className="min-w-[80px] sm:w-[100px]">Итого</TableHead>
            <TableHead className="min-w-[60px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((student) => {
            // Подсчет баллов за задания
            const themesPoints = student.themes.reduce((sum, theme) => sum + (theme.stud_points || 0), 0);
            const themesMaxPoints = student.themes.reduce((sum, theme) => sum + theme.max_points, 0);

            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                      <AvatarImage src={student.avatar || undefined} />
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
                    {themesPoints} / {themesMaxPoints}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="font-semibold text-xs sm:text-sm">
                    {themesPoints} / {student.max_points_course}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <StudentDetailDialog student={student} />
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
