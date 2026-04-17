import { useQuery } from "@tanstack/react-query";
import { remarksQueries, RemarkStatus } from "entities/Remarks";
import React, { useMemo, useState } from "react";
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
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { ReviewThread, remarkToReview } from "./ReviewThread";

interface SetCommentProps {
  text: string;
  /** Идентификатор ответа (answer.id) — используется как title замечания при создании */
  id?: string;
  /** ID темы, по которой идёт замечание */
  theme_id?: string | null;
  /** ID студента (user_id), которому ставится замечание */
  student_id?: number | null;
  children: React.ReactNode;
}

export function SetComment({
  text,
  id,
  theme_id,
  student_id,
  children,
}: SetCommentProps) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const { data: remarks, isLoading } = useQuery({
    ...remarksQueries.byThemeAndStudent(theme_id ?? null, student_id ?? null),
    enabled: open && !!theme_id && student_id !== null && student_id !== undefined,
  });

  const { mutate: createRemark, isPending: isCreating } =
    remarksQueries.create_remark();
  const { mutate: addMessage, isPending: isAdding } =
    remarksQueries.add_message();
  const { mutate: updateStatus } = remarksQueries.update_status();

  const isPending = isCreating || isAdding;

  const reviews = useMemo(
    () => (remarks ?? []).map(remarkToReview),
    [remarks]
  );

  const activeRemark = useMemo(() => {
    return (remarks ?? []).find(
      (r) =>
        r.status !== RemarkStatus.APPROVED
    );
  }, [remarks]);

  const handleSubmit = () => {
    if (!note.trim()) return;

    if (activeRemark) {
      addMessage(
        { id: activeRemark.id, data: { message: note } },
        {
          onSuccess: () => setNote(""),
        }
      );
    } else if (theme_id && student_id !== null && student_id !== undefined) {
      createRemark(
        {
          theme_id,
          student_id,
          title: text || "Замечание",
          message: note,
        },
        {
          onSuccess: () => setNote(""),
        }
      );
    }
  };

  const handleApprove = (reviewId: string) => {
    updateStatus({
      id: reviewId,
      data: { status: RemarkStatus.APPROVED },
    });
  };

  const handleReject = (reviewId: string, message: string) => {
    addMessage(
      { id: reviewId, data: { message } },
      {
        onSuccess: () => {
          updateStatus({
            id: reviewId,
            data: { status: RemarkStatus.REJECTED },
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-base font-semibold">{text}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] px-4 pt-2">
          {isLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Замечаний пока нет — напишите первое сообщение ниже.
              </p>
            </div>
          ) : (
            <ReviewThread
              reviews={reviews}
              onApprove={handleApprove}
              onReject={handleReject}
              showTeacherActions={true}
            />
          )}
        </ScrollArea>

        <div className="px-6 py-4 border-t shrink-0">
          <div className="flex gap-2">
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                activeRemark
                  ? "Ответить в текущее замечание..."
                  : "Написать новое замечание..."
              }
              className="text-sm h-9"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={!theme_id || student_id === null || student_id === undefined}
            />
            <Button
              size="sm"
              variant="default"
              disabled={
                isPending ||
                !note.trim() ||
                !theme_id ||
                student_id === null ||
                student_id === undefined
              }
              onClick={handleSubmit}
              className="h-9 px-3 shrink-0"
            >
              <LuSend className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ID ответа (answer) пока не используется для замечаний через /remarks, но сохраняется как маркер строки */}
        {id ? null : null}
      </DialogContent>
    </Dialog>
  );
}
