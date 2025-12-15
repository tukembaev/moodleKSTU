// ChatMessages.tsx
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LucideCheck, LucideCheckCheck, Loader2 } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { LuSend } from "react-icons/lu";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { useWebSocket } from "../lib/useWebSocket";
import { getMessages, getCurrentUserId } from "../model/services/chatAPI";
import type { Message } from "../model/types/chat";
import { toast } from "sonner";

interface ChatMessagesProps {
  conversationId: string;
}

const ChatMessages = ({ conversationId }: ChatMessagesProps) => {
  const [note, setNote] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = getCurrentUserId();

  // Автоматическая прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Загрузка истории сообщений
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(conversationId, 100, 0);
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Ошибка загрузки сообщений");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  // Обработчик нового сообщения через WebSocket
  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      // Проверяем, нет ли уже такого сообщения (избегаем дубликатов)
      const exists = prev.some((m) => m.id === message.id);
      if (exists) return prev;
      return [...prev, message];
    });
  }, []);

  // WebSocket подключение
  const { isConnected, sendMessage: sendWsMessage, error: wsError } = useWebSocket({
    conversationId,
    onMessage: handleNewMessage,
    onError: (error) => {
      console.error("WebSocket error:", error);
      toast.error("Ошибка подключения к чату");
    },
    onOpen: () => {
      console.log("Connected to chat");
    },
  });

  // Отправка сообщения
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (note.trim() && isConnected) {
      sendWsMessage(note.trim());
      setNote("");
    } else if (!isConnected) {
      toast.error("Нет подключения к чату");
    }
  };

  // Обработка Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Загрузка сообщений...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Заголовок чата */}
      <div className="mb-2 text-center flex gap-2 items-center">
        <img
          src={"https://bundui-images.netlify.app/avatars/01.png"}
          className="size-8 sm:size-10 rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col text-left min-w-0 flex-1">
          <h2 className="text-base sm:text-lg flex flex-wrap gap-2 sm:gap-4 items-center">
            <span className="truncate">Чат</span>
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="flex gap-1 px-1 sm:px-1.5 text-muted-foreground [&_svg]:size-3 text-xs shrink-0"
            >
              {isConnected ? "Онлайн" : "Оффлайн"}
            </Badge>
          </h2>
          <h4 className="text-[10px] sm:text-xs text-muted-foreground truncate">
            ID: {conversationId}
          </h4>
        </div>
      </div>

      {/* Список сообщений */}
      <div className="h-64 sm:h-96 overflow-y-auto space-y-2 p-2 sm:p-2 sm:pr-4 border rounded-xl">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Нет сообщений</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMyMessage = message.sender_id === currentUserId;
            const messageDate = new Date(message.created_at);

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  isMyMessage ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm",
                    isMyMessage
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-black"
                  )}
                >
                  <p className="break-words">{message.text}</p>
                  <div
                    className={cn(
                      "text-[10px] sm:text-xs mt-1 flex gap-1 items-center",
                      isMyMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    <span>
                      {format(messageDate, "dd MMM HH:mm", { locale: ru })}
                    </span>
                    {isMyMessage && (
                      <span>
                        {message.is_edited ? (
                          <LucideCheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        ) : (
                          <LucideCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Написать сообщение..."
          className="text-sm sm:text-base"
          disabled={!isConnected}
        />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="shrink-0"
          disabled={!isConnected || !note.trim()}
        >
          <LuSend className="h-4 w-4" />
        </Button>
      </form>

      {wsError && (
        <p className="text-xs text-destructive mt-1">Ошибка: {wsError}</p>
      )}
    </div>
  );
};

export default ChatMessages;
