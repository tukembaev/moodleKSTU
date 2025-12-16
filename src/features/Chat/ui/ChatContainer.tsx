// ChatContainer.tsx
import { useState, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import { ChatSelect } from "./ChatSelect";
import {
  getConversations,
  createConversation,
  deleteConversation,
} from "../model/services/chatAPI";
import type { Conversation } from "../model/types/chat";
import { toast } from "sonner";

const ChatContainer = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка бесед при монтировании
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Ошибка загрузки бесед");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleCreateConversation = async (
    type: "private" | "group",
    title?: string,
    participantIds?: number[]
  ) => {
    try {
      const newConversation = await createConversation({
        type,
        title: title || null,
        participant_ids: participantIds,
      });
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedChatId(newConversation.id);
      toast.success("Беседа создана");
      return newConversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Ошибка создания беседы");
      return null;
    }
  };

  const handleDeleteConversation = async (chatId: string) => {
    try {
      await deleteConversation(chatId);
      setConversations((prev) => prev.filter((conv) => conv.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
      toast.success("Беседа удалена");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Ошибка удаления беседы");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <ChatSelect
        onSelectChat={handleSelectChat}
        conversations={conversations}
        loading={loading}
        onCreateConversation={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
        selectedChatId={selectedChatId}
      />
      {selectedChatId && (
        <div className="w-full sm:w-3/5">
          <ChatMessages conversationId={selectedChatId} />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
