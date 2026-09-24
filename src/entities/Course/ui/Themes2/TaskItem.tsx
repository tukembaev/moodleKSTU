import { format, isValid, type Locale } from "date-fns";
import { TeacherGradeComment } from "entities/Course/lib/teacherComment";
import {
  studentCanContinueTest,
  studentCanTakeTest,
} from "entities/Test/model/types/test";
import {
  CheckCircle2,
  Circle,
  Clock,
  Infinity as InfinityIcon,
  Lock,
  LockOpen,
  MoreVertical,
  Pencil,
  Trash2,
  XCircle
} from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { UseConfirmationDialog } from "shared/components";
import { getDateLocale } from "shared/config/i18n/dateLocale";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

type ScheduleValue = string | number | null | undefined;

const parseScheduleDate = (value: ScheduleValue): Date | null => {
  if (value == null || value === "") return null;

  if (typeof value === "number" || /^\d+$/.test(String(value).trim())) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return null;
    const date = new Date(numeric < 1e12 ? numeric * 1000 : numeric);
    return isValid(date) ? date : null;
  }

  const date = new Date(value);
  return isValid(date) ? date : null;
};

const formatScheduleDay = (date: Date, locale: Locale) =>
  format(date, "d MMM yyyy", { locale }).replace(".", "");

const ThemeScheduleLine = ({
  openDate,
  deadline,
}: {
  openDate?: ScheduleValue;
  deadline?: ScheduleValue;
}) => {
  const { t, i18n } = useTranslation();
  const locale = getDateLocale(i18n.language);
  const open = parseScheduleDate(openDate);
  const due = parseScheduleDate(deadline);

  if (!open && !due) {
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <InfinityIcon className="size-3.5 shrink-0" />
        {t("Открыт всегда")}
      </p>
    );
  }
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
      {open && (
        <span className="inline-flex min-w-0 items-center gap-1">
          <span className="whitespace-normal">
            {t("с {{from}} по {{to}}", {
              from: formatScheduleDay(open, locale),
              to: due ? formatScheduleDay(due, locale) : t("сегодня"),
            })}
          </span>
        </span>
      )}
    </p>
  );
};

interface TaskItemProps {
  id: string;
  title: string;
  week: string;
  result: string;
  maxPoints: number;
  status: boolean;
  locked: boolean;
  isStudent: boolean;
  deadline?: string | number | null;
  openDate?: string | number | null;
  activeRemarksCount?: number;
  onClick?: () => void;
  isActive?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isTest?: boolean;
  isOpen?: boolean | null;
  passed?: boolean | null;
  comment?: string | null;
  needsReview?: boolean | null;
  canReceivePoints?: boolean;
}

export const TaskItem: FC<TaskItemProps> = ({
  id,
  title,
  week,
  result,
  maxPoints,
  locked,
  isStudent,
  deadline,
  openDate,
  onClick,
  isActive = false,
  onEdit,
  onDelete,
  isTest = false,
  isOpen,
  passed = null,
  comment,
  needsReview = null,
  canReceivePoints = true,
}) => {
  const { t } = useTranslation();
  const showTeacherActions = !isStudent && !isTest && (onEdit || onDelete);
  const canTake =
    isTest &&
    isStudent &&
    studentCanTakeTest({
      passed,
      is_open: isOpen,
      needsReview,
    });
  const canContinue =
    isTest &&
    isStudent &&
    studentCanContinueTest({
      id,
      is_open: isOpen,
    });
  const isBlockedTest = isTest && isStudent && !canTake;
  const isBlocked = isBlockedTest;
  const isItemOpen = isTest ? Boolean(isOpen) : !locked;

  return (
    <div
      onClick={isBlocked ? undefined : onClick}
      aria-disabled={isBlocked}
      className={cn(
        "flex items-start gap-2 px-3 py-3 sm:gap-3 sm:px-4 border-b last:border-b-0 transition-colors",
        isBlocked ? "cursor-not-allowed" : "cursor-pointer hover:bg-muted/30",
        isActive && "bg-primary/10 border-l-4 border-l-primary"
      )}
    >
      {isStudent && canReceivePoints && (
        <div className="shrink-0 self-center">
          {isTest ? (
            needsReview ? (
              <Clock className="h-5 w-5 text-amber-500" />
            ) : passed === true ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : passed === false ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : canContinue ? (
              <Clock className="h-5 w-5 text-blue-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )
          ) : result && result !== "—" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground line-clamp-2">
          {title}
          {!isTest && week && canReceivePoints && (
            <span className="text-xs text-muted-foreground pl-1 sm:pl-2">
              {t("{{week}} неделя", { week })}
            </span>
          )}
        </h4>
        <ThemeScheduleLine openDate={openDate} deadline={deadline} />
        {isStudent && isTest && canContinue ? (
          <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
            {t("Продолжить")}
          </p>
        ) : isStudent && canReceivePoints ? (
          <TeacherGradeComment
            comment={comment}
            compact
            className="mt-0.5 line-clamp-2 max-w-none"
          />
        ) : null}
      </div>

      <Badge
        variant={isItemOpen ? "default" : "outline"}
        className="shrink-0 self-center gap-1 px-1.5 sm:px-2.5"
      >
        {isItemOpen ? (
          <LockOpen className="h-3 w-3" />
        ) : (
          <Lock className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">
          {isItemOpen ? t("Открыт") : t("Закрыт")}
        </span>
      </Badge>

      {canReceivePoints && (
        <div className="shrink-0 self-center">
          {isStudent ? (
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {result === null || result === "—" ? 0 : result}/{maxPoints}
            </span>
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {t("{{points}} б.", { points: maxPoints })}
            </span>
          )}
        </div>
      )}

      {showTeacherActions && (
        <div className="shrink-0 self-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t("Редактировать")}
              </DropdownMenuItem>
              <UseConfirmationDialog
                title={t("Удалить тему?")}
                description={t(
                  "«{{title}}» будет удалена без возможности восстановления.",
                  { title }
                )}
                onConfirm={() => onDelete?.(id)}
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("Удалить")}
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
