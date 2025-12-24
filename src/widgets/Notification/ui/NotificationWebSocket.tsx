import { useEffect, useRef } from "react";
import { useAuth } from "shared/hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const NotificationWebSocket = () => {
    const auth = useAuth();
    const queryClient = useQueryClient();
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

                    // Show toast
                    toast.info(data.type || "Новое уведомление", {
                        description: data.text || "У вас новое уведомление",
                    });

                    // Invalidate notifications query to update UI and count
                    queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
    }, [auth?.id, queryClient]);

    return null;
};
