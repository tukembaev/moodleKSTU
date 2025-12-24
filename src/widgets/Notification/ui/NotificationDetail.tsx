import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { LuCable } from "react-icons/lu";
import { Avatar, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Separator } from "shared/shadcn/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { userQueries } from "entities/User";

const NotificationDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: notificationsData, isLoading } = useQuery(
    userQueries.user_notifications()
  );

  const { mutate: markAsRead } = userQueries.use_mark_notification_read();

  const notification = notificationsData?.find((n) => n.id === id);

  useEffect(() => {
    if (notification && !notification.status) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  if (isLoading) {
    return (
      <Card className="h-full border-0 shadow-none">
        <CardContent className="p-4 flex items-center justify-center">
          <div className="text-muted-foreground animate-pulse text-sm">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  if (!notification) {
    return (
      <Card className="h-full border-0 shadow-none">
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            Выберите уведомление
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  return (
    <Card className="h-full border-0 shadow-none py-0">
      <CardContent className="flex flex-col p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarFallback className="text-xs sm:text-sm">
              {getInitials(notification.sender_first_name, notification.sender_last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-0 sm:ml-4 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <div className="font-semibold text-sm sm:text-base">
                {notification.sender_first_name} {notification.sender_last_name}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(parseISO(notification.created_at), "d MMMM yyyy, HH:mm", {
                  locale: ru,
                })}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-medium mt-1 text-primary">{notification.type}</div>
          </div>
        </div>
        <Separator className="my-3 sm:my-4" />


        <div className="text-md sm:text-md flex-1 break-words whitespace-pre-wrap">
          {notification.text}
        </div>

        {notification.link && (
          <>
            <a
              href={notification.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 sm:gap-4 p-2 rounded-xl 
                        hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                        transition-colors duration-200 cursor-pointer mt-3"
            >
              <div className="flex-none p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                <LuCable className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md sm:text-md font-medium text-zinc-900 dark:text-zinc-100">
                  Перейти по ссылке
                </p>
                {/* <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                  {notification.link}
                </p> */}
              </div>
            </a>

          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationDetail;
