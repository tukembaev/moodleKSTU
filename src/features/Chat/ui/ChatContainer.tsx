// ChatContainer.tsx
import { useState } from "react";
import { ChatSelect } from "./ChatSelect";
import ChatMessages from "./ChatMessages";

const ChatContainer = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="flex gap-4">
      {/* <h1 className="text-3xl">
        Бекс дает если студент в api course новый ключ с id чата его с преподом
        Если препод то я просто беру id курса и вывожу список Если это мои
        личные переписки я тяну по id всех переписок
      </h1> */}
      <ChatSelect onSelectChat={handleSelectChat} />
      {selectedChatId && (
        <div className="w-3/5">
          <ChatMessages idChat={selectedChatId} />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
