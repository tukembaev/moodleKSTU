import { $api2 } from 'shared/api/api2';
// chatAPI.ts - REST API сервис для чата
import axios from "axios";
import { refreshUser } from "features/Authorization/model/services/loginAPI";
import type {
  AddParticipantRequest,
  Attachment,
  ChatUser,
  Conversation,
  CreateAttachmentRequest,
  CreateConversationRequest,
  EditMessageRequest,
  Message,
  Participant,
  SendMessageRequest,
} from "../types/chat";

export const CHAT_API_URL = `https://uadmin.kstu.kg/api/unet-chat/`;

// Создаем отдельный axios instance для чата
const chatApiInstance = axios.create({
  baseURL: CHAT_API_URL,
});



// Интерсептор для добавления токена
chatApiInstance.interceptors.request.use((config) => {
  const auth_data = JSON.parse(localStorage.getItem("auth_data") || "{}");
  config.headers.Authorization = `Bearer ${auth_data.access}`
  return config;
});

// Интерсептор для обновления токена при 401
chatApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access in chatAPI.ts");
      try {
        const newTokens = await refreshUser();
        const authData = JSON.parse(localStorage.getItem("auth_data") || "{}");
        const updatedAuthData = { ...authData, access: newTokens.access };
        localStorage.setItem("auth_data", JSON.stringify(updatedAuthData));
        window.dispatchEvent(new Event("storage"));
        error.config.headers["Authorization"] = `Bearer ${newTokens.access}`;
        return axios.request(error.config);
      } catch (refreshError) {
        console.error("Refresh token failed, logging out...", refreshError);
        localStorage.setItem(
          "refresh_error",
          "Refresh токен устарел, перезайдите в систему"
        );
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ========== Conversations API ==========

/**
 * Создать новую беседу
 */
export const createConversation = async (
  data: CreateConversationRequest
): Promise<Conversation> => {
  const response = await chatApiInstance.post<Conversation>("conversations/", data);
  return response.data;
};

/**
 * Получить список всех бесед пользователя
 */
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await chatApiInstance.get<Conversation[]>("conversations/");
  return response.data;
};

/**
 * Получить беседу по ID
 */
export const getConversationById = async (conversationId: string): Promise<Conversation> => {
  const response = await chatApiInstance.get<Conversation>(`conversations/${conversationId}`);
  return response.data;
};

/**
 * Удалить беседу
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
  await chatApiInstance.delete(`conversations/${conversationId}`);
};

// ========== Messages API ==========

/**
 * Отправить сообщение (REST API)
 */
export const sendMessage = async (data: SendMessageRequest): Promise<Message> => {
  const response = await chatApiInstance.post<Message>("messages/", data);
  return response.data;
};

/**
 * Получить список сообщений беседы
 */
export const getMessages = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> => {
  const response = await chatApiInstance.get<Message[]>(`messages/${conversationId}`, {
    params: { limit, offset },
  });
  return response.data;
};

/**
 * Редактировать сообщение
 */
export const editMessage = async (
  messageId: string,
  data: EditMessageRequest
): Promise<Message> => {
  const response = await chatApiInstance.put<Message>(`messages/${messageId}`, data);
  return response.data;
};

/**
 * Удалить сообщение
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
  await chatApiInstance.delete(`messages/${messageId}`);
};

// ========== Participants API ==========

/**
 * Получить список участников беседы
 */
export const getParticipants = async (conversationId: string): Promise<Participant[]> => {
  const response = await chatApiInstance.get<Participant[]>(
    `conversations/${conversationId}/participants`
  );
  return response.data;
};

/**
 * Добавить участника в беседу
 */
export const addParticipant = async (
  conversationId: string,
  data: AddParticipantRequest
): Promise<Participant> => {
  const response = await chatApiInstance.post<Participant>(
    `conversations/${conversationId}/participants/`,
    data
  );
  return response.data;
};

/**
 * Удалить участника из беседы
 */
export const removeParticipant = async (
  conversationId: string,
  userId: number
): Promise<void> => {
  await chatApiInstance.delete(`conversations/${conversationId}/participants/${userId}`);
};

// ========== Attachments API ==========

/**
 * Загрузить вложение
 */
export const createAttachment = async (
  data: CreateAttachmentRequest
): Promise<Attachment> => {
  const response = await chatApiInstance.post<Attachment>("attachments/", data);
  return response.data;
};

// ========== Users API ==========

/**
 * Получить список пользователей для чата
 */
export const getChatUsers = async (): Promise<ChatUser[]> => {
  const response = await $api2.get<ChatUser[]>("v1/users/chat-users/");
  return response.data;
};

// ========== Вспомогательные функции ==========

/**
 * Получить JWT токен из localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    const auth_data = JSON.parse(localStorage.getItem("auth_data") || "{}");
    return auth_data.access || null;
  } catch {
    return null;
  }
};

/**
 * Получить текущий ID пользователя
 */
export const getCurrentUserId = (): number | null => {
  try {
    const auth_data = JSON.parse(localStorage.getItem("auth_data") || "{}");
    return auth_data.user_id || null;
  } catch {
    return null;
  }
};
