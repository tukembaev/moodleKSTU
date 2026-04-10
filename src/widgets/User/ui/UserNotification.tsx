import { motion } from "framer-motion";
import { FileText, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { userQueries } from "entities/User";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";

const UserNotification = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: notificationsData } = useQuery(
    userQueries.user_notifications()
  );

  const unreadCount = notificationsData?.filter(n => !n.status).length || 0;
  const latestNotifications = notificationsData?.slice(0, 5) || [];

  return (
    <div className="z-40">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="flex gap-2 items-center text-sm">
          <Button variant="outline" size="icon" className="relative mr-4 bg-background">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-41 p-0 border-none shadow-xl" align="end">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "w-80 flex flex-col overflow-hidden",
              "rounded-xl border",
              "bg-background",
              "max-h-[32rem]"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">
                  Уведомления
                </h2>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} новых
                </span>
              )}
            </div>
            <div className="overflow-y-auto">
              {latestNotifications.length > 0 ? (
                <div className="divide-y">
                  {latestNotifications.map((notification) => (
                    <Link
                      to={`/notification/${notification.id}`}
                      key={notification.id}
                      onClick={() => setIsDropdownOpen(false)}
                      className={cn(
                        "flex items-start gap-3 p-3 transition-colors hover:bg-muted/50",
                        !notification.status && "bg-blue-50/30 dark:bg-blue-900/5"
                      )}
                    >
                      <div className={cn(
                        "flex-none p-2 rounded-full",
                        !notification.status ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "bg-muted text-muted-foreground"
                      )}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-xs font-medium truncate",
                          !notification.status ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.type || "Уведомление"}
                        </p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.text}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatDistanceToNow(parseISO(notification.created_at), {
                            addSuffix: true,
                            locale: ru,
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-xs text-muted-foreground">У вас нет уведомлений</p>
                </div>
              )}
            </div>
            {notificationsData && notificationsData.length > 0 && (
              <Link
                to="/notification"
                onClick={() => setIsDropdownOpen(false)}
                className="p-3 text-center border-t hover:bg-muted/50 transition-colors"
              >
                <span className="text-xs font-medium text-primary">Смотреть все</span>
              </Link>
            )}
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserNotification;
