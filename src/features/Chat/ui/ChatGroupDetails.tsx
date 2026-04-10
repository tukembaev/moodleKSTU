import { useMemo } from "react";
import { Copy, Link2, Loader2, Users, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { getCurrentUserId } from "../model/services/chatAPI";
import { useConversation, useParticipants, useRemoveParticipant } from "../model/services/chatQueries";
import type { Conversation } from "../model/types/chat";

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
  const currentUserId = getCurrentUserId();

  const { data: details, isLoading: loading } = useConversation(conversationId);
  const { data: participants = [], isLoading: participantsLoading } = useParticipants(conversationId);
  const { mutateAsync: removeParticipantMutation } = useRemoveParticipant();

  const isAdmin = useMemo(() => {
    if (!currentUserId || !participants.length) return false;
    const me = participants.find(p => p.user_id === currentUserId);
    return me?.role === 'admin';
  }, [currentUserId, participants]);

  const handleRemoveParticipant = async (userId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого участника?")) return;

    try {
      await removeParticipantMutation({ conversationId, userId });
      toast.success("Участник удален");
    } catch (e) {
      console.error(e);
      toast.error("Не удалось удалить участника");
    }
  };

  const title =
    details?.title || conversation.title || (conversation.type === "group" ? "Групповой чат" : "Беседа");

  const membersCount = participants.length;

  const shareLink = useMemo(() => {
    return details?.link || details?.service_id || details?.id || conversationId;
  }, [conversationId, details?.id, details?.link, details?.service_id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(String(shareLink));
      toast.success("Скопировано");
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  return (
    <div className={cn("flex h-full min-w-0 flex-col bg-background", className)}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-semibold">Информация по группе</p>
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
              {participantsLoading ? "Загрузка..." : `${membersCount} участник(ов)`}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto min-h-0">
        <div className="space-y-5 px-4 pb-5">
          <section className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Описание</div>
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
            <div className="text-xs font-medium text-muted-foreground">Ссылка на группу</div>
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
              <div className="text-xs font-medium text-muted-foreground">Участники</div>
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
                participants.map((p) => (
                  <div
                    key={p.user_id}
                    className="flex items-center justify-between py-2 text-sm hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback>
                          {p.first_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
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
                        className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleRemoveParticipant(p.user_id)}
                        title="Удалить из группы"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}



