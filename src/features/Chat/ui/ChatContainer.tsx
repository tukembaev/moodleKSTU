// ChatContainer.tsx
import { useEffect, useMemo, useState } from "react";
import ChatMessages from "./ChatMessages";
import { ChatSelect } from "./ChatSelect";
import { ChatGroupDetails } from "./ChatGroupDetails";
import {
  getConversations,
  createConversation,
  deleteConversation,
} from "../model/services/chatAPI";
import type { Conversation, Message } from "../model/types/chat";
import { toast } from "sonner";
import { cn } from "shared/lib/utils";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import { Sheet, SheetContent } from "shared/shadcn/ui/sheet";
import { MessageSquare } from "lucide-react";

const ChatContainer = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const isMobile = useIsMobile();

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
    setMobileView("chat");
    setDetailsOpen(false);
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
      setMobileView("chat");
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
        setMobileView("list");
        setDetailsOpen(false);
      }
      toast.success("Беседа удалена");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Ошибка удаления беседы");
    }
  };

  // Оптимистичное обновление lastMessage в conversations
  const handleLastMessageUpdate = (message: Message) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === message.conversation_id) {
          return {
            ...conv,
            last_message: {
              id: message.id,
              sender_id: message.sender_id,
              text: message.text,
              created_at: message.created_at,
            },
          };
        }
        return conv;
      })
    );
  };

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedChatId) || null,
    [conversations, selectedChatId]
  );

  const isGroupChat = selectedConversation?.type === "group";

  useEffect(() => {
    // Детали доступны только для групп
    if (!isGroupChat) setDetailsOpen(false);
  }, [isGroupChat, selectedChatId]);

  const handleBack = () => {
    setMobileView("list");
    setDetailsOpen(false);
  };

  const handleHeaderClick = () => {
    if (!isGroupChat) return;
    setDetailsOpen((v) => !v);
  };

  return (
    <div className="mt-4 w-full rounded-2xl border bg-background shadow-sm overflow-hidden">
      <div className="flex h-[72vh] min-h-[520px]">
        {/* Left (chat list) */}
        <aside
          className={cn(
            "w-full md:w-[340px] shrink-0 border-r bg-background",
            isMobile && mobileView === "chat" && "hidden"
          )}
        >
          <ChatSelect
            className="h-full"
            onSelectChat={handleSelectChat}
            conversations={conversations}
            loading={loading}
            onCreateConversation={handleCreateConversation}
            onDeleteConversation={handleDeleteConversation}
            selectedChatId={selectedChatId}
          />
        </aside>

        {/* Center (messages) */}
        <section
          className={cn(
            "flex-1 min-w-0 bg-muted/5",
            isMobile && mobileView === "list" && "hidden"
          )}
        >
          {selectedConversation && selectedChatId ? (
            <ChatMessages
              conversationId={selectedChatId}
              conversation={selectedConversation}
              onLastMessageUpdate={handleLastMessageUpdate}
              onHeaderClick={isGroupChat ? handleHeaderClick : undefined}
              showBackButton={isMobile}
              onBack={handleBack}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center px-6">
              <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                <MessageSquare className="size-6 text-muted-foreground" />
              </div>
              <div className="text-base font-semibold">Выберите чат</div>
              <div className="text-sm text-muted-foreground">
                Слева выберите беседу, чтобы открыть переписку
              </div>
            </div>
          )}
        </section>

        {/* Right (group details) - desktop only */}
        {!isMobile && isGroupChat && detailsOpen && selectedConversation && selectedChatId && (
          <aside className="w-[360px] shrink-0 border-l bg-background">
            <ChatGroupDetails
              className="h-full"
              conversationId={selectedChatId}
              conversation={selectedConversation}
              onClose={() => setDetailsOpen(false)}
            />
          </aside>
        )}
      </div>

      {/* Group details on mobile (Sheet) */}
      {isMobile && isGroupChat && selectedConversation && selectedChatId && (
        <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
          <SheetContent side="right" className="p-0">
            <ChatGroupDetails
              className="h-full"
              conversationId={selectedChatId}
              conversation={selectedConversation}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ChatContainer;
