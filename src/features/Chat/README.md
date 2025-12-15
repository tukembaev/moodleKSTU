# Chat Feature

Полная интеграция чата с REST API и WebSocket для real-time коммуникации.

## Структура

```
Chat/
├── model/
│   ├── types/
│   │   └── chat.ts              # TypeScript типы для API
│   └── services/
│       ├── chatAPI.ts           # REST API сервис
│       └── chatQueries.ts       # React Query hooks
├── lib/
│   └── useWebSocket.tsx         # WebSocket хук
├── ui/
│   ├── ChatContainer.tsx        # Главный контейнер чата
│   ├── ChatMessages.tsx         # Компонент сообщений с WebSocket
│   └── ChatSelect.tsx           # Список бесед
└── index.ts                     # Экспорты
```

## API Endpoints

### Conversations (Беседы)

- `POST /api/unet-chat/conversations/` - создать беседу
- `GET /api/unet-chat/conversations/` - получить список бесед
- `GET /api/unet-chat/conversations/{id}` - получить беседу по ID
- `DELETE /api/unet-chat/conversations/{id}` - удалить беседу

### Messages (Сообщения)

- `POST /api/unet-chat/messages/` - отправить сообщение (REST)
- `GET /api/unet-chat/messages/{conversation_id}` - получить историю сообщений
- `PUT /api/unet-chat/messages/{message_id}` - редактировать сообщение
- `DELETE /api/unet-chat/messages/{message_id}` - удалить сообщение

### Participants (Участники)

- `POST /api/unet-chat/conversations/{id}/participants/` - добавить участника
- `DELETE /api/unet-chat/conversations/{id}/participants/{user_id}` - удалить участника

## WebSocket

### Подключение

```typescript
const { isConnected, sendMessage, disconnect, error } = useWebSocket({
  conversationId: "uuid",
  onMessage: (message) => console.log("New message:", message),
  onError: (error) => console.error("WebSocket error:", error),
  onOpen: () => console.log("Connected"),
  onClose: () => console.log("Disconnected"),
});
```

### URL
```
wss://uadmin.kstu.kg/api/unet-chat/ws/conversations/{conversation_id}/?WWW-Authenticate=Bearer%20{token}
```

### Отправка сообщений через WebSocket

```typescript
sendMessage("Привет!", null); // текст, reply_to
```

### Получение сообщений

Все подключенные клиенты автоматически получают новые сообщения через WebSocket:

```json
{
  "type": "message:new",
  "payload": {
    "id": "uuid",
    "conversation_id": "uuid",
    "sender_id": 1,
    "text": "Привет!",
    "reply_to": null,
    "is_edited": false,
    "created_at": "2024-01-01T12:00:00"
  }
}
```

## Использование

### Базовое использование

```tsx
import { ChatContainer } from "features/Chat";

function App() {
  return <ChatContainer />;
}
```

### Использование API напрямую

```typescript
import { getConversations, sendMessage, getCurrentUserId } from "features/Chat";

// Получить список бесед
const conversations = await getConversations();

// Отправить сообщение
const message = await sendMessage({
  conversation_id: "uuid",
  sender_id: getCurrentUserId()!,
  text: "Привет!",
  reply_to: null,
});
```

### Использование React Query hooks

```typescript
import { useConversations, useSendMessage } from "features/Chat";

function MyComponent() {
  const { data: conversations, isLoading } = useConversations();
  const sendMutation = useSendMessage();

  const handleSend = async () => {
    await sendMutation.mutateAsync({
      conversation_id: "uuid",
      sender_id: 1,
      text: "Привет!",
    });
  };

  return (
    <div>
      {conversations?.map((conv) => (
        <div key={conv.id}>{conv.title}</div>
      ))}
    </div>
  );
}
```

## Компоненты

### ChatContainer

Главный контейнер, управляющий состоянием чата.

**Props:** нет

**Features:**
- Загрузка списка бесед
- Создание новых бесед
- Переключение между беседами

### ChatMessages

Компонент для отображения сообщений с WebSocket поддержкой.

**Props:**
- `conversationId: string` - ID беседы

**Features:**
- WebSocket real-time сообщения
- Загрузка истории сообщений
- Отправка сообщений
- Автоматическая прокрутка к новым сообщениям
- Индикатор статуса подключения

### ChatSelect

Список бесед с поиском и созданием новых.

**Props:**
- `onSelectChat: (chatId: string) => void` - callback выбора беседы
- `conversations: Conversation[]` - список бесед
- `loading: boolean` - состояние загрузки
- `onCreateConversation: (type, title?, participantIds?) => Promise<Conversation | null>` - callback создания беседы
- `selectedChatId: string | null` - ID выбранной беседы

**Features:**
- Поиск по беседам
- Создание приватных/групповых бесед
- Индикация выбранной беседы

## Типы

### Conversation

```typescript
interface Conversation {
  id: string;
  type: "private" | "group";
  title: string | null;
  created_by: number;
  created_at: string;
  service: string | null;
  service_id: string | null;
}
```

### Message

```typescript
interface Message {
  id: string;
  conversation_id: string;
  sender_id: number;
  text: string | null;
  reply_to: string | null;
  is_edited: boolean;
  created_at: string;
}
```

## Аутентификация

JWT токен автоматически добавляется из `localStorage`:

```typescript
const auth_data = JSON.parse(localStorage.getItem("auth_data") || "{}");
const token = auth_data.access;
```

## Обработка ошибок

### 401 Unauthorized
Автоматическое обновление токена через `refreshUser()`.

### WebSocket ошибки
- Автоматическое переподключение (до 5 попыток)
- Экспоненциальная задержка между попытками
- Отображение ошибок через toast уведомления

## Особенности

1. **Real-time обновления** - WebSocket для мгновенной доставки сообщений
2. **Оптимистичные обновления** - React Query для кеширования и оптимизации
3. **Автоматическое переподключение** - WebSocket восстанавливает соединение при разрыве
4. **Адаптивный дизайн** - работает на мобильных устройствах
5. **Типизация** - полная поддержка TypeScript
6. **Валидация** - проверка токенов и прав доступа

## Зависимости

Все зависимости уже установлены в проекте:
- `axios` - HTTP запросы
- `@tanstack/react-query` - управление состоянием
- `sonner` - toast уведомления
- `date-fns` - работа с датами
- `lucide-react` - иконки
- WebSocket API (встроенный в браузер)

## Troubleshooting

### WebSocket не подключается

1. Проверьте наличие токена в localStorage
2. Проверьте, что пользователь является участником беседы
3. Проверьте консоль на ошибки подключения

### Сообщения не отправляются

1. Убедитесь, что WebSocket подключен (`isConnected === true`)
2. Проверьте формат сообщения
3. Проверьте права доступа к беседе

### Беседы не загружаются

1. Проверьте токен аутентификации
2. Проверьте сетевые запросы в DevTools
3. Проверьте формат ответа API
