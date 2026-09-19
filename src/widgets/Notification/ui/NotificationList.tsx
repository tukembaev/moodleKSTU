import { formatDistanceToNow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import type { Notification } from "entities/User/types/user";
import { Bell } from "lucide-react";
import { cn } from "shared/lib/utils";

interface NotificationListProps {
  notifications: Notification[];
  onSelect: (notification: Notification) => void;
  /** "comfortable" даёт крупные тач-таргеты для мобильных листов */
  density?: "compact" | "comfortable";
  className?: string;
}

export function NotificationList({
  notifications,
  onSelect,
  density = "compact",
  className,
}: NotificationListProps) {
  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
        <Bell className="size-6 text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground">У вас нет уведомлений</p>
      </div>
    );
  }

  const comfortable = density === "comfortable";

  return (
    <div className={cn("divide-y", className)}>
      {notifications.map((notification) => (
        <button
          type="button"
          key={notification.id}
          onClick={() => onSelect(notification)}
          className={cn(
            "flex w-full items-start gap-3 text-left transition-colors hover:bg-muted/50 active:bg-muted",
            comfortable ? "px-4 py-3.5" : "p-3",
            !notification.status && "bg-blue-50/30 dark:bg-blue-900/5"
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p
                className={cn(
                  "truncate font-medium",
                  comfortable ? "text-sm" : "text-xs",
                  !notification.status
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {notification.type || "Уведомление"}
              </p>
              {!notification.status && (
                <span className="size-1.5 shrink-0 rounded-full bg-blue-600" />
              )}
            </div>
            <p
              className={cn(
                "mt-0.5 text-muted-foreground",
                comfortable ? "text-xs" : "text-[11px]"
              )}
            >
              {notification.sender_first_name} {notification.sender_last_name}
            </p>
            <p
              className={cn(
                "mt-0.5 line-clamp-2 text-muted-foreground",
                comfortable ? "text-xs" : "text-[11px]"
              )}
            >
              {notification.text}
            </p>
            <p
              className={cn(
                "mt-1 text-muted-foreground",
                comfortable ? "text-[11px]" : "text-[10px]"
              )}
            >
              {formatDistanceToNow(parseISO(notification.created_at), {
                addSuffix: true,
                locale: ru,
              })}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
