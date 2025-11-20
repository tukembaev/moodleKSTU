import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import React, { useState } from "react";
import { LuSend } from "react-icons/lu";
import { Button } from "shared/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import { Input } from "shared/shadcn/ui/input";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { ReviewThread, mockReviews } from "./ReviewThread";

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
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!note.trim()) return;
    
    // TODO: Отправка нового замечания
    comment_answer({
      answer: id as string,
      comment: note,
    });
    setNote("");
  };

  const handleApprove = (reviewId: string) => {
    // TODO: API call для одобрения
    console.log("Approve review:", reviewId);
  };

  const handleReject = (reviewId: string, message: string) => {
    // TODO: API call для отклонения с комментарием
    console.log("Reject review:", reviewId, "message:", message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-base font-semibold">{text}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] px-4 pt-2">
          <ReviewThread
            reviews={mockReviews}
            onApprove={handleApprove}
            onReject={handleReject}
            showTeacherActions={true}
          />
        </ScrollArea>

        {/* Форма для добавления нового замечания */}
        <div className="px-6 py-4 border-t shrink-0">
          <div className="flex gap-2">
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Написать замечание..."
              className="text-sm h-9"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              size="sm"
              variant="default"
              disabled={isPending || !note.trim()}
              onClick={handleSubmit}
              className="h-9 px-3 shrink-0"
            >
              <LuSend className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
