import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { StudentsAnswers } from "entities/Course/model/types/course";
import { Remark, RemarkStatus, remarksQueries } from "entities/Remarks";
import { SetComment } from "features/Course/hooks/SetComment";
import { SetMark } from "features/Course/hooks/SetMark";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  LuCheckCheck,
  LuEllipsisVertical,
  LuFile,
  LuKeyRound,
  LuLaugh,
  LuLock,
  LuMeh,
  LuMessageCircleWarning,
  LuMessageSquare,
  LuThumbsUp,
  LuTrash2,
  LuUsers,
  LuX
} from "react-icons/lu";
import { SpringPopupList, UseConfirmationDialog, UseTooltip } from "shared/components";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "shared/shadcn/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Input } from "shared/shadcn/ui/input";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import { AnswerFileAttachment } from "./AnswerFileAttachment";

type RemarksUiStatus = "none" | "pending" | "responded";

const getRemarksUiStatus = (
  student: StudentsAnswers,
  remarks: Remark[]
): RemarksUiStatus => {
  const openRemarks = remarks.filter(
    (remark) =>
      Number(remark.student_id) === Number(student.user_id) &&
      String(remark.status).toLowerCase() !== RemarkStatus.APPROVED
  );

  if (openRemarks.length > 0) {
    const awaitingTeacher = openRemarks.some((remark) => {
      const status = String(remark.status).toLowerCase();
      if (status === RemarkStatus.RESPONDED || status === "student_replied") {
        return true;
      }
      const messages = remark.messages ?? [];
      const lastMessage = messages[messages.length - 1];
      return String(lastMessage?.sender_role ?? "").toLowerCase() === "student";
    });
    return awaitingTeacher ? "responded" : "pending";
  }

  if ((student.responded_remarks ?? 0) > 0) return "responded";
  if ((student.pending_remarks ?? 0) > 0) return "pending";
  return "none";
};

const StudentRemarksBadge = ({
  status,
  student,
  theme_id,
  compact = false,
}: {
  status: RemarksUiStatus;
  student: StudentsAnswers;
  theme_id?: string | null;
  compact?: boolean;
}) => {
  const title =
    status === "responded"
      ? "Проверить ответ студента"
      : status === "pending"
        ? "Замечания по работе"
        : "Добавить замечание";

  return (
    <SetComment
      text={title}
      id={student.id}
      theme_id={theme_id}
      student_id={student.user_id}
    >
      <Badge
        variant="outline"
        className={`gap-1 text-xs cursor-pointer ${
          compact ? "" : "flex px-1.5 text-muted-foreground [&_svg]:size-3"
        } ${
          status === "responded"
            ? "bg-blue-50 text-blue-700 border-blue-300 shadow-sm dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700"
            : status === "pending"
              ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800"
              : compact
                ? ""
                : ""
        }`}
      >
        {status === "responded" ? (
          <>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <LuMessageSquare className="text-blue-600 dark:text-blue-400" />
            {compact ? "Ответил" : "Студент ответил"}
          </>
        ) : status === "pending" ? (
          <>
            <LuMeh className="text-orange-500 dark:text-orange-400" />
            {compact ? "Замечание" : "Есть замечания"}
          </>
        ) : (
          <>
            <LuLaugh className="text-green-500 dark:text-green-400" />
            {compact ? "Ок" : "Замечаний нет"}
          </>
        )}
      </Badge>
    </SetComment>
  );
};

