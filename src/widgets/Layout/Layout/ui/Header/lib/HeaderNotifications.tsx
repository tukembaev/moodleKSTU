import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { userQueries } from "entities/User";
import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "shared/shadcn/ui/hover-card";

export function HeaderNotifications() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: notificationsData } = useQuery(userQueries.user_notifications());
  const { mutate: markAsRead } = userQueries.use_mark_notification_read();

  const unreadCount = notificationsData?.filter((n) => !n.status).length || 0;

  const notifications = useMemo(() => {
    if (!notificationsData) return [];
    return [...notificationsData].sort(
      (a, b) =>
        parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime()
    );
  }, [notificationsData]);

  const handleNotificationClick = (id: string, status: boolean, link?: string) => {
    if (!status) {
      markAsRead(id);
    }
    if (link) {
      setOpen(false);
      if (/^https?:\/\//.test(link)) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        navigate(link);
      }
    }
  };

  return (
    <HoverCard
      open={open}
      onOpenChange={setOpen}
      openDelay={100000}
      closeDelay={200}
    >
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Уведомления"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Уведомления</h2>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {unreadCount} новых
            </span>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.status,
                      notification.link
                    )
                  }
                  className={cn(
                    "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50",
                    !notification.status && "bg-blue-50/30 dark:bg-blue-900/5"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "truncate text-xs font-medium",
                          !notification.status
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {notification.type || "Уведомление"}
                      </p>
                      {!notification.status && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {notification.sender_first_name}{" "}
                      {notification.sender_last_name}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                      {notification.text}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatDistanceToNow(parseISO(notification.created_at), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-xs text-muted-foreground">
                У вас нет уведомлений
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
