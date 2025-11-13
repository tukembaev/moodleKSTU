import { ChatContainer } from "features/Chat";
import { useAuth } from "shared/hooks";

const ChatPage = () => {
  const { id } = useAuth();
  return (
    <div className="flex flex-col">
      <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
        Мои переписки
      </h2>
      <p className="mt-1.5 text-lg text-muted-foreground mb-4">
        Все переписки, которые вы создавали
      </p>
      <ChatContainer />
    </div>
  );
};

export default ChatPage;
