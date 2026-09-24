import { Bell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "shared/shadcn/ui/hover-card";
import {
  NotificationList,
  useNotifications,
  useOpenNotification,
} from "widgets/Notification";

export function HeaderNotifications() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();
  const openNotification = useOpenNotification(() => setOpen(false));

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
          aria-label={t("Уведомления")}
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
            <h2 className="text-sm font-semibold">{t("Уведомления")}</h2>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {t("{{count}} новых", { count: unreadCount })}
            </span>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          <NotificationList
            notifications={notifications}
            onSelect={openNotification}
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
