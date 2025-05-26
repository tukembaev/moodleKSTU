import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LucideWandSparkles } from "lucide-react";
import React, { useState } from "react";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { Textarea } from "shared/shadcn/ui/textarea";

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
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Написать замечание..."
          className="text-sm mt-4"
        />
        <Button
          className="w-full mt-5 flex gap-2"
          variant={"outline"}
          disabled={isPending}
          onClick={() => handleSubmit()}
        >
          Отправить
          <LucideWandSparkles />
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
