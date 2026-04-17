import { FC } from "react";
import { CheckCircle2, Circle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { Button } from "shared/shadcn/ui/button";

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
}

export const TaskItem: FC<TaskItemProps> = ({
  id,
  title,
  week,
  result,
  maxPoints,
  status,
  locked,
  isStudent,
  onClick,
  isActive = false,
  onEdit,
  onDelete,
}) => {

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition-colors cursor-pointer",
        "hover:bg-muted/30",
        locked && "opacity-50 cursor-not-allowed",
        isActive && "bg-primary/10 border-l-4 border-l-primary"
      )}
    >
      {/* Иконка статуса */}
      {isStudent &&   <div className="shrink-0">
        {result ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>}
   

      {/* Название задания */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground">{title}</h4>
      </div>

      {/* Неделя */}
      <div className="shrink-0 hidden sm:block">
        <span className="text-sm text-muted-foreground">{week}</span>
      </div>

      {/* Баллы */}
      <div className="shrink-0">
        {isStudent ? (
          <span className="text-sm text-muted-foreground">
            {result === null ? 0 : result}/{maxPoints}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">{maxPoints} б.</span>
        )}
      </div>

      {/* Меню действий для преподавателя */}
      {!isStudent && (
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
              <DropdownMenuItem
                onClick={() => onDelete?.(id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
