// constants.ts - константы для Chat feature

export const CHAT_CONFIG = {
  // API URLs
  API_BASE_URL: "http://127.0.0.1:8000/api/unet-chat/",
  WS_BASE_URL: "wss://uadmin.kstu.kg/api/unet-chat/ws",

  // WebSocket
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_BASE: 1000, // ms
  MAX_RECONNECT_DELAY: 30000, // ms

  // Messages
  DEFAULT_MESSAGE_LIMIT: 50,
  MAX_MESSAGE_LIMIT: 200,
  MESSAGE_LOAD_OFFSET: 0,

  // UI
  DEFAULT_AVATAR: "https://bundui-images.netlify.app/avatars/01.png",
  SCROLL_BEHAVIOR: "smooth" as ScrollBehavior,
} as const;

export const CHAT_ERRORS = {
  TOKEN_NOT_FOUND: "Authentication token not found",
  WS_NOT_CONNECTED: "WebSocket is not connected",
  UNAUTHORIZED: "Unauthorized access",
  CONVERSATION_NOT_FOUND: "Conversation not found",
  MESSAGE_NOT_FOUND: "Message not found",
  INVALID_DATA: "Invalid data provided",
  CONNECTION_ERROR: "Connection error",
  MAX_RECONNECT: "Max reconnection attempts reached",
} as const;

export const CHAT_LABELS = {
  // UI Labels
  CHATS: "Чаты",
  SEARCH: "Поиск...",
  WRITE_MESSAGE: "Написать сообщение...",
  SEND: "Отправить",
  ONLINE: "Онлайн",
  OFFLINE: "Оффлайн",
  NO_MESSAGES: "Нет сообщений",
  NO_CONVERSATIONS: "Нет бесед",
  CONVERSATIONS_NOT_FOUND: "Беседы не найдены",
  LOADING: "Загрузка...",
  LOADING_MESSAGES: "Загрузка сообщений...",
  ERROR: "Ошибка",

  // Actions
  CREATE_CONVERSATION: "Создать беседу",
  EDIT_MESSAGE: "Редактировать",
  DELETE_MESSAGE: "Удалить",
  REPLY: "Ответить",

  // Conversation types
  PRIVATE_CHAT: "Приватная беседа",
  GROUP_CHAT: "Групповой чат",

  // Toast messages
  CONVERSATION_CREATED: "Беседа создана",
  MESSAGE_SENT: "Сообщение отправлено",
  MESSAGE_EDITED: "Сообщение отредактировано",
  MESSAGE_DELETED: "Сообщение удалено",
  ERROR_LOADING_CONVERSATIONS: "Ошибка загрузки бесед",
  ERROR_LOADING_MESSAGES: "Ошибка загрузки сообщений",
  ERROR_CREATING_CONVERSATION: "Ошибка создания беседы",
  ERROR_SENDING_MESSAGE: "Ошибка отправки сообщения",
  ERROR_CONNECTION: "Ошибка подключения к чату",
  NO_CONNECTION: "Нет подключения к чату",
} as const;
