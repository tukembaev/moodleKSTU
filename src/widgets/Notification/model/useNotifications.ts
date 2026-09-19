import { useQuery } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import { userQueries } from "entities/User";
import type { Notification } from "entities/User/types/user";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  COURSE_FEED_TAB,
  openCourse,
  parseCourseAnnouncementCourseId,
} from "shared/lib/navigation/hidden-ids";

export function useNotifications() {
  const { data } = useQuery(userQueries.user_notifications());

  const notifications = useMemo(() => {
    if (!data) return [] as Notification[];
    return [...data].sort(
      (a, b) =>
        parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime()
    );
  }, [data]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.status).length,
    [notifications]
  );

  return { notifications, unreadCount };
}

export function useOpenNotification(onNavigate?: () => void) {
  const navigate = useNavigate();
  const { mutate: markAsRead } = userQueries.use_mark_notification_read();

  return (notification: Notification) => {
    if (!notification.status) {
      markAsRead(notification.id);
    }

    const link = notification.link;
    if (!link) return;

    onNavigate?.();

    const announcementCourseId = parseCourseAnnouncementCourseId(link);
    if (announcementCourseId) {
      openCourse(navigate, announcementCourseId, { tab: COURSE_FEED_TAB });
      return;
    }

    if (/^https?:\/\//.test(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(link);
  };
}
