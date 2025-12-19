// ChatSelect.tsx

import { Plus, Loader2, Users, User, Trash2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import { Label } from "shared/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import type { Conversation } from "../model/types/chat";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "shared/lib/utils";
import { UserAsyncSelect } from "./UserAsyncSelect";
import { UserAsyncMultiSelect } from "./UserAsyncMultiSelect";
import UseConfirmationDialog from "shared/components/UseConfirmationDialog";
import { Tabs, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import { useAuth } from "shared/hooks/useAuthData";

interface ChatSelectProps {
  onSelectChat: (chatId: string) => void;
  conversations: Conversation[];
  loading: boolean;
  onCreateConversation: (
    type: "private" | "group",
    title?: string,
    participantIds?: number[]
  ) => Promise<Conversation | null>;
  onDeleteConversation: (chatId: string) => Promise<void>;
  selectedChatId: string | null;
  className?: string;
}

export function ChatSelect({
  onSelectChat,
  conversations,
  loading,
  onCreateConversation,
  onDeleteConversation,
  selectedChatId,
  className,
}: ChatSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newChatType, setNewChatType] = useState<"private" | "group">("group");
  const [newChatTitle, setNewChatTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "private" | "group">("all");
  const auth = useAuth();

  // Фильтрация бесед по поисковому запросу
  const filteredConversations = conversations
    .filter((conv) => {
      if (filter === "all") return true;
      return conv.type === filter;
    })
    .filter((conv) => {
    const title = conv.title || "Без названия";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Создание новой беседы
  const handleCreateChat = async () => {
    if (newChatType === "group" && !newChatTitle.trim()) {
      return;
    }

    if (newChatType === "private" && !selectedUser) {
      return;
    }

    if (newChatType === "group" && selectedUsers.length === 0) {
      return;
    }

    setCreating(true);
    try {
      const participantIds =
        newChatType === "private"
          ? selectedUser
            ? [selectedUser]
            : []
          : selectedUsers;

      await onCreateConversation(
        newChatType,
        newChatTitle.trim() || undefined,
        participantIds
      );
      setIsCreateDialogOpen(false);
      setNewChatTitle("");
      setSelectedUser(null);
      setSelectedUsers([]);
    } finally {
      setCreating(false);
    }
  };

  // Удаление беседы
  const handleDeleteChat = async (chatId: string) => {
    try {
      setDeletingChatId(chatId);
      await onDeleteConversation(chatId);
    } finally {
      setDeletingChatId(null);
    }
  };

  // Форматирование времени
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return format(date, "HH:mm", { locale: ru });
    } else if (diffDays === 1) {
      return "Вчера";
    } else if (diffDays < 7) {
      return format(date, "EEEEEE", { locale: ru });
    } else {
      return format(date, "dd.MM.yy", { locale: ru });
    }
  };

  return (
    <div className={cn("flex h-full min-w-0 flex-col", className)}>
      {/* Top user/info + actions */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback>
                {(auth?.first_name?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold leading-tight">
                {auth?.first_name ? `${auth.first_name} ${auth.last_name ?? ""}` : "Мой аккаунт"}
              </div>
              <div className="truncate text-xs text-muted-foreground">Info account</div>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-9 w-9">
                <Plus className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Создать беседу</DialogTitle>
                <DialogDescription>
                  Создайте новую приватную беседу или групповой чат
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Тип
                  </Label>
                  <Select
                    value={newChatType}
                    onValueChange={(value: "private" | "group") => setNewChatType(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Приватная
                        </div>
                      </SelectItem>
                      <SelectItem value="group">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Групповая
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newChatType === "group" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Название
                    </Label>
                    <Input
                      id="title"
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      placeholder="Название беседы"
                      className="col-span-3"
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="participants" className="text-right">
                    {newChatType === "private" ? "Участник" : "Участники"}
                  </Label>
                  <div className="col-span-3">
                    {newChatType === "private" ? (
                      <UserAsyncSelect
                        value={selectedUser}
                        onChange={setSelectedUser}
                        placeholder="Выберите пользователя"
                      />
                    ) : (
                      <UserAsyncMultiSelect
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                        placeholder="Выберите участников"
                      />
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleCreateChat}
                  disabled={
                    creating ||
                    (newChatType === "group" &&
                      (!newChatTitle.trim() || selectedUsers.length === 0)) ||
                    (newChatType === "private" && !selectedUser)
                  }
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    "Создать"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="private">Personal</TabsTrigger>
              <TabsTrigger value="group">Groups</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex w-full items-center">
          <Input
            placeholder="Поиск..."
            className="w-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4">
          <p className="text-sm text-muted-foreground text-center">
            {searchQuery ? "Беседы не найдены" : "Нет бесед"}
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredConversations.map((conversation) => {
              const isSelected = selectedChatId === conversation.id;
              const displayTitle =
                conversation.title ||
                (conversation.type === "group" ? "Групповой чат" : "Беседа");

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "group cursor-pointer flex items-center gap-3 px-4 py-3 relative hover:bg-muted/40",
                    isSelected && "bg-muted/40"
                  )}
                  onClick={() => onSelectChat(conversation.id)}
                >
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="bg-muted">
                      {conversation.type === "group" ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 grow">
                    <div className="flex justify-between gap-2">
                      <span className="text-sm font-medium truncate">{displayTitle}</span>
                      <span className="text-muted-foreground text-xs shrink-0">
                        {conversation.last_message
                          ? formatTime(conversation.last_message.created_at)
                          : formatTime(conversation.created_at)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-muted-foreground truncate text-xs">
                      {conversation.last_message?.text ??
                        (conversation.type === "group" ? "Групповой чат" : "Приватная беседа")}
                    </div>
                  </div>

                  <UseConfirmationDialog
                    title="Удалить беседу?"
                    description="Это действие нельзя отменить. Беседа и все сообщения будут удалены."
                    onConfirm={() => handleDeleteChat(conversation.id)}
                    trigger={
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        disabled={deletingChatId === conversation.id}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {deletingChatId === conversation.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    }
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
