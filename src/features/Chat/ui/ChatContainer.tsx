// ChatContainer.tsx
import { useState } from "react";
import ChatMessages from "./ChatMessages";
import { ChatSelect } from "./ChatSelect";


const ChatContainer = () => {
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
