// ChatMessages.tsx
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LucideCheck, LucideCheckCheck } from "lucide-react";
import { useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

interface Message {
  text: string;
  author: string;
  avatar: string;
  date: Date;
  status: "sent" | "read";
}

interface ChatMessagesProps {
  idChat: number;
}

const initialMessages: Record<number, Message[]> = {
  1: [
    {
      text: "Привет, как дела с курсом?",
      author: "arif",
      avatar: "",
      date: new Date(),
      status: "read",
    },
    {
      text: "Все отлично!",
      author: "me",
      avatar: "",
      date: new Date(),
      status: "sent",
    },
  ],
  2: [
    {
      text: "Woohoo!",
      author: "Isabella",
      avatar: "",
      date: new Date(),
      status: "read",
    },
  ],
  3: [],
};

const ChatMessages = ({ idChat }: ChatMessagesProps) => {
  const [note, setNote] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (note.trim()) {
      //   onSend(note);
      setNote("");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-2 text-center flex gap-2 items-center">
        <img
          src={"https://bundui-images.netlify.app/avatars/01.png"}
          className="size-8 sm:size-10 rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col text-left min-w-0 flex-1">
          <h2 className="text-base sm:text-lg flex flex-wrap gap-2 sm:gap-4 items-center">
            <span className="truncate">Ариф Тукембаев</span>
            <Badge
              variant="outline"
              className="flex gap-1 px-1 sm:px-1.5 text-muted-foreground [&_svg]:size-3 text-xs shrink-0"
            >
              ПИ-2-18
            </Badge>
          </h2>
          <h4 className="text-[10px] sm:text-xs text-muted-foreground truncate">
            tukembaev.arif@gmail.com
          </h4>
        </div>
      </div>
      <div className="h-64 sm:h-96 overflow-y-auto space-y-2 p-2 sm:p-2 sm:pr-4 border rounded-xl">
        {(initialMessages[idChat] ?? []).map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-2",
              item.author === "me" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm",
                item.author === "me"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-black"
              )}
            >
              <p className="break-words">{item.text}</p>
              <div
                className={cn(
                  "text-[10px] sm:text-xs mt-1 flex gap-1 items-center",
                  item.author === "me" ? "justify-end" : "justify-start"
                )}
              >
                <span>{format(item.date, "dd MMM HH:mm", { locale: ru })}</span>
                {item.author === "me" && (
                  <span>
                    {item.status === "read" ? (
                      <LucideCheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    ) : (
                      <LucideCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 items-center mt-2">
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Написать сообщение..."
          className="text-sm sm:text-base"
        />
        <Button onClick={handleSubmit} variant="outline" size="icon" className="shrink-0">
          <LuSend className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatMessages;
