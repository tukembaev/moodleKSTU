import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState, useMemo } from "react";
import {
  LuArchive,
  LuSearch,
  LuChevronRight,
  LuHistory,
  LuFolderCheck,
  LuUser,
  LuBook,
  LuFilter,
} from "react-icons/lu";
import { Input } from "shared/shadcn/ui/input";
import { Button } from "shared/shadcn/ui/button";
import { Badge } from "shared/shadcn/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { cn } from "shared/lib/utils";
import {
  Remark,
  StudentRemarkSummary,
} from "entities/Remarks/model/types/remarks";
import RemarkChat from "./RemarkChat";

interface ArchiveSectionProps {
  archivedRemarks: Remark[];
  studentSummaries?: StudentRemarkSummary[];
  currentUserId: number;
  currentUserRole: "teacher" | "student";
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

const ArchiveSection = ({
  archivedRemarks,
  studentSummaries,
  currentUserId,
  currentUserRole,
  className,
}: ArchiveSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRemarkSummary | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedRemark, setSelectedRemark] = useState<Remark | null>(null);

  // Group archived remarks by course
  const remarksByCourse = useMemo(() => {
    const grouped: Record<string, { courseName: string; remarks: Remark[] }> = {};
    
    const remarksToProcess = selectedStudent
      ? archivedRemarks.filter((r) => r.student_id === selectedStudent.student_id)
      : archivedRemarks;

    remarksToProcess.forEach((remark) => {
      if (!grouped[remark.course_id]) {
        grouped[remark.course_id] = {
          courseName: remark.course_name,
          remarks: [],
        };
      }
      grouped[remark.course_id].remarks.push(remark);
    });

    return Object.entries(grouped).map(([courseId, data]) => ({
      courseId,
      ...data,
    }));
  }, [archivedRemarks, selectedStudent]);

  // Get unique courses for filter
  const uniqueCourses = useMemo(() => {
    const courses = new Map<string, string>();
    archivedRemarks.forEach((r) => courses.set(r.course_id, r.course_name));
    return Array.from(courses.entries()).map(([id, name]) => ({ id, name }));
  }, [archivedRemarks]);

  // Filter archived remarks for student view
  const filteredStudentRemarks = useMemo(() => {
    if (currentUserRole !== "student") return [];
    
    return archivedRemarks.filter((remark) => {
      const matchesSearch =
        !searchQuery ||
        remark.theme_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remark.course_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse =
        selectedCourse === "all" || remark.course_id === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [archivedRemarks, searchQuery, selectedCourse, currentUserRole]);

  // Filter students for teacher view
  const filteredStudents = useMemo(() => {
    if (!studentSummaries) return [];
    return studentSummaries.filter((student) =>
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [studentSummaries, searchQuery]);

  if (selectedRemark) {
    return (
      <div className={cn("space-y-4", className)}>
        <Button
          variant="ghost"
          onClick={() => setSelectedRemark(null)}
          className="gap-2"
        >
          ← Назад к архиву
        </Button>
        <RemarkChat
          remark={selectedRemark}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          isExpanded={true}
        />
      </div>
    );
  }

  // Teacher view - list of students
  if (currentUserRole === "teacher") {
    if (selectedStudent) {
      return (
        <div className={cn("space-y-4", className)}>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setSelectedStudent(null)}
              className="gap-2"
            >
              ← Назад к студентам
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedStudent.student_avatar} />
                <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white text-xs">
                  {getInitials(selectedStudent.student_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{selectedStudent.student_name}</p>
                <p className="text-xs text-muted-foreground">{selectedStudent.student_group}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-320px)]">
            <Accordion type="multiple" className="space-y-3">
              {remarksByCourse.map((course) => (
                <AccordionItem
                  key={course.courseId}
                  value={course.courseId}
                  className="border rounded-xl overflow-hidden bg-card"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <LuBook className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{course.courseName}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.remarks.length} замечаний в архиве
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {course.remarks.map((remark) => (
                        <Card
                          key={remark.id}
                          className="cursor-pointer hover:bg-muted/30 transition-colors border-l-4 border-l-emerald-500"
                          onClick={() => setSelectedRemark(remark)}
                        >
                          <CardContent className="flex items-center justify-between py-3 px-4">
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {remark.theme_title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Одобрено{" "}
                                {remark.archived_at &&
                                  format(remark.archived_at, "d MMMM yyyy", {
                                    locale: ru,
                                  })}
                              </p>
                            </div>
                            <LuChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      );
    }

    return (
      <div className={cn("space-y-4", className)}>
        {/* Search */}
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по студентам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Students list */}
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-2xl bg-muted/50 mb-4">
              <LuArchive className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Архив пуст</h3>
            <p className="text-muted-foreground text-sm">
              Здесь будут отображаться одобренные замечания по студентам
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const studentArchivedCount = archivedRemarks.filter(
                  (r) => r.student_id === student.student_id
                ).length;

                if (studentArchivedCount === 0) return null;

                return (
                  <Card
                    key={student.student_id}
                    className="cursor-pointer hover:bg-muted/30 hover:shadow-md transition-all group"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <CardContent className="flex items-center gap-4 py-4 px-4">
                      <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                        <AvatarImage src={student.student_avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                          {getInitials(student.student_name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">
                            {student.student_name}
                          </p>
                          <Badge variant="outline">{student.student_group}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <LuFolderCheck className="h-3 w-3" />
                            {studentArchivedCount} в архиве
                          </span>
                          <span className="flex items-center gap-1">
                            <LuBook className="h-3 w-3" />
                            {student.courses.length} предметов
                          </span>
                        </div>
                      </div>

                      <LuChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    );
  }

  // Student view - feed of archived remarks
  return (
    <div className={cn("space-y-4", className)}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск замечаний..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <LuFilter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Все предметы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все предметы</SelectItem>
            {uniqueCourses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Archived remarks feed */}
      {filteredStudentRemarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-2xl bg-muted/50 mb-4">
            <LuHistory className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Архив пуст</h3>
          <p className="text-muted-foreground text-sm">
            Здесь будут отображаться ваши исправленные замечания
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-3 pr-4">
            {filteredStudentRemarks.map((remark) => (
              <Card
                key={remark.id}
                className="cursor-pointer hover:bg-muted/30 hover:shadow-md transition-all border-l-4 border-l-emerald-500 group"
                onClick={() => setSelectedRemark(remark)}
              >
                <CardContent className="py-4 px-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                          <LuFolderCheck className="h-3 w-3" />
                          Одобрено
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm truncate">
                        {remark.theme_title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {remark.course_name}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <LuUser className="h-3 w-3" />
                          {remark.teacher_name.split(" ").slice(0, 2).join(" ")}
                        </span>
                        <span>
                          {remark.archived_at &&
                            format(remark.archived_at, "d MMMM yyyy", {
                              locale: ru,
                            })}
                        </span>
                      </div>
                    </div>
                    <LuChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ArchiveSection;
