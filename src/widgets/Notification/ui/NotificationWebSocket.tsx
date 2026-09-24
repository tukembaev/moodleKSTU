import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "shared/hooks";
import {
  COURSE_ANNOUNCEMENT_TYPE,
  COURSE_FEED_MATERIAL_TYPES,
  COURSE_FEED_TAB,
  openCourse,
  parseCourseAnnouncementCourseId,
} from "shared/lib/navigation/hidden-ids";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const NotificationWebSocket = () => {
    const { t } = useTranslation();
    const auth = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!auth?.id) return;

        const connect = () => {
            const wsUrl = `wss://uadmin.kstu.kg/edu-service/ws/notification/${auth.id}/`;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("Notification WebSocket connected");
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("New notification received via WS:", data);
                    const announcementCourseId = parseCourseAnnouncementCourseId(
                        data.link
                    );
                    const isFeedEvent =
                        data.type === COURSE_ANNOUNCEMENT_TYPE ||
                        (COURSE_FEED_MATERIAL_TYPES as readonly string[]).includes(
                            String(data.type ?? "")
                        ) ||
                        Boolean(announcementCourseId);

                    toast.info(data.type || t("Новое уведомление"), {
                        description: data.text || t("У вас новое уведомление"),
                        action: announcementCourseId
                            ? {
                                  label: t("Открыть"),
                                  onClick: () =>
                                      openCourse(navigate, announcementCourseId, {
                                          tab: COURSE_FEED_TAB,
                                      }),
                              }
                            : undefined,
                    });

                    queryClient.invalidateQueries({ queryKey: ["notifications"] });
                    if (isFeedEvent) {
                        queryClient.invalidateQueries({
                            queryKey: announcementCourseId
                                ? ["course", "announcements", announcementCourseId]
                                : ["course", "announcements"],
                        });
                        queryClient.invalidateQueries({
                            queryKey: announcementCourseId
                                ? ["course", "feed", announcementCourseId]
                                : ["course", "feed"],
                        });
                    }
                } catch (error) {
                    console.error("Error parsing WS notification:", error);
                }
            };

            ws.onclose = (event) => {
                console.log("Notification WebSocket closed:", event.code, event.reason);
                // Reconnect after some delay
                if (event.code !== 1000) {
                    setTimeout(connect, 5000);
                }
            };

            ws.onerror = (error) => {
                console.error("Notification WebSocket error:", error);
                ws.close();
            };

            wsRef.current = ws;
        };

        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close(1000, "Component unmounting");
            }
        };
    }, [auth?.id, navigate, queryClient, t]);

    return null;
};
