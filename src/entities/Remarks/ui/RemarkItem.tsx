import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  LuMessageSquare,
  LuPaperclip,
  LuClock,
  LuCheck,
  LuCircleAlert,
  LuChevronRight,
  LuFileText,
} from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Card, CardHeader } from "shared/shadcn/ui/card";
import { cn } from "shared/lib/utils";
import { Remark, RemarkStatus, RemarkType } from "entities/Remarks/model/types/remarks";

interface RemarkItemProps {
  remark: Remark;
  currentUserRole: "teacher" | "student";
  onClick?: () => void;
  isCompact?: boolean;
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

const RemarkItem = ({
  remark,
  currentUserRole,
  onClick,
  isCompact = false,
  className,
}: RemarkItemProps) => {
  const getStatusConfig = (status: RemarkStatus) => {
    switch (status) {
      case RemarkStatus.PENDING:
        return {
          badge: (
            <Badge className="gap-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
              <LuClock className="h-3 w-3" />
              {!isCompact && "Ожидает"}
            </Badge>
          ),
          borderColor: "border-l-amber-500",
          dotColor: "bg-amber-500",
        };
      case RemarkStatus.RESPONDED:
        return {
          badge: (
            <Badge className="gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
              <LuMessageSquare className="h-3 w-3" />
              {!isCompact && "На проверке"}
            </Badge>
          ),
          borderColor: "border-l-blue-500",
          dotColor: "bg-blue-500",
        };
      case RemarkStatus.APPROVED:
        return {
          badge: (
            <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
              <LuCheck className="h-3 w-3" />
              {!isCompact && "Одобрено"}
            </Badge>
          ),
          borderColor: "border-l-emerald-500",
          dotColor: "bg-emerald-500",
        };
      case RemarkStatus.REJECTED:
        return {
          badge: (
            <Badge className="gap-1 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800">
              <LuCircleAlert className="h-3 w-3" />
              {!isCompact && "Исправить"}
            </Badge>
          ),
          borderColor: "border-l-rose-500",
          dotColor: "bg-rose-500",
        };
    }
  };

  const statusConfig = getStatusConfig(remark.status);
  const lastMessage = remark.messages[remark.messages.length - 1];

  const personInfo =
    currentUserRole === "teacher"
      ? { name: remark.student_name, group: remark.student_group, avatar: remark.student_avatar }
      : { name: remark.teacher_name, group: undefined, avatar: remark.teacher_avatar };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 border-l-4",
        statusConfig.borderColor,
        onClick && "hover:bg-muted/30",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="py-3.5 px-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background shadow-sm">
            <AvatarImage src={personInfo.avatar} />
            <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-slate-600 to-slate-700 text-white">
              {getInitials(personInfo.name)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm truncate">
                    {personInfo.name}
                  </span>
                  {personInfo.group && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {personInfo.group}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {remark.course_name}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {statusConfig.badge}
              </div>
            </div>

            {/* Theme title */}
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-muted/50">
                <LuFileText className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium truncate">
                {remark.theme_title}
              </span>
              {remark.type === RemarkType.FILE && (
                <Badge variant="secondary" className="gap-1 text-xs shrink-0">
                  <LuPaperclip className="h-3 w-3" />
                  К файлу
                </Badge>
              )}
            </div>

            {/* Last message preview */}
            {!isCompact && lastMessage && (
              <div className="flex items-start gap-2 mt-2">
                <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", statusConfig.dotColor)} />
                <p className="text-xs text-muted-foreground line-clamp-2">
                  <span className="font-medium text-foreground/80">
                    {lastMessage.sender_role === "teacher" ? "Преподаватель: " : "Студент: "}
                  </span>
                  {lastMessage.message}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{format(remark.updated_at, "d MMM, HH:mm", { locale: ru })}</span>
                <span className="flex items-center gap-1">
                  <LuMessageSquare className="h-3 w-3" />
                  {remark.messages.length}
                </span>
              </div>
              {onClick && (
                <LuChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default RemarkItem;
