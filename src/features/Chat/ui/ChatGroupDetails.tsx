import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, Loader2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import { getConversationById, getParticipants, removeParticipant, getCurrentUserId } from "../model/services/chatAPI";
import type { Conversation, Participant } from "../model/types/chat";
import { Trash2 } from "lucide-react";

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
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [details, setDetails] = useState<ConversationDetails | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const currentUserId = getCurrentUserId();

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

    async function loadParticipants() {
      try {
        setParticipantsLoading(true);
        const data = await getParticipants(conversationId);
        if (!cancelled) setParticipants(data);
      } catch (e) {
        console.error(e);
        toast.error("Не удалось загрузить список участников");
      } finally {
        if (!cancelled) setParticipantsLoading(false);
      }
    }

    load();
    loadParticipants();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  const isAdmin = useMemo(() => {
    if (!currentUserId || !participants.length) return false;
    const me = participants.find(p => p.user_id === currentUserId);
    return me?.role === 'admin';
  }, [currentUserId, participants]);

  const handleRemoveParticipant = async (userId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого участника?")) return;

    try {
      await removeParticipant(conversationId, userId);
      setParticipants(prev => prev.filter(p => p.user_id !== userId));
      toast.success("Участник удален");
    } catch (e) {
      console.error(e);
      toast.error("Не удалось удалить участника");
    }
  };

  const title =
    conversation.title || (conversation.type === "group" ? "Групповой чат" : "Беседа");

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
              {participantsLoading ? (
                <span className="text-xs text-muted-foreground">...</span>
              ) : (
                <span className="text-xs text-muted-foreground">{membersCount}</span>
              )}
            </div>

            <div className="rounded-xl border bg-muted/20 p-3">
              {participantsLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Загружаем участников...
                </div>
              ) : membersCount === 0 ? (
                <div className="text-sm text-muted-foreground">Нет данных об участниках</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex -space-x-2">
                    {participants.slice(0, 6).map((p) => (
                      <Avatar key={p.user_id} className="size-7 border">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback className="text-[10px] bg-background">
                          {p.first_name?.[0] || String(p.user_id).slice(-2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {membersCount > 6 && (
                      <div className="flex items-center ml-4 text-xs text-muted-foreground">
                        +{membersCount - 6} еще
                      </div>
                    )}
                  </div>
                  <div className="divide-y rounded-lg border bg-background">
                    {participants.map((p) => (
                      <div
                        key={p.user_id}
                        className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={p.avatar} />
                            <AvatarFallback>
                              {p.first_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium whitespace-nowrap">
                                {p.first_name} {p.last_name}
                              </span>
                              {p.role === "admin" && (
                                <span className="text-[10px] font-bold uppercase text-blue-500 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded leading-none">
                                  admin
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              ID {p.user_id}
                            </span>
                          </div>
                        </div>

                        {isAdmin && p.user_id !== currentUserId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveParticipant(p.user_id)}
                            title="Удалить из группы"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
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


