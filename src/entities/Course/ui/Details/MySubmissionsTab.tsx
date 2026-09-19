import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import {
  MySubmissionItem,
  SubmissionStatus,
} from "entities/Course/model/types/course";
import { teacherCommentText } from "entities/Course/lib/teacherComment";
import { isGradableThemeType } from "features/Course/forms/add-theme/add-theme-constants";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { Badge } from "shared/shadcn/ui/badge";
import { Input } from "shared/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { LuClipboardList } from "react-icons/lu";

const STATUS_UI: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  submitted: {
    label: "Сдано",
    className: "border-transparent bg-green-600 text-white dark:bg-green-500",
  },
  not_submitted: {
    label: "Не сдано",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  overdue: {
    label: "Просрочено",
    className: "border-transparent bg-destructive text-white",
  },
};

function formatDateTimeOrDash(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
}

function isLateSubmission(item: MySubmissionItem) {
  return (
    item.status === "submitted" &&
    Boolean(item.deadline) &&
    Boolean(item.submitted_at) &&
    new Date(item.submitted_at as string) > new Date(item.deadline as string)
  );
}

function pointsLabel(item: MySubmissionItem) {
  if (item.points == null) {
    return item.status === "submitted" ? "На проверке" : "—";
  }
  return `${item.points}/${item.max_points}`;
}

function themeMeta(item: MySubmissionItem) {
  return [
    item.week != null ? `Неделя ${item.week}` : null,
    item.current_version != null && item.current_version > 1
      ? `версия ${item.current_version}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function apiStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

export const MySubmissionsTab = ({
  onOpenTheme,
}: {
  onOpenTheme: (themeId: string) => void;
}) => {
  const courseId = useCourseId();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState("all");

  const { data, isLoading, error } = useQuery(
    courseQueries.mySubmissions(courseId || null)
  );

  const status = apiStatus(error);

  useEffect(() => {
    if (status === 403) {
      navigate("/courses", { replace: true });
    }
  }, [status, navigate]);

  const results = (data?.results ?? []).filter((item) =>
    isGradableThemeType(item.type_less)
  );
  const extraPoints = data?.extra_points ?? [];
  const extraPointsTotal = extraPoints.reduce(
    (sum, item) => sum + (item.points || 0),
    0
  );

  const typeOptions = useMemo(() => {
    const unique = new Set<string>();
    results.forEach((item) => {
      if (item.type_less) unique.add(item.type_less);
    });
    return Array.from(unique);
  }, [results]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return results.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (typeFilter !== "all" && item.type_less !== typeFilter) return false;
      if (query && !item.title.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [results, search, statusFilter, typeFilter]);

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        <Skeleton className="h-9 w-full max-w-md" />
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="hover:bg-transparent">
                <TableHead>Тема</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Срок сдачи</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Балл</TableHead>
                <TableHead>Комментарий</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((__, cell) => (
                    <TableCell key={cell}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (status === 403) {
    return (
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Переходим к списку курсов...
      </p>
    );
  }

  if (status === 404) {
    return (
      <Empty className="mt-6 border-0">
        <EmptyHeader>
          <EmptyTitle>Курс не найден</EmptyTitle>
          <EmptyDescription>
            Этого курса нет или он был удалён.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (error) {
    return (
      <p className="mt-6 text-center text-sm text-destructive">
        Не удалось загрузить сдачи
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {extraPoints.length > 0 && (
        <div className="rounded-md border px-4 py-3">
          <p className="text-sm font-medium">
            Дополнительные баллы: {extraPointsTotal}
          </p>
          <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
            {extraPoints.map((item) => (
              <li key={item.id}>
                {item.reason || "Без указания причины"}: {item.points}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по теме..."
          className="sm:max-w-[280px]"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as SubmissionStatus | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="submitted">Сдано</SelectItem>
            <SelectItem value="not_submitted">Не сдано</SelectItem>
            <SelectItem value="overdue">Просрочено</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {results.length === 0 ? (
        <Empty className="min-h-48 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuClipboardList />
            </EmptyMedia>
            <EmptyTitle>Нет заданий для сдачи</EmptyTitle>
            <EmptyDescription>
              Когда преподаватель добавит темы с баллами, они появятся в этой таблице.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Нет тем по выбранным фильтрам
        </p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[180px]">Тема</TableHead>
                <TableHead className="min-w-[72px]">Тип</TableHead>
                <TableHead className="min-w-[140px]">Срок сдачи</TableHead>
                <TableHead className="min-w-[120px]">Статус</TableHead>
                <TableHead className="min-w-[110px]">Балл</TableHead>
                <TableHead className="min-w-[180px]">Комментарий</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const comment = teacherCommentText(item.comment);
                const late = isLateSubmission(item);
                const statusUi = STATUS_UI[item.status] ?? STATUS_UI.not_submitted;
                const meta = themeMeta(item);

                return (
                  <TableRow
                    key={item.theme_id}
                    className="cursor-pointer"
                    onClick={() => onOpenTheme(item.theme_id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpenTheme(item.theme_id);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                  >
                    <TableCell className="whitespace-normal">
                      <p className="font-medium">{item.title}</p>
                      {meta ? (
                        <p className="text-xs text-muted-foreground">{meta}</p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type_less || "—"}</Badge>
                    </TableCell>
                    <TableCell>{formatDateTimeOrDash(item.deadline)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <Badge className={statusUi.className}>
                          {statusUi.label}
                        </Badge>
                        {late ? (
                          <span className="text-[11px] text-muted-foreground">
                            с опозданием
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{pointsLabel(item)}</TableCell>
                    <TableCell className="max-w-[280px] whitespace-normal">
                      {comment ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
