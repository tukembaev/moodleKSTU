import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, Loader2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import { getConversationById } from "../model/services/chatAPI";
import type { Conversation, Participant } from "../model/types/chat";

type ConversationDetails = Conversation & {
  participants?: Participant[];
  description?: string | null;
  link?: string | null;
};

interface ChatGroupDetailsProps {
  conversationId: string;
  conversation: Conversation;
  onClose?: () => void;
  className?: string;
}

export function ChatGroupDetails({
  conversationId,
  conversation,
  onClose,
  className,
}: ChatGroupDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ConversationDetails | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = (await getConversationById(conversationId)) as ConversationDetails;
        if (!cancelled) setDetails(data);
      } catch (e) {
        console.error(e);
        toast.error("Не удалось загрузить детали группы");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  const title =
    conversation.title || (conversation.type === "group" ? "Групповой чат" : "Беседа");

  const participants = details?.participants ?? [];
  const membersCount = participants.length;

  const shareLink = useMemo(() => {
    // API может не отдавать прямую ссылку. Делаем стабильный "идентификатор" для копирования.
    return details?.link || details?.service_id || details?.id || conversationId;
  }, [conversationId, details?.id, details?.link, details?.service_id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Скопировано");
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  return (
    <div className={cn("flex h-full min-w-0 flex-col bg-background", className)}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-semibold">Detail group</p>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close details">
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="px-4 pt-4">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar className="size-16">
              <AvatarFallback className="bg-muted">
                <Users className="size-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <div className="text-base font-semibold leading-tight">{title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {loading ? "Загрузка..." : `${membersCount} участник(ов)`}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="mt-4 flex-1">
        <div className="space-y-5 px-4 pb-5">
          <section className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Descriptions</div>
            <div className="rounded-xl border bg-muted/20 p-3 text-sm leading-relaxed">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Загружаем описание...
                </div>
              ) : details?.description ? (
                details.description
              ) : (
                <span className="text-muted-foreground">Описание отсутствует</span>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Link group</div>
            <div className="flex items-center gap-2 rounded-xl border bg-muted/20 p-3">
              <Link2 className="size-4 text-muted-foreground" />
              <div className="min-w-0 flex-1 truncate text-sm">{shareLink}</div>
              <Button variant="ghost" size="icon" onClick={handleCopyLink} aria-label="Copy">
                <Copy className="size-4" />
              </Button>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">Member</div>
              {loading ? (
                <span className="text-xs text-muted-foreground">...</span>
              ) : (
                <span className="text-xs text-muted-foreground">{membersCount}</span>
              )}
            </div>

            <div className="rounded-xl border bg-muted/20 p-3">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Загружаем участников...
                </div>
              ) : membersCount === 0 ? (
                <div className="text-sm text-muted-foreground">Нет данных об участниках</div>
              ) : (
                <div className="space-y-2">
                  <div className="flex -space-x-2">
                    {participants.slice(0, 6).map((p) => (
                      <Avatar key={p.user_id} className="size-7 border">
                        <AvatarFallback className="text-[10px] bg-background">
                          {String(p.user_id).slice(-2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {membersCount > 6 && (
                      <div className="ml-3 text-xs text-muted-foreground">
                        +{membersCount - 6}
                      </div>
                    )}
                  </div>
                  <div className="divide-y rounded-lg border bg-background">
                    {participants.slice(0, 20).map((p) => (
                      <div
                        key={p.user_id}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                      >
                        <span className="text-muted-foreground">ID {p.user_id}</span>
                        <span className="text-xs text-muted-foreground">{p.role}</span>
                      </div>
                    ))}
                    {membersCount > 20 && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Показаны первые 20 участников…
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Media</div>
            <div className="rounded-xl border bg-muted/10 p-3">
              <Tabs defaultValue="media" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="links">Link</TabsTrigger>
                  <TabsTrigger value="docs">Docs</TabsTrigger>
                </TabsList>
                <TabsContent value="media" className="pt-3">
                  <div className="text-sm text-muted-foreground">Нет медиа</div>
                </TabsContent>
                <TabsContent value="links" className="pt-3">
                  <div className="text-sm text-muted-foreground">Нет ссылок</div>
                </TabsContent>
                <TabsContent value="docs" className="pt-3">
                  <div className="text-sm text-muted-foreground">Нет документов</div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}


