// ChatMessages.tsx
import { format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, LucideCheck, LucideCheckCheck, Loader2, Users, User } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { LuSend } from "react-icons/lu";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { useWebSocket } from "../lib/useWebSocket";
import { getMessages } from "../model/services/chatAPI";
import type { Message, Conversation } from "../model/types/chat";
import { toast } from "sonner";
import { useAuth } from "shared/hooks/useAuthData";

interface ChatMessagesProps {
  conversationId: string;
  conversation: Conversation;
  onLastMessageUpdate?: (message: Message) => void;
  onHeaderClick?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatMessages = ({
  conversationId,
  conversation,
  onLastMessageUpdate,
  onHeaderClick,
  onBack,
  showBackButton,
}: ChatMessagesProps) => {
  const [note, setNote] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const currentUserId = auth?.id;

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
        // Сортируем сообщения по дате создания (старые сверху, новые снизу)
        const sortedMessages = [...data].sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        setMessages(sortedMessages);
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
    // Оптимистично обновляем lastMessage в ChatSelect
    if (message.conversation_id === conversationId) {
      onLastMessageUpdate?.(message);
    }
  }, [conversationId, onLastMessageUpdate]);

  // Обработчики WebSocket
  const handleWsError = useCallback((error: Event) => {
    console.error("WebSocket error:", error);
    toast.error("Ошибка подключения к чату");
  }, []);

  const handleWsOpen = useCallback(() => {
    console.log("Connected to chat");
  }, []);

  // WebSocket подключение
  const { isConnected, sendMessage: sendWsMessage, error: wsError } = useWebSocket({
    conversationId,
    onMessage: handleNewMessage,
    onError: handleWsError,
    onOpen: handleWsOpen,
  });

  // Отправка сообщения
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (note.trim() && isConnected) {
      const messageText = note.trim();
      sendWsMessage(messageText);
      setNote("");
      
      // Оптимистично обновляем lastMessage при отправке
      // Создаем временное сообщение для оптимистичного обновления
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: currentUserId || 0,
        text: messageText,
        reply_to: null,
        is_edited: false,
        created_at: new Date().toISOString(),
      };
      onLastMessageUpdate?.(optimisticMessage);
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
      <div className="flex flex-col w-full items-center justify-center h-full min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Загрузка сообщений...</p>
      </div>
    );
  }

  const dayLabel = (d: Date) => {
    if (isToday(d)) return "Сегодня";
    if (isYesterday(d)) return "Вчера";
    return format(d, "dd MMMM", { locale: ru });
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      {/* Header (clickable for group details) */}
      <div className="border-b bg-background px-3 sm:px-4 py-2.5">
        <button
          type="button"
          onClick={onHeaderClick}
          className={cn(
            "w-full flex items-center gap-2 text-left rounded-xl px-2 py-1.5",
            onHeaderClick && "hover:bg-muted/50 cursor-pointer"
          )}
        >
          {showBackButton && (
            <span className="shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="-ml-2 h-9 w-9"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBack?.();
                }}
              >
                <ChevronLeft className="size-5" />
              </Button>
            </span>
          )}

          <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
            {conversation.type === "group" ? (
              <Users className="h-4 w-4 text-muted-foreground" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-medium truncate">
              {conversation.title || (conversation.type === "group" ? "Групповой чат" : "Беседа")}
            </h2>
            <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
              {conversation.type === "group" ? "Групповой чат" : "Приватный чат"}
              {!isConnected && <span className="ml-2 text-destructive">offline</span>}
            </div>
          </div>
        </button>
      </div>

      {/* Messages */}
      <div
        className={cn(
          "flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3",
          // subtle pattern like in the reference
          "bg-muted/10 [background-image:radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px]"
        )}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Нет сообщений</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {messages.map((message, idx) => {
            const isMyMessage = message.sender_id === currentUserId;
            const messageDate = new Date(message.created_at);
            const prev = idx > 0 ? messages[idx - 1] : null;
            const prevDate = prev ? new Date(prev.created_at) : null;
            const dayKey = format(messageDate, "yyyy-MM-dd");
            const prevDayKey = prevDate ? format(prevDate, "yyyy-MM-dd") : null;
            const showDayDivider = idx === 0 || dayKey !== prevDayKey;

            return (
              <div key={message.id}>
                {showDayDivider && (
                  <div className="py-2">
                    <div className="mx-auto w-fit rounded-full bg-background/80 px-3 py-1 text-[11px] text-muted-foreground shadow-sm border backdrop-blur">
                      {dayLabel(messageDate)}
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "flex gap-2 items-end",
                    isMyMessage ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Avatar for other side */}
                  {/* {!isMyMessage && (
                    <img
                      src={"https://bundui-images.netlify.app/avatars/01.png"}
                      className="size-7 sm:size-8 rounded-full object-cover shrink-0"
                      alt="Avatar"
                    />
                  )} */}

                  <div className={cn("max-w-[88%] sm:max-w-[70%]")}>
                    {/* Sender label for group chats */}
                    {!isMyMessage && conversation.type === "group" && (
                      <div className="mb-1 pl-1 text-[11px] text-muted-foreground">
                        ID {message.sender_id}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 text-xs sm:text-sm shadow-sm relative",
                        isMyMessage
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-background/90 text-foreground rounded-bl-md border backdrop-blur"
                      )}
                    >
                      <p className="break-words leading-relaxed pr-14">
                        {message.text ?? ""}
                      </p>

                      <div
                        className={cn(
                          "absolute bottom-1.5 right-2 flex items-center gap-1 text-[10px]",
                          isMyMessage ? "text-blue-100" : "text-muted-foreground"
                        )}
                      >
                        <span>{format(messageDate, "HH:mm", { locale: ru })}</span>
                        {isMyMessage && (
                          <span className="ml-0.5">
                            {message.is_edited ? (
                              <LucideCheckCheck className="w-3 h-3" />
                            ) : (
                              <LucideCheck className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t bg-background px-3 sm:px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write a message..."
            className="text-sm sm:text-base"
            disabled={!isConnected}
          />
          <Button
            type="submit"
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
    </div>
  );
};

export default ChatMessages;
