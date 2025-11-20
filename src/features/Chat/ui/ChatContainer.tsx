// ChatContainer.tsx
import { useState } from "react";
import { useAuth } from "shared/hooks";
import { ChatSelect } from "./ChatSelect";
import ChatMessages from "./ChatMessages";

interface ChatContainerProps {
  idChat?: number;
}

const ChatContainer = () => {
  const auth = useAuth();
  const isStudent = auth?.isStudent;
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <ChatSelect onSelectChat={handleSelectChat} />
      {selectedChatId && (
        <div className="w-full sm:w-3/5">
          <ChatMessages idChat={selectedChatId} />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
