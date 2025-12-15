// chatQueries.ts - React Query hooks для чата
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getConversationById,
  createConversation,
  deleteConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addParticipant,
  removeParticipant,
} from "./chatAPI";
import type {
  CreateConversationRequest,
  SendMessageRequest,
  EditMessageRequest,
  AddParticipantRequest,
} from "../types/chat";

// Query keys
export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  conversation: (id: string) => [...chatKeys.all, "conversation", id] as const,
  messages: (conversationId: string) =>
    [...chatKeys.all, "messages", conversationId] as const,
};

// ========== Conversations Hooks ==========

/**
 * Получить список всех бесед
 */
export const useConversations = () => {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: getConversations,
  });
};

/**
 * Получить беседу по ID
 */
export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: chatKeys.conversation(conversationId),
    queryFn: () => getConversationById(conversationId),
    enabled: !!conversationId,
  });
};

/**
 * Создать беседу
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationRequest) => createConversation(data),
    onSuccess: () => {
      // Инвалидируем список бесед
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
};

/**
 * Удалить беседу
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      // Инвалидируем список бесед и конкретную беседу
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      queryClient.removeQueries({ queryKey: chatKeys.conversation(conversationId) });
    },
  });
};

// ========== Messages Hooks ==========

/**
 * Получить сообщения беседы
 */
export const useMessages = (conversationId: string, limit = 50, offset = 0) => {
  return useQuery({
    queryKey: [...chatKeys.messages(conversationId), limit, offset],
    queryFn: () => getMessages(conversationId, limit, offset),
    enabled: !!conversationId,
  });
};

/**
 * Отправить сообщение (REST API)
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => sendMessage(data),
    onSuccess: (_, variables) => {
      // Инвалидируем сообщения для этой беседы
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.conversation_id),
      });
    },
  });
};

/**
 * Редактировать сообщение
 */
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      data,
    }: {
      messageId: string;
      data: EditMessageRequest;
    }) => editMessage(messageId, data),
    onSuccess: () => {
      // Инвалидируем все сообщения (можно оптимизировать)
      queryClient.invalidateQueries({ queryKey: [...chatKeys.all, "messages"] });
    },
  });
};

/**
 * Удалить сообщение
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: () => {
      // Инвалидируем все сообщения
      queryClient.invalidateQueries({ queryKey: [...chatKeys.all, "messages"] });
    },
  });
};

// ========== Participants Hooks ==========

/**
 * Добавить участника
 */
export const useAddParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: AddParticipantRequest;
    }) => addParticipant(conversationId, data),
    onSuccess: (_, variables) => {
      // Инвалидируем конкретную беседу
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversation(variables.conversationId),
      });
    },
  });
};

/**
 * Удалить участника
 */
export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: number;
    }) => removeParticipant(conversationId, userId),
    onSuccess: (_, variables) => {
      // Инвалидируем конкретную беседу
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversation(variables.conversationId),
      });
    },
  });
};
