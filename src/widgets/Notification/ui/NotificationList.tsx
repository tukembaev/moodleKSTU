import { useMemo, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { useQuery } from "@tanstack/react-query";
import { userQueries } from "entities/User";

type SortType = "date-desc" | "date-asc" | "sender-asc" | "sender-desc" | "title-asc" | "title-desc";

const NotificationList = () => {
  const [sortType, setSortType] = useState<SortType>("date-desc");
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: notificationsData, isLoading } = useQuery(
    userQueries.user_notifications()
  );

  const sortedNotifications = useMemo(() => {
    if (!notificationsData) return [];
    const notifications = [...notificationsData];

    switch (sortType) {
      case "date-desc":
        return notifications.sort((a, b) => parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime());
      case "date-asc":
        return notifications.sort((a, b) => parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime());
      case "sender-asc":
        return notifications.sort((a, b) =>
          `${a.sender_first_name} ${a.sender_last_name}`.localeCompare(`${b.sender_first_name} ${b.sender_last_name}`, "ru")
        );
      case "sender-desc":
        return notifications.sort((a, b) =>
          `${b.sender_first_name} ${b.sender_last_name}`.localeCompare(`${a.sender_first_name} ${a.sender_last_name}`, "ru")
        );
      case "title-asc":
        return notifications.sort((a, b) => a.type.localeCompare(b.type, "ru"));
      case "title-desc":
        return notifications.sort((a, b) => b.type.localeCompare(a.type, "ru"));
      default:
        return notifications;
    }
  }, [notificationsData, sortType]);

  const visibleNotifications = isExpanded ? sortedNotifications : sortedNotifications.slice(0, 6);

  if (isLoading) {
    return (
      <Card className="h-full border-0 shadow-none py-0">
        <CardContent className="flex h-full flex-col items-center justify-center p-4">
          <div className="text-muted-foreground animate-pulse">Загрузка уведомлений...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-0 shadow-none py-0">
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-semibold">Уведомления</h2>
          <Select value={sortType} onValueChange={(value) => setSortType(value as SortType)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Сортировать по..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">По дате (новые сначала)</SelectItem>
              <SelectItem value="date-asc">По дате (старые сначала)</SelectItem>
              <SelectItem value="sender-asc">По отправителю (А-Я)</SelectItem>
              <SelectItem value="sender-desc">По отправителю (Я-А)</SelectItem>
              <SelectItem value="title-asc">По названию (А-Я)</SelectItem>
              <SelectItem value="title-desc">По названию (Я-А)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div
          className={cn(
            "flex-1 flex flex-col gap-4 overflow-y-auto transition-all duration-300 pr-2 max-h-[700px]",
          )}
        >
          {visibleNotifications.map((notification) => (
            <Link to={`/notification/${notification.id}`} key={notification.id}>
              <Button
                variant="outline"
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 sm:p-4 text-left text-sm transition-all hover:bg-accent w-full h-auto",
                  !notification.status ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800" : "bg-muted/50"
                )}
                isAnimated={false}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm">
                        {notification.sender_first_name} {notification.sender_last_name}
                      </span>
                      {!notification.status && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {formatDistanceToNow(parseISO(notification.created_at), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs font-medium text-primary">
                    {notification.type}
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground break-words whitespace-pre-wrap line-clamp-2">
                  {notification.text}
                </div>
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t flex flex-col gap-2">
          {!isExpanded && sortedNotifications.length > 5 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-muted-foreground hover:text-primary transition-colors text-xs font-medium px-8"
                onClick={() => setIsExpanded(true)}
              >
                Показать все уведомления ({sortedNotifications.length})
              </Button>
            </div>
          )}
          {isExpanded && sortedNotifications.length > 5 && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-muted-foreground hover:text-primary transition-colors text-xs font-medium"
                onClick={() => setIsExpanded(false)}
              >
                Свернуть
              </Button>
            </div>
          )}
          {!isLoading && sortedNotifications.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              У вас нет уведомлений
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationList;
