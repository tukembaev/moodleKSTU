import { useQuery } from "@tanstack/react-query";
import { remarksQueries, RemarkStatus } from "entities/Remarks";
import { ArrowUpIcon, MessageCircleDashedIcon } from "lucide-react";
import { useMemo, useState } from "react";
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

interface StudentCommentsProps {
  theme_id: string;
}

export function StudentComments({ theme_id }: StudentCommentsProps) {
  const [note, setNote] = useState("");

  const { data: remarks, isLoading } = useQuery(
    remarksQueries.byTheme(theme_id)
  );

  const { mutate: addMessage, isPending } = remarksQueries.add_message();
  const { mutate: updateStatus } = remarksQueries.update_status();

  const reviews = useMemo(
    () => (remarks ?? []).map(remarkToReview),
    [remarks]
  );

  const replyTarget = useMemo(() => {
    const openRemark = reviews.find((review) => review.status !== "approved");
    return openRemark ?? reviews[reviews.length - 1];
  }, [reviews]);

  const threadMessages = useMemo(
    () => reviewsToThreadMessages(reviews),
    [reviews]
  );

  const handleSubmit = () => {
    if (!note.trim() || !replyTarget) return;
    addMessage(
      { id: replyTarget.id, data: { message: note } },
      {
        onSuccess: () => {
          setNote("");
          if (replyTarget.status !== "student_replied") {
            updateStatus({
              id: replyTarget.id,
              data: { status: RemarkStatus.RESPONDED },
              silent: true,
            });
          }
        },
      }
    );
  };

  const canSend = Boolean(replyTarget);
  const placeholder = canSend
    ? "Написать сообщение..."
    : "Замечаний пока нет";

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent">
        <div className="shrink-0 px-2 pb-3 pt-4">
          <h3 className="text-base font-semibold leading-none">
            Замечания преподавателя
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {canSend
              ? "Пишите в переписку — преподаватель увидит сообщения."
              : "Здесь отображается переписка по вашей работе."}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
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
                  Когда преподаватель оставит замечание, оно появится здесь.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <RemarkMessageList
              messages={threadMessages}
              ownRole="student"
              isPending={isPending}
            />
          )}
        </div>

        <div className="shrink-0 px-4 pb-4 pt-2">
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <InputGroup>
              <InputGroupTextarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={placeholder}
                disabled={!canSend}
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
                <InputGroupButton
                  type="submit"
                  variant="default"
                  size="icon-sm"
                  disabled={isPending || !note.trim() || !canSend}
                  className="ml-auto"
                >
                  <ArrowUpIcon />
                  <span className="sr-only">Отправить</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
