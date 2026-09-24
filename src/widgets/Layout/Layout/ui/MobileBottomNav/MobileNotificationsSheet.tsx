import { useTranslation } from "react-i18next";
import { MobileBottomSheet } from "shared/components";
import { NotificationList, useNotifications, useOpenNotification } from "widgets/Notification";

interface MobileNotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNotificationsSheet({
  open,
  onOpenChange,
}: MobileNotificationsSheetProps) {
  const { t } = useTranslation();
  const { notifications, unreadCount } = useNotifications();
  const openNotification = useOpenNotification(() => onOpenChange(false));

  return (
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("Уведомления")}
      headerAside={
        unreadCount > 0 ? (
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            {t("{{count}} новых", { count: unreadCount })}
          </span>
        ) : null
      }
    >
      <NotificationList
        notifications={notifications}
        onSelect={openNotification}
        density="comfortable"
      />
    </MobileBottomSheet>
  );
}
