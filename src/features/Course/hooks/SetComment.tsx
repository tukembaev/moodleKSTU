import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { Wallet } from "lucide-react";
import React, { useState } from "react";
import { LuSend } from "react-icons/lu";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { Input } from "shared/shadcn/ui/input";

const activities = [
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
];

export function SetComment({
  text,
  id,
  children,
}: {
  text: string;
  id?: string;
  children: React.ReactNode;
}) {
  const { mutate: comment_answer, isPending } = courseQueries.rate_answer();
  const [note, setNote] = useState("");
  const handleSubmit = () => {
    comment_answer({
      answer: id as string,
      comment: note,
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="p-4">
        <DropdownMenuLabel className="mb-2 text-center">
          {text}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-64 overflow-y-auto space-y-2 ">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={cn(
                "group flex items-center gap-3",
                "p-2 rounded-lg",
                "transition-all duration-200"
              )}
            >
              <div className={cn("p-2 rounded-lg")}>
                <activity.icon className="w-4 h-4" />
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
