import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LucideCheck, LucideCheckCheck } from "lucide-react";
import React, { useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { Input } from "shared/shadcn/ui/input";

interface Message {
  text: string;
  author: string;
  avatar: string;
  date: Date;
  status: "sent" | "read";
}

const msgData: Message[] = [
  {
    text: "Привет, как дела с курсом?",
    author: "arif",
    avatar: "ava",
    date: new Date("2025-05-24T22:21:00"),
    status: "read",
  },
  {
    text: "Все отличноQZ, только начал!",
    author: "me",
    avatar: "ava2",
    date: new Date("2025-05-24T22:24:00"),
    status: "sent",
  },
  {
    text: "Круто, как тебе материалы?",
    author: "arif",
    avatar: "ava",
    date: new Date("2025-05-24T22:25:00"),
    status: "read",
  },
  {
    text: "Очень понятно, особенно лекции!",
    author: "me",
    avatar: "ava2",
    date: new Date("2025-05-24T22:27:00"),
    status: "read",
  },
  {
    text: "А тесты уже пробовал?",
    author: "arif",
    avatar: "ava",
    date: new Date("2025-05-24T22:30:00"),
    status: "sent",
  },
  {
    text: "Да, прошел один, но сложновато.",
    author: "me",
    avatar: "ava2",
    date: new Date("2025-05-24T22:32:00"),
    status: "sent",
  },
  {
    text: "Не переживай, могу подсказать!",
    author: "arif",
    avatar: "ava",
    date: new Date("2025-05-24T22:35:00"),
    status: "read",
  },
];

export function SetChat({
  id,
  children,
}: {
  text: string;
  id?: string;
  children: React.ReactNode;
}) {
  const { mutate: comment_answer, isPending } = courseQueries.rate_answer();
  const [note, setNote] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const [isOpen, setIsOpen] = useState(false);
  const { avatar, email, first_name } = useAuth();

  // useEffect(() => {
  //   if (isOpen && messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [isOpen]);

  const handleSubmit = () => {
    if (note.trim()) {
      comment_answer({ answer: id as string, comment: note });
      setNote("");
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // чуть позже, чтобы DOM успел обновиться
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 w-100">
        <DropdownMenuLabel className="mb-2 text-center flex gap-2">
          <img
            src={avatar}
            className="size-10 rounded-full mt-1 object-cover"
          />
          <div className="flex flex-col text-left">
            <h2 className="text-lg flex gap-4">
              {first_name}
              <Badge
                variant="outline"
                className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
              >
                ПИ-2-18
              </Badge>
            </h2>
            <h4 className="text-xs text-muted-foreground">{email}</h4>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto space-y-2 p-2">
          {msgData.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-2",
                item.author === "me" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-2 text-sm",
                  item.author === "me"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-black"
                )}
              >
                <p>{item.text}</p>
                <div
                  className={cn(
                    "text-xs mt-1 flex gap-1",
                    item.author === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <span>
                    {format(item.date, "dd MMM HH:mm", { locale: ru })}
                  </span>
                  {item.author === "me" && (
                    <span>
                      {item.status === "read" ? (
                        <LucideCheckCheck className="w-4 h-4 text-blue-500" />
                      ) : (
                        <LucideCheck className="w-4 h-4 text-gray-500" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 items-center mt-1">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Написать замечание..."
            className="text-sm max-h-11"
          />
          <Button
            className="w-full flex gap-2"
            variant={"outline"}
            disabled={isPending || !note.trim()}
            onClick={handleSubmit}
          >
            <LuSend />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
