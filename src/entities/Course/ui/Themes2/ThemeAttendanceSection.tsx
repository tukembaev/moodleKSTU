import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, RefreshCw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LuUserCheck, LuUsers } from "react-icons/lu";
import { apiErrorDetail } from "entities/Course/lib/apiErrorDetail";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import {
  ThemeAttendanceStatusOption,
  ThemeAttendanceStudent,
} from "entities/Course/model/types/course";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Input } from "shared/shadcn/ui/input";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const ALL_GROUPS = "__all__";

const STATUS_TONE: Record<string, { active: string; idle: string }> = {
  present: {
    active: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-600",
    idle: "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40",
  },
  absent: {
    active: "bg-red-600 text-white border-red-600 hover:bg-red-600",
    idle: "text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
  },
  excused: {
    active: "bg-sky-600 text-white border-sky-600 hover:bg-sky-600",
    idle: "text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40",
  },
  late: {
    active: "bg-amber-500 text-white border-amber-500 hover:bg-amber-500",
    idle: "text-amber-800 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40",
  },
};

function apiStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

function studentInitials(fio: string) {
  const parts = fio.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function uniqueGroups(students: ThemeAttendanceStudent[]) {
  return [
    ...new Set(
      students
        .map((student) => student.group?.trim())
        .filter((group): group is string => Boolean(group))
    ),
  ].sort((a, b) => a.localeCompare(b, "ru"));
}

function AttendanceSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-9 w-full sm:max-w-[280px]" />
        <Skeleton className="h-9 w-full sm:w-40" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border px-3 py-3"
          >
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-56" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPicker({
  statuses,
  value,
  disabled,
  onSelect,
  onClear,
}: {
  statuses: ThemeAttendanceStatusOption[];
  value: string | null;
  disabled?: boolean;
  onSelect: (status: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <div
        role="group"
        aria-label="Статус посещаемости"
        className="inline-flex max-w-full flex-wrap rounded-lg border bg-muted/40 p-0.5"
      >
        {statuses.map((option) => {
          const active = value === option.value;
          const tone = STATUS_TONE[option.value];
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              title={option.label}
              onClick={() =>
                active ? onClear() : onSelect(option.value)
              }
              className={cn(
                "h-7 cursor-pointer rounded-md border border-transparent px-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? tone?.active ??
                    "bg-primary text-primary-foreground hover:bg-primary"
                  : tone?.idle ?? "text-muted-foreground hover:bg-background"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {value != null ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          aria-label="Сбросить отметку"
          title="Сбросить"
          onClick={onClear}
        >
          <X />
        </Button>
      ) : null}
    </div>
  );
}

export const ThemeAttendanceSection = ({ themeId }: { themeId: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [knownGroups, setKnownGroups] = useState<string[]>([]);
  const [pendingById, setPendingById] = useState<
    Record<number, string | null>
  >({});

  useEffect(() => {
    setSearchQuery("");
    setGroupFilter("");
    setKnownGroups([]);
    setPendingById({});
  }, [themeId]);

  const { data, isPending, isFetching, error, refetch } = useQuery({
    ...courseQueries.themeAttendance(themeId, groupFilter || null),
    refetchOnMount: "always",
  });
  const { mutate } = courseQueries.update_attendance();

  useEffect(() => {
    if (groupFilter || !data?.students) return;
    setKnownGroups(uniqueGroups(data.students));
  }, [data?.students, groupFilter]);

  const status = apiStatus(error);
  const statuses = data?.statuses ?? [];
  const students = data?.students ?? [];
  const markedCount = students.filter((student) => student.status != null).length;

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      student.fio.toLowerCase().includes(query)
    );
  }, [searchQuery, students]);

  const showGroupFilter = knownGroups.length > 1;
  const isRowPending = (studentId: number) =>
    Object.prototype.hasOwnProperty.call(pendingById, studentId);
  const displayedStatus = (student: ThemeAttendanceStudent) =>
    isRowPending(student.student_id)
      ? pendingById[student.student_id]
      : student.status;

  const saveStatus = (
    student: ThemeAttendanceStudent,
    nextStatus: string | null
  ) => {
    if (isRowPending(student.student_id)) return;
    const current = displayedStatus(student);
    if (current === nextStatus) return;

    setPendingById((currentMap) => ({
      ...currentMap,
      [student.student_id]: nextStatus,
    }));
    mutate(
      {
        themeId,
        data: { student_id: student.student_id, status: nextStatus },
      },
      {
        onSettled: () => {
          setPendingById((currentMap) => {
            const next = { ...currentMap };
            delete next[student.student_id];
            return next;
          });
        },
      }
    );
  };

  if (status === 403) return null;

  if (isPending && !data) {
    return <AttendanceSkeleton />;
  }

  if (status === 404) {
    return (
      <Empty className="h-full min-h-48 border-0">
        <EmptyHeader>
          <EmptyTitle>Тема не найдена</EmptyTitle>
          <EmptyDescription>
            Этой темы нет или она была удалена.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (error) {
    return (
      <Empty className="h-full min-h-48 border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LuUserCheck />
          </EmptyMedia>
          <EmptyTitle>Не удалось загрузить посещаемость</EmptyTitle>
          <EmptyDescription>
            {apiErrorDetail(error, "Попробуйте обновить список")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Повторить
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Поиск по ФИО..."
            className="pl-9"
            aria-label="Поиск по ФИО"
          />
        </div>
        {showGroupFilter ? (
          <Select
            value={groupFilter || ALL_GROUPS}
            onValueChange={(value) =>
              setGroupFilter(value === ALL_GROUPS ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Группа">
              <SelectValue placeholder="Все группы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_GROUPS}>Все группы</SelectItem>
              {knownGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <div className="flex items-center gap-2 sm:ml-auto">
          {students.length > 0 ? (
            <span className="text-xs text-muted-foreground">
              Отмечено {markedCount} из {students.length}
            </span>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Обновить список"
            title="Обновить"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw className={cn(isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {students.length === 0 ? (
        <Empty className="min-h-48 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuUsers />
            </EmptyMedia>
            <EmptyTitle>На курсе пока нет студентов</EmptyTitle>
            <EmptyDescription>
              {groupFilter
                ? "В этой группе пока нет студентов."
                : "Студенты появятся здесь после записи на курс."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filteredStudents.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Никого не найдено
        </p>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <ul className="space-y-2 pr-3">
            {filteredStudents.map((student) => {
              const pending = isRowPending(student.student_id);
              const statusValue = displayedStatus(student) ?? null;
              return (
                <li
                  key={student.student_id}
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
                    pending && "opacity-70"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs">
                        {studentInitials(student.fio)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {student.fio}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.group?.trim() || "Без группы"}
                        {statusValue == null ? " · не отмечен" : ""}
                      </p>
                    </div>
                    {pending ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                    ) : null}
                  </div>
                  <StatusPicker
                    statuses={statuses}
                    value={statusValue}
                    disabled={pending}
                    onSelect={(next) => saveStatus(student, next)}
                    onClear={() => saveStatus(student, null)}
                  />
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
};
