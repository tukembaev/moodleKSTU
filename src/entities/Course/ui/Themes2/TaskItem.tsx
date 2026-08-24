import { FC } from "react";
import { CheckCircle2, Circle, Lock, LockOpen, MoreVertical, Pencil, Trash2, XCircle } from "lucide-react";
import { cn } from "shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { Button } from "shared/shadcn/ui/button";
import { UseConfirmationDialog } from "shared/components";
import { Badge } from "shared/shadcn/ui/badge";
import { studentCanTakeTest } from "entities/Test/model/types/test";

interface TaskItemProps {
  id: string;
  title: string;
  week: string;
  result: string;
  maxPoints: number;
  status: boolean;
  locked: boolean;
  isStudent: boolean;
  deadline?: string;
  activeRemarksCount?: number;
  onClick?: () => void;
  isActive?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isTest?: boolean;
  isOpen?: boolean | null;
  passed?: boolean | null;
}

export const TaskItem: FC<TaskItemProps> = ({
  id,
  title,
  week,
  result,
  maxPoints,
  locked,
  isStudent,
  onClick,
  isActive = false,
  onEdit,
  onDelete,
  isTest = false,
  isOpen,
  passed = null,
}) => {
  const showTeacherActions = !isStudent && !isTest && (onEdit || onDelete);
  const isBlockedTest =
    isTest && isStudent && !studentCanTakeTest({ passed, is_open: isOpen });
  const isBlockedTheme = !isTest && isStudent && locked;
  const isBlocked = isBlockedTest || isBlockedTheme;
  const isItemOpen = isTest ? Boolean(isOpen) : !locked;

  return (
    <div
      onClick={isBlocked ? undefined : onClick}
      aria-disabled={isBlocked}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition-colors",
        isBlocked ? "cursor-not-allowed" : "cursor-pointer hover:bg-muted/30",
        locked && !isTest && "opacity-50",
        isActive && "bg-primary/10 border-l-4 border-l-primary"
      )}
    >
      {isStudent && (
        <div className="shrink-0">
          {isTest ? (
            passed === true ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : passed === false ? (
              <XCircle className="h-5 w-5 text-red-500" />
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
        <h4 className="font-medium text-sm text-foreground">
          {title}
          {!isTest && week && (
            <span className="text-xs text-muted-foreground pl-2">
              {week} неделя
            </span>
          )}
        </h4>
      </div>

      <Badge variant={isItemOpen ? "default" : "outline"} className="shrink-0 gap-1">
        {isItemOpen ? (
          <LockOpen className="h-3 w-3" />
        ) : (
          <Lock className="h-3 w-3" />
        )}
        {isItemOpen ? "Открыт" : "Закрыт"}
      </Badge>

      <div className="shrink-0">
        {isStudent ? (
          <span className="text-sm text-muted-foreground">
            {result === null || result === "—" ? 0 : result}/{maxPoints}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">{maxPoints} б.</span>
        )}
      </div>

      {showTeacherActions && (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </DropdownMenuItem>
              <UseConfirmationDialog
                title="Удалить тему?"
                description={`«${title}» будет удалена без возможности восстановления.`}
                onConfirm={() => onDelete?.(id)}
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
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
