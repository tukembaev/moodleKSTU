// useWebSocket.tsx - хук для работы с WebSocket
import { useEffect, useRef, useState, useCallback } from "react";
import type { Message, WebSocketMessage } from "../model/types/chat";
import { getAuthToken } from "../model/services/chatAPI";

interface UseWebSocketOptions {
  conversationId: string;
  onMessage?: (message: Message) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (text: string, replyTo?: string | null) => void;
  disconnect: () => void;
  error: string | null;
}

const WS_BASE_URL = "wss://uadmin.kstu.kg/api/unet-chat/ws";

export const useWebSocket = ({
  conversationId,
  onMessage,
  onError,
  onOpen,
  onClose,
}: UseWebSocketOptions): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  // Используем refs для колбэков чтобы избежать пересоздания connect функции
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  
  // Обновляем refs при изменении колбэков
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  });

  // Функция подключения к WebSocket
  const connect = useCallback(() => {
    if (!conversationId) {
      console.error("conversationId is required for WebSocket connection");
      return;
    }
    
    // Предотвращаем создание нового соединения если уже есть активное
    if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found");
      console.error("Authentication token not found");
      return;
    }

    try {
      // Создаем WebSocket URL с токеном в query параметре
      const wsUrl = `${WS_BASE_URL}/conversations/${conversationId}/?Authorization=Bearer%20${encodeURIComponent(
        token
      )}`;

      console.log("Connecting to WebSocket:", wsUrl);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onOpenRef.current?.();
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          if (data.type === "message:new" && data.payload) {
            // Проверяем, что payload это полное сообщение, а не запрос
            if ("id" in data.payload && "conversation_id" in data.payload) {
              onMessageRef.current?.(data.payload as Message);
            }
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("WebSocket connection error");
        onErrorRef.current?.(event);
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);

        // Автоматическое переподключение
        if (
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          event.code !== 1000 // Не переподключаемся при нормальном закрытии
        ) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(
            `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError("Max reconnection attempts reached");
        }

        onCloseRef.current?.();
      };

      wsRef.current = ws;
    } catch (err) {
      console.error("Error creating WebSocket:", err);
      setError("Failed to create WebSocket connection");
    }
  }, [conversationId]);

  // Подключение при монтировании
  useEffect(() => {
    connect();

    return () => {
      // Очистка при размонтировании
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Component unmounting");
      }
    };
  }, [connect]);

  // Функция отправки сообщения через WebSocket
  const sendMessage = useCallback(
    (text: string, replyTo: string | null = null) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.error("WebSocket is not connected");
        setError("WebSocket is not connected");
        return;
      }

      try {
        const message: WebSocketMessage = {
          type: "message:new",
          payload: {
            text,
            reply_to: replyTo,
          },
        };

        wsRef.current.send(JSON.stringify(message));
        console.log("Message sent via WebSocket:", message);
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Failed to send message");
      }
    },
    []
  );

  // Функция отключения
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    sendMessage,
    disconnect,
    error,
  };
};
