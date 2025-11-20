// ChatSelect.tsx

import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";

// ChatSelect.tsx
interface Chat {
  id: number;
  name: string;
  avatar: string;
  message: string;
  time: string;
  unread: number;
}

interface ChatSelectProps {
  onSelectChat: (chatId: number) => void;
}

export function ChatSelect({ onSelectChat }: ChatSelectProps) {
  const location = useLocation();
  console.log(location.pathname.includes("course_theme"));
  const chats: Chat[] = [
    {
      id: 1,
      name: "Olivia Martin",
      message: "Hi!",
      time: "Yesterday",
      unread: 1,
      avatar: "https://bundui-images.netlify.app/avatars/01.png",
    },
    {
      id: 2,
      name: "Isabella Nguyen",
      message: "Wohoo!",
      time: "Yesterday",
      unread: 0,
      avatar: "https://bundui-images.netlify.app/avatars/02.png",
    },
    {
      id: 3,
      name: "Emma Wilson",
      message: "What seems to be the problem?",
      time: "Yesterday",
      unread: 3,
      avatar: "https://bundui-images.netlify.app/avatars/03.png",
    },
  ];

  return (
    <Card className="bg-card flex flex-col gap-4 sm:gap-6 rounded-xl border py-4 sm:py-6 shadow-sm pb-0 w-full sm:w-2/5">
      <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-1.5 px-4 sm:px-6 pb-0">
        <CardTitle className="leading-none font-semibold text-base sm:text-lg">Чаты</CardTitle>
        <Button size="icon" variant="ghost" className="-mt-2 h-8 w-8 sm:h-10 sm:w-10">
          <Plus className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <form className="mb-4 flex w-full items-center space-x-2 px-4 sm:px-6">
          <Input placeholder="Поиск..." className="flex-1 text-sm sm:text-base" />
        </form>
        <ScrollArea className="h-64 sm:h-80">
          <div className="divide-y">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="group hover:bg-muted/50 cursor-pointer flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3"
              >
                <Avatar className="size-7 sm:size-8 shrink-0">
                  <AvatarImage src={chat.avatar} />
                </Avatar>
                <div className="min-w-0 grow">
                  <div className="flex justify-between gap-2">
                    <span className="text-xs sm:text-sm font-medium truncate">{chat.name}</span>
                    <span className="text-muted-foreground text-xs shrink-0">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground truncate text-start text-xs sm:text-sm">
                      {chat.message}
                    </span>
                    {chat.unread > 0 && (
                      <div className="ms-auto flex size-4 sm:size-5 items-center justify-center rounded-full bg-green-500 text-[10px] sm:text-xs text-white shrink-0">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
