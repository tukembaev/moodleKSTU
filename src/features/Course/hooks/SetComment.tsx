import { useQuery } from "@tanstack/react-query";
import { remarksQueries, RemarkStatus } from "entities/Remarks";
import { ArrowUpIcon, Check, MessageCircleDashedIcon, X } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "shared/shadcn/ui/input-group";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { RemarkMessageList } from "./RemarkMessageList";
import { remarkToReview, reviewsToThreadMessages } from "./ReviewThread";

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
  theme_id,
  student_id,
  children,
}: SetCommentProps) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

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
  const canSubmit =
    !!theme_id && student_id !== null && student_id !== undefined;

  const reviews = useMemo(
    () => (remarks ?? []).map(remarkToReview),
    [remarks]
  );

  const activeRemark = useMemo(() => {
    return (remarks ?? []).find((r) => r.status !== RemarkStatus.APPROVED);
  }, [remarks]);

  const remarkAwaitingReview = useMemo(() => {
    return reviews.find((review) => review.needs_teacher_action);
  }, [reviews]);

  const threadMessages = useMemo(
    () => reviewsToThreadMessages(reviews),
    [reviews]
  );

  const handleSubmit = () => {
    if (!note.trim()) return;

    if (rejectingId) {
      handleReject(rejectingId, note);
      return;
    }

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

  const startReject = (reviewId: string) => {
    setRejectingId(reviewId);
    composerRef.current?.focus();
  };

  const cancelReject = () => {
    setRejectingId(null);
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
          setRejectingId(null);
          setNote("");
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setRejectingId(null);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-140 max-h-[85vh] w-full max-w-md flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
          <Card className="h-full w-full gap-0 overflow-hidden border-0 shadow-none">
            <CardHeader className="gap-1 border-b pr-12 pb-6">
              <CardTitle>
                <DialogTitle>{text}</DialogTitle>
              </CardTitle>
              <CardDescription>
                <DialogDescription>
                  {remarkAwaitingReview
                    ? "Студент ответил — одобрите работу или отклоните с комментарием."
                    : activeRemark
                      ? "Ответьте в текущее замечание или продолжите переписку."
                      : "Напишите первое замечание — оно появится в переписке."}
                </DialogDescription>
              </CardDescription>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
              {isLoading ? (
                <div className="space-y-3 p-6">
                  <Skeleton className="h-16 w-3/4 rounded-xl" />
                  <Skeleton className="ml-auto h-16 w-2/3 rounded-xl" />
                  <Skeleton className="h-16 w-3/4 rounded-xl" />
                </div>
              ) : threadMessages.length === 0 ? (
                <Empty className="h-full border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageCircleDashedIcon />
                    </EmptyMedia>
                    <EmptyTitle>Замечаний пока нет</EmptyTitle>
                    <EmptyDescription>
                      Напишите первое сообщение ниже, чтобы начать переписку.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <RemarkMessageList
                  messages={threadMessages}
                  ownRole="teacher"
                  isPending={isPending}
                />
              )}
            </CardContent>

            <CardFooter className="flex-col gap-2">
              {remarkAwaitingReview ? (
                <div className="flex w-full gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      rejectingId === remarkAwaitingReview.id
                        ? "secondary"
                        : "outline"
                    }
                    className="h-8 flex-1 text-xs"
                    onClick={() => {
                      if (rejectingId === remarkAwaitingReview.id) {
                        cancelReject();
                        return;
                      }
                      startReject(remarkAwaitingReview.id);
                    }}
                  >
                    {rejectingId === remarkAwaitingReview.id
                      ? "Отмена"
                      : "Отклонить"}
                    <X />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    className="h-8 flex-1 text-xs"
                    onClick={() => {
                      cancelReject();
                      handleApprove(remarkAwaitingReview.id);
                    }}
                  >
                    Одобрить
                    <Check />
                  </Button>
                </div>
              ) : null}
              <form
                className="w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <InputGroup>
                  <InputGroupTextarea
                    ref={composerRef}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={
                      rejectingId
                        ? "Причина отклонения..."
                        : activeRemark
                          ? "Ответить в текущее замечание..."
                          : "Написать новое замечание..."
                    }
                    disabled={!canSubmit}
                    rows={2}
                    className="min-h-14 max-h-32 px-3 py-2.5"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <InputGroupAddon align="block-end" className="pt-1">
                    {rejectingId ? (
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={cancelReject}
                      >
                        <X />
                        <span className="sr-only">Отменить отклонение</span>
                      </InputGroupButton>
                    ) : null}
                    <InputGroupButton
                      type="submit"
                      variant={rejectingId ? "destructive" : "default"}
                      size="icon-sm"
                      disabled={isPending || !note.trim() || !canSubmit}
                      className="ml-auto"
                    >
                      <ArrowUpIcon />
                      <span className="sr-only">
                        {rejectingId ? "Отклонить" : "Отправить"}
                      </span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
            </CardFooter>
          </Card>
      </DialogContent>
    </Dialog>
  );
}
