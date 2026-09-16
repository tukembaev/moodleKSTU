import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { LuCheckCheck, LuDownload } from "react-icons/lu";
import { toast } from "sonner";
import { apiErrorDetailAsync } from "entities/Course/lib/apiErrorDetail";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { exportCoursePerformance } from "entities/Course/model/services/courseAPI";
import { useAuth } from "shared/hooks";
import { fallbackSpreadsheetFileName } from "shared/lib/downloadFile";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
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
import { studentAvatarSrc, studentInitials } from "./studentAvatar";

const CourseResultTable = () => {
  const id = useCourseId();
  const { id: userId } = useAuth();
  const [exportForbidden, setExportForbidden] = useState(false);
  const { data, isLoading } = useQuery(
    courseQueries.allStudentPerfomance(id as string)
  );
  const { data: courseModules } = useQuery(
    courseQueries.courseModules(id || "")
  );

  const canExport = useMemo(() => {
    if (!id || exportForbidden || !userId) return false;
    return (
      courseModules?.course_owner?.some(
        (owner) => Number(owner.user_id) === Number(userId)
      ) ?? false
    );
  }, [courseModules?.course_owner, exportForbidden, id, userId]);

  const exportMutation = useMutation({
    mutationFn: () =>
      exportCoursePerformance(
        id as string,
        fallbackSpreadsheetFileName(courseModules?.discipline_name)
      ),
    onError: async (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setExportForbidden(true);
      }
      toast.error(
        await apiErrorDetailAsync(error, "Не удалось экспортировать ведомость")
      );
    },
  });

  const exportButton = canExport ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full sm:w-auto"
      disabled={exportMutation.isPending}
      onClick={() => exportMutation.mutate()}
    >
      {exportMutation.isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <LuDownload />
      )}
      {exportMutation.isPending
        ? "Экспортируем..."
        : "Экспортировать в Excel"}
    </Button>
  ) : null;

  if (isLoading) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        {exportButton ? (
          <div className="flex justify-end">{exportButton}</div>
        ) : null}
        <div className="rounded-md border overflow-x-auto">
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
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {exportButton ? (
        <div className="flex justify-end">{exportButton}</div>
      ) : null}
      <div className="rounded-md border overflow-x-auto">
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
              const themesPoints = student.themes.reduce((sum, theme) => sum + (theme.stud_points || 0), 0);
              const themesMaxPoints = student.themes.reduce((sum, theme) => sum + theme.max_points, 0);

              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                        <AvatarImage
                          src={studentAvatarSrc(student)}
                          alt={`${student.first_name} ${student.last_name}`}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                          {studentInitials(student)}
                        </AvatarFallback>
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
    </div>
  );
};

export default CourseResultTable;
