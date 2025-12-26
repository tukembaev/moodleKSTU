import { useMemo } from "react";
import {
  LuUsers,
  LuCircleAlert,
  LuMessageSquare,
  LuClock,
  LuChevronRight,
  LuBook,
} from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { cn } from "shared/lib/utils";
import {
  Remark,
  RemarkStatus,
  StudentRemarkSummary,
} from "entities/Remarks/model/types/remarks";

interface StudentListProps {
  students: StudentRemarkSummary[];
  remarks: Remark[];
  onSelectStudent: (student: StudentRemarkSummary) => void;
  selectedStudentId?: number;
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const StudentList = ({
  students,
  remarks,
  onSelectStudent,
  selectedStudentId,
  className,
}: StudentListProps) => {
  // Calculate stats for each student
  const studentsWithStats = useMemo(() => {
    return students.map((student) => {
      const studentRemarks = remarks.filter(
        (r) => r.student_id === student.student_id
      );
      
      return {
        ...student,
        pendingCount: studentRemarks.filter(
          (r) => r.status === RemarkStatus.PENDING
        ).length,
        respondedCount: studentRemarks.filter(
          (r) => r.status === RemarkStatus.RESPONDED
        ).length,
        rejectedCount: studentRemarks.filter(
          (r) => r.status === RemarkStatus.REJECTED
        ).length,
        totalActive: studentRemarks.filter(
          (r) => r.status !== RemarkStatus.APPROVED
        ).length,
        hasUrgent: studentRemarks.some(
          (r) => r.status === RemarkStatus.RESPONDED
        ),
      };
    }).sort((a, b) => {
      // Sort by responded first (need teacher attention), then by total active
      if (a.hasUrgent && !b.hasUrgent) return -1;
      if (!a.hasUrgent && b.hasUrgent) return 1;
      return b.totalActive - a.totalActive;
    });
  }, [students, remarks]);

  if (students.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <div className="p-4 rounded-2xl bg-muted/50 mb-4">
          <LuUsers className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Нет студентов с замечаниями</h3>
        <p className="text-muted-foreground text-sm">
          Замечания появятся здесь после проверки работ
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-[calc(100vh-280px)]", className)}>
      <div className="space-y-2 pr-4">
        {studentsWithStats.map((student) => (
          <Card
            key={student.student_id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg group",
              selectedStudentId === student.student_id
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:bg-muted/30",
              student.hasUrgent && "border-l-4 border-l-blue-500"
            )}
            onClick={() => onSelectStudent(student)}
          >
            <CardContent className="flex items-center gap-4 py-4 px-4">
              {/* Avatar with notification indicator */}
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                  <AvatarImage src={student.student_avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                    {getInitials(student.student_name)}
                  </AvatarFallback>
                </Avatar>
                {student.hasUrgent && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500" />
                  </span>
                )}
              </div>

              {/* Student info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold truncate">{student.student_name}</p>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {student.student_group}
                  </Badge>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {student.respondedCount > 0 && (
                    <Badge className="gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
                      <LuMessageSquare className="h-3 w-3" />
                      {student.respondedCount} на проверке
                    </Badge>
                  )}
                  {student.pendingCount > 0 && (
                    <Badge className="gap-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
                      <LuClock className="h-3 w-3" />
                      {student.pendingCount} ожидает
                    </Badge>
                  )}
                  {student.rejectedCount > 0 && (
                    <Badge className="gap-1 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800">
                      <LuCircleAlert className="h-3 w-3" />
                      {student.rejectedCount} на исправлении
                    </Badge>
                  )}
                </div>

                {/* Courses */}
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <LuBook className="h-3 w-3" />
                  <span className="truncate">
                    {student.courses.map((c: { course_id: string; course_name: string }) => c.course_name).join(", ")}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                  <LuChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {student.totalActive}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default StudentList;
