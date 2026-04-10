# Примеры использования Chat Feature

## Пример 1: Базовое использование с готовым контейнером

```tsx
import { ChatContainer } from "features/Chat";

function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Мессенджер</h1>
      <ChatContainer />
    </div>
  );
}

export default ChatPage;
```

## Пример 2: Создание беседы

```tsx
import { useState } from "react";
import { createConversation, getCurrentUserId } from "features/Chat";
import { Button } from "shared/shadcn/ui/button";
import { toast } from "sonner";

function CreateChatButton() {
  const [loading, setLoading] = useState(false);

  const handleCreateChat = async () => {
    try {
      setLoading(true);
      const conversation = await createConversation({
        type: "group",
        title: "Новая группа",
        participant_ids: [getCurrentUserId()!, 2, 3], // добавляем участников
      });
      
      toast.success("Беседа создана!");
      console.log("Created conversation:", conversation);
    } catch (error) {
      toast.error("Ошибка создания беседы");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCreateChat} disabled={loading}>
      {loading ? "Создание..." : "Создать беседу"}
    </Button>
  );
}
```

## Пример 3: Кастомный компонент чата с WebSocket

```tsx
import { useState, useEffect } from "react";
import { useWebSocket, getMessages, getCurrentUserId } from "features/Chat";
import type { Message } from "features/Chat";

function CustomChat({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const currentUserId = getCurrentUserId();

  // Загрузка истории сообщений
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages(conversationId, 50, 0);
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();
  }, [conversationId]);

  // WebSocket подключение
  const { isConnected, sendMessage, error } = useWebSocket({
    conversationId,
    onMessage: (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  const handleSend = () => {
    if (inputText.trim() && isConnected) {
      sendMessage(inputText.trim());
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <h2>Чат {conversationId}</h2>
        <p className="text-sm text-muted-foreground">
          Статус: {isConnected ? "Подключен" : "Отключен"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender_id === currentUserId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200"
            } max-w-[70%]`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Написать сообщение..."
            className="flex-1 px-3 py-2 border rounded"
            disabled={!isConnected}
          />
          <button
            onClick={handleSend}
            disabled={!isConnected || !inputText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Отправить
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
```

## Пример 4: Использование React Query hooks

```tsx
import {
  useConversations,
  useMessages,
  useCreateConversation,
  useSendMessage,
  getCurrentUserId,
} from "features/Chat";
import { Button } from "shared/shadcn/ui/button";
import { toast } from "sonner";

function ChatWithReactQuery() {
  const currentUserId = getCurrentUserId();
  
  // Получение списка бесед
  const { data: conversations, isLoading, error } = useConversations();
  
  // Создание беседы
  const createMutation = useCreateConversation();
  
  // Отправка сообщения
  const sendMutation = useSendMessage();

  const handleCreateChat = async () => {
    try {
      await createMutation.mutateAsync({
        type: "group",
        title: "React Query Chat",
        participant_ids: [currentUserId!],
      });
      toast.success("Беседа создана!");
    } catch (error) {
      toast.error("Ошибка создания беседы");
    }
  };

  const handleSendMessage = async (conversationId: string, text: string) => {
    try {
      await sendMutation.mutateAsync({
        conversation_id: conversationId,
        sender_id: currentUserId!,
        text,
      });
      toast.success("Сообщение отправлено!");
    } catch (error) {
      toast.error("Ошибка отправки сообщения");
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      <Button onClick={handleCreateChat} disabled={createMutation.isPending}>
        {createMutation.isPending ? "Создание..." : "Создать беседу"}
      </Button>

      <div className="mt-4">
        <h2>Мои беседы ({conversations?.length})</h2>
        {conversations?.map((conv) => (
          <div key={conv.id} className="p-4 border rounded mb-2">
            <h3>{conv.title || "Без названия"}</h3>
            <p className="text-sm text-gray-500">
              {conv.type === "group" ? "Групповой чат" : "Приватная беседа"}
            </p>
            <Button
              onClick={() => handleSendMessage(conv.id, "Привет!")}
              disabled={sendMutation.isPending}
              size="sm"
              className="mt-2"
            >
              Отправить "Привет!"
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Пример 5: Список сообщений с пагинацией

```tsx
import { useState } from "react";
import { useMessages } from "features/Chat";
import { Button } from "shared/shadcn/ui/button";

function MessagesWithPagination({ conversationId }: { conversationId: string }) {
  const [page, setPage] = useState(0);
  const limit = 20;
  const offset = page * limit;

  const { data: messages, isLoading, error } = useMessages(
    conversationId,
    limit,
    offset
  );

  if (isLoading) return <div>Загрузка сообщений...</div>;
  if (error) return <div>Ошибка загрузки: {error.message}</div>;

  return (
    <div>
      <div className="space-y-2">
        {messages?.map((msg) => (
          <div key={msg.id} className="p-2 border rounded">
            <p>{msg.text}</p>
            <small className="text-gray-500">
              {new Date(msg.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Назад
        </Button>
        <span>Страница {page + 1}</span>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={!messages || messages.length < limit}
        >
          Вперед
        </Button>
      </div>
    </div>
  );
}
```

## Пример 6: Управление участниками беседы

```tsx
import { useState } from "react";
import {
  useAddParticipant,
  useRemoveParticipant,
  useConversation,
} from "features/Chat";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { toast } from "sonner";

function ParticipantsManager({ conversationId }: { conversationId: string }) {
  const [userId, setUserId] = useState("");
  const { data: conversation } = useConversation(conversationId);
  const addMutation = useAddParticipant();
  const removeMutation = useRemoveParticipant();

  const handleAddParticipant = async () => {
    if (!userId) return;

    try {
      await addMutation.mutateAsync({
        conversationId,
        data: {
          user_id: parseInt(userId),
          role: "member",
        },
      });
      toast.success("Участник добавлен");
      setUserId("");
    } catch (error) {
      toast.error("Ошибка добавления участника");
    }
  };

  const handleRemoveParticipant = async (uid: number) => {
    try {
      await removeMutation.mutateAsync({
        conversationId,
        userId: uid,
      });
      toast.success("Участник удален");
    } catch (error) {
      toast.error("Ошибка удаления участника");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-4">Управление участниками</h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="ID пользователя"
        />
        <Button
          onClick={handleAddParticipant}
          disabled={!userId || addMutation.isPending}
        >
          Добавить
        </Button>
      </div>

      <div className="space-y-2">
        {conversation?.participants?.map((participant) => (
          <div
            key={participant.user_id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div>
              <p>ID: {participant.user_id}</p>
              <p className="text-sm text-gray-500">Роль: {participant.role}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveParticipant(participant.user_id)}
              disabled={removeMutation.isPending}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Пример 7: Редактирование сообщения

```tsx
import { useState } from "react";
import { useEditMessage, useDeleteMessage } from "features/Chat";
import type { Message } from "features/Chat";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { toast } from "sonner";

function EditableMessage({ message }: { message: Message }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || "");
  
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();

  const handleEdit = async () => {
    try {
      await editMutation.mutateAsync({
        messageId: message.id,
        data: { text: editText },
      });
      toast.success("Сообщение отредактировано");
      setIsEditing(false);
    } catch (error) {
      toast.error("Ошибка редактирования");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить сообщение?")) return;

    try {
      await deleteMutation.mutateAsync(message.id);
      toast.success("Сообщение удалено");
    } catch (error) {
      toast.error("Ошибка удаления");
    }
  };

  if (isEditing) {
    return (
      <div className="p-2 border rounded">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="mb-2"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleEdit} disabled={editMutation.isPending}>
            Сохранить
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 border rounded">
      <p>{message.text}</p>
      {message.is_edited && (
        <span className="text-xs text-gray-500">(изменено)</span>
      )}
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
          Редактировать
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}
```

## Пример 8: Использование в роутинге

```tsx
import { Routes, Route } from "react-router-dom";
import { ChatContainer } from "features/Chat";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/chat" element={<ChatContainer />} />
      <Route path="/chat/:conversationId" element={<ChatPage />} />
    </Routes>
  );
}

function ChatPage() {
  const { conversationId } = useParams();
  
  if (!conversationId) {
    return <div>Беседа не найдена</div>;
  }

  return (
    <div className="container mx-auto">
      <ChatMessages conversationId={conversationId} />
    </div>
  );
}
```

## Лучшие практики

1. **Всегда проверяйте isConnected перед отправкой сообщений через WebSocket**
2. **Используйте React Query для кеширования и автоматического обновления данных**
3. **Обрабатывайте ошибки с помощью toast уведомлений**
4. **Используйте getCurrentUserId() для получения ID текущего пользователя**
5. **Для приватных бесед указывайте type: "private", для групповых - type: "group"**
6. **WebSocket автоматически переподключается при разрыве соединения**