const RemoveStudentFromCourseMenu = ({
  student,
  courseId,
  isPending,
  onRemove,
}: {
  student: StudentsAnswers;
  courseId: string;
  isPending: boolean;
  onRemove: (student: StudentsAnswers) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          disabled={isPending || !courseId}
          onClick={(event) => event.stopPropagation()}
        >
          <LuEllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        <UseConfirmationDialog
          title="Удалить студента с курса?"
          description={`${student.fullname} будет исключён из курса. Это действие нельзя отменить.`}
          onConfirm={() => onRemove(student)}
          trigger={
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending || !courseId}
              onSelect={(event) => event.preventDefault()}
            >
              <LuTrash2 />
              Удалить из курса
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListOfStudentsWithAnswers = ({
  data,
  isLoading,
  error,
  refetch,
  theme_id,
}: {
  data: StudentsAnswers[];
  isLoading?: boolean;
  refetch: () => void;
  error?: Error | null;
  theme_id?: string | null;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    "Все группы"
  );
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
    new Set()
  );
  const fallbackCourseId = useCourseId();

  const toggleExpand = (studentId: string) => {
    setExpandedId(expandedId === studentId ? null : studentId);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const toggleSelectAll = () => {
    const visibleStudentIds = filteredData.map((s) => s.user_id);
    const allVisibleSelected =
      visibleStudentIds.length > 0 &&
      visibleStudentIds.every((id) => selectedStudents.has(id));

    if (allVisibleSelected) {
      setSelectedStudents((prev) => {
        const newSet = new Set(prev);
        visibleStudentIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    } else {
      setSelectedStudents((prev) => {
        const newSet = new Set(prev);
        visibleStudentIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  };

  const uniqueGroups = [
    "Все группы",
    ...new Set(data.map((student) => student.group)),
  ];
  const uniqueData: StudentsAnswers[] = useMemo(() => {
    const map = new Map();
    data.forEach((s) => {
      if (!map.has(s.user_id)) map.set(s.user_id, s);
    });
    return [...map.values()];
  }, [data]);

  const { data: themeRemarks = [] } = useQuery({
    ...remarksQueries.byTheme(theme_id ?? null),
    enabled: !!theme_id,
  });

  const filteredData = uniqueData.filter(
    (student) =>
      student.fullname.toLowerCase().includes(searchQuery) &&
      (selectedGroup === "" ||
        selectedGroup === "Все группы" ||
        student.group === selectedGroup)
  );
  
  const { mutate: change_permission } = courseQueries.edit_permission();
  const { mutate: setAccessForAll, isPending: isAccessPending } =
    courseQueries.set_theme_access_for_all();
  const { mutate: removeStudent, isPending: isRemovePending } =
    courseQueries.remove_student();

  const handlePermission = (student: StudentsAnswers) => {
    change_permission({
      id: student.task,
      data: {
        locked: !student.locked,
        users: [student.user_id],
      },
    });
  };

  const handleMultiplePermission = (lock: boolean) => {
    change_permission({
      id: filteredData[0]?.task,
      data: {
        locked: lock,
        users: [...selectedStudents],
      },
    });
  };

  const handleAccessForAll = (locked: boolean) => {
    const taskId = theme_id || uniqueData[0]?.task;
    if (!taskId) return;
    setAccessForAll({
      id: taskId,
      locked,
      users: uniqueData.map((student) => student.user_id),
    });
  };

  const handleRemoveStudent = (student: StudentsAnswers) => {
    const courseId = String(student.course_id || fallbackCourseId || "");
    if (!courseId || !student.user_id) return;
    removeStudent({
      courseId,
      studentId: student.user_id,
    });
  };

  const studentCourseId = (student: StudentsAnswers) =>
    String(student.course_id || fallbackCourseId || "");

  // Render card skeleton for loading state (mobile/tablet)
  const renderCardSkeleton = () => (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render student cards for mobile/tablet
  const renderStudentCards = () => (
    <div className="space-y-3">
      {filteredData.length === 0 ? (
        <Empty className="min-h-48 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuUsers />
            </EmptyMedia>
            <EmptyTitle>Студенты не найдены</EmptyTitle>
            <EmptyDescription>
              Измените поиск или выбранную группу.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <SpringPopupList>
          {filteredData.map((student) => {
            const hasUnreadFiles = student.files.some((file) => !file.is_read.is_read);
            const isExpanded = expandedId === student.id;
            const remarksStatus = getRemarksUiStatus(student, themeRemarks);
            
            return (
              <Collapsible
                key={student.user_id}
                open={isExpanded}
                onOpenChange={() => toggleExpand(student.id)}
              >
                <Card className={`overflow-hidden transition-all duration-300 ${
                  isExpanded
                    ? "ring-2 ring-primary/20 shadow-md"
                    : remarksStatus === "responded"
                      ? "ring-2 ring-blue-300/80 shadow-sm dark:ring-blue-700/60"
                      : "hover:shadow-sm"
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      {/* Student info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {student.fullname.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{student.fullname}</p>
                            {hasUnreadFiles ? (
                              <UseTooltip text="Есть непрочитанные файлы">
                                <Badge className="gap-1 bg-orange-50 text-orange-600 border-orange-200 text-xs px-1.5 py-0 shrink-0 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800">
                                  <LuMessageCircleWarning className="h-3 w-3" />
                                  Новое
                                </Badge>
                              </UseTooltip>
                            ) : (
                              <UseTooltip text="Все файлы просмотрены">
                                <LuCheckCheck className="h-4 w-4 text-blue-500 shrink-0" />
                              </UseTooltip>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{student.group}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <RemoveStudentFromCourseMenu
                          student={student}
                          courseId={studentCourseId(student)}
                          isPending={isRemovePending}
                          onRemove={handleRemoveStudent}
                        />
                        {student.files.length > 0 && (
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </div>
                    </div>
                    
                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Submission status */}
                      <SetMark
                        text="Выставить баллы"
                        points={student.points}
                        max_points={student.max_points}
                        id={student.id}
                      >
                        <Badge
                          variant="outline"
                          className={`gap-1 text-xs cursor-pointer ${
                            student.status 
                              ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800" 
                              : ""
                          }`}
                        >
                          {student.status ? (
                            <>
                              <LuThumbsUp className="h-3 w-3" />
                              Сдано на {student.points}
                            </>
                          ) : (
                            <>
                              <LuX className="h-3 w-3" />
                              Не сдано
                            </>
                          )}
                        </Badge>
                      </SetMark>
                      
                      {/* Access status */}
                      <UseTooltip text={student.locked ? "Открыть доступ" : "Закрыть доступ"}>
                        <Badge
                          variant="outline"
                          className={`gap-1 text-xs cursor-pointer ${
                            student.locked
                              ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
                              : "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                          }`}
                          onClick={() => handlePermission(student)}
                        >
                          {student.locked ? (
                            <>
                              <LuLock className="h-3 w-3" />
                              Закрыт
                            </>
                          ) : (
                            <>
                              <LuKeyRound className="h-3 w-3" />
                              Открыт
                            </>
                          )}
                        </Badge>
                      </UseTooltip>
                      
                      <StudentRemarksBadge
                        status={remarksStatus}
                        student={student}
                        theme_id={theme_id}
                        compact
                      />
                    </div>
                  </CardHeader>
                  
                  {/* Files section */}
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-3">
                      <div className="pt-3 border-t border-border/50 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <LuFile className="h-3.5 w-3.5" />
                          Файлы ({student.files.length})
                        </p>
                        <div className="flex flex-col gap-2">
                          {student.files.map((item) => (
                            <AnswerFileAttachment
                              key={item.id}
                              file={item}
                              markAsReadOnOpen
                              onRead={refetch}
                              className="w-full max-w-full"
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </SpringPopupList>
      )}
    </div>
  );

  // Render table skeleton for loading state (desktop)
  const renderTableSkeleton = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Skeleton className="h-4 w-4 rounded-sm" />
            </TableHead>
            <TableHead className="w-[300px]">Имя студента</TableHead>
            <TableHead className="w-[100px]">Баллы</TableHead>
            <TableHead>Статус сдачи</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index} className="py-2">
              <TableCell>
                <Skeleton className="h-4 w-4 rounded-sm" />
              </TableCell>
              <TableCell className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-25" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Render table for desktop
  const renderTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                checked={
                  filteredData.length > 0 &&
                  filteredData.every((student) =>
                    selectedStudents.has(student.user_id)
                  )
                }
                onCheckedChange={toggleSelectAll}
                className="cursor-pointer"
                disabled={filteredData.length === 0}
              />
            </TableHead>
            <TableHead className="w-[150px]">Студент</TableHead>
            <TableHead className="w-[130px]">Статус сдачи</TableHead>
            <TableHead className="w-[130px]">Доступ</TableHead>
            <TableHead className="w-[130px]">Замечания</TableHead>


            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((student) => {
            const remarksStatus = getRemarksUiStatus(student, themeRemarks);
            return (
            <React.Fragment key={student.user_id}>
              <TableRow
                className={`${expandedId === student.id ? "border-b-0" : ""} ${
                  remarksStatus === "responded"
                    ? "bg-blue-50/70 dark:bg-blue-950/20"
                    : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.has(student.user_id)}
                    onCheckedChange={() => {
                      setSelectedStudents((prev) => {
                        const newSet = new Set(prev);
                        if (newSet.has(student.user_id)) {
                          newSet.delete(student.user_id);
                        } else {
                          newSet.add(student.user_id);
                        }
                        return newSet;
                      });
                    }}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={student.avatar} />
                    </Avatar>

                    <p>{student.fullname}</p>
                    {/* <Badge className="bg-primary/5 text-primary shadow-none text-xs">
                      {student.group}
                    </Badge> */}
                  </div>

                  {student.files.some((file) => !file.is_read.is_read) ? (
                    <UseTooltip text="Новый не просмотренный файл!">
                      <LuMessageCircleWarning className="text-orange-500" />
                    </UseTooltip>
                  ) : (
                    <UseTooltip text="Все файлы просмотренны">
                      <LuCheckCheck className="text-blue-500" />
                    </UseTooltip>
                  )}
                </TableCell>
                <TableCell>
                  
                    <SetMark
                      text="Выставить баллы"
                      points={student.points}
                      max_points={student.max_points}
                      id={student.id}
                    >
                      <Badge
                        variant="outline"
                        className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 cursor-pointer"
                      >
                        {student.status ? (
                          <LuThumbsUp className="text-green-500 dark:text-green-400" />
                        ) : (
                          <LuX />
                        )}
                        {student.status
                          ? `Сдано на ${student.points}`
                          : "Не сдано"}
                      </Badge>
                    </SetMark>
                  
                </TableCell>
                <TableCell>
                  <UseTooltip
                    text={
                      student.locked ? "Открыть доступ" : "Закрыть доступ"
                    }
                  >
                    
                      <Badge
                        variant="outline"
                        className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                        onClick={() => handlePermission(student)}
                      >
                        {student.locked ? (
                          <LuLock />
                        ) : (
                          <LuKeyRound className="text-green-500 dark:text-green-400" />
                        )}
                        {student.locked ? "Доступ запрещен" : "Доступ открыт"}
                      </Badge>
                    
                  </UseTooltip>
                </TableCell>
                <TableCell>
                  <StudentRemarksBadge
                    status={remarksStatus}
                    student={student}
                    theme_id={theme_id}
                  />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <RemoveStudentFromCourseMenu
                      student={student}
                      courseId={studentCourseId(student)}
                      isPending={isRemovePending}
                      onRemove={handleRemoveStudent}
                    />
                    {student.files.length > 0 && (
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center cursor-pointer"
                        onClick={() => toggleExpand(student.id)}
                      >
                        {expandedId === student.id ? (
                          <ChevronDown strokeWidth={1} />
                        ) : (
                          <ChevronRight strokeWidth={1} />
                        )}
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>

              {expandedId === student.id && student.files.length > 0 && (
                <TableRow
                  key={`expanded-${student.id}`}
                  className="hover:bg-transparent"
                >
                  <TableCell />
                  <TableCell colSpan={5} className="pt-0 pb-3">
                    <div className="flex flex-wrap gap-2 py-1">
                      {student.files.map((item) => (
                        <AnswerFileAttachment
                          key={item.id}
                          file={item}
                          markAsReadOnOpen
                          onRead={refetch}
                          className="min-w-[240px] flex-1 max-w-md"
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  if (isLoading) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className="block lg:hidden">
          {renderCardSkeleton()}
        </div>
        {/* Desktop skeleton */}
        <div className="hidden lg:block">
          {renderTableSkeleton()}
        </div>
      </>
    );
  }

  if (error) {
    return <p className="text-center">{error.message}</p>;
  }

  if (!data.length) {
    return (
      <Empty className="h-full min-h-48 border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LuUsers />
          </EmptyMedia>
          <EmptyTitle>Пока нет студентов</EmptyTitle>
          <EmptyDescription>
            Студенты появятся здесь после записи на курс.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input
            type="text"
            placeholder="Поиск по имени..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-full sm:max-w-[350px]"
          />
          <div className="hidden lg:flex gap-2">
            <Button
              onClick={() => handleAccessForAll(true)}
              variant="outline"
              size="sm"
              disabled={isAccessPending}
            >
              <LuLock className="text-red-400" />
              Закрыть доступ всем
            </Button>
            <Button
              onClick={() => handleAccessForAll(false)}
              variant="outline"
              size="sm"
              disabled={isAccessPending}
            >
              <LuKeyRound className="text-green-400" />
              Открыть всем
            </Button>
            {selectedStudents.size > 0 &&
              selectedStudents.size !== uniqueData.length && (
                <>
                  <Button
                    onClick={() => handleMultiplePermission(true)}
                    variant="outline"
                    size="sm"
                    disabled={isAccessPending}
                  >
                    <LuLock className="text-red-400" />
                    Закрыть выбранным
                  </Button>
                  <Button
                    onClick={() => handleMultiplePermission(false)}
                    variant="outline"
                    size="sm"
                    disabled={isAccessPending}
                  >
                    <LuKeyRound className="text-green-400" />
                    Открыть выбранным
                  </Button>
                </>
              )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              {selectedGroup || "Все группы"} <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {uniqueGroups.map((group) => (
              <DropdownMenuItem
                key={group}
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile and Tablet view (cards) */}
      <div className="block lg:hidden">
        {renderStudentCards()}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden lg:block">
        {renderTable()}
      </div>
    </div>
  );
};

export default ListOfStudentsWithAnswers;
