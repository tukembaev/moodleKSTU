import React, { useEffect, useRef, useState } from "react";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { FeedItem } from "entities/Course/model/types/course";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  ArrowUpIcon,
  MessageCircle,
  MessageCircleDashedIcon,
  ThumbsUp,
  XIcon,
} from "lucide-react";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Bubble, BubbleContent } from "shared/shadcn/ui/bubble";
import { Button } from "shared/shadcn/ui/button";
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
  InputGroupText,
  InputGroupTextarea,
} from "shared/shadcn/ui/input-group";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "shared/shadcn/ui/message";
import { Skeleton } from "shared/shadcn/ui/skeleton";

type ReplyTarget = {
  id: string;
  name: string;
};

type FeedProps = {
  items: FeedItem[];
  isLoading?: boolean;
  theme_id?: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const ThemeFeed: React.FC<FeedProps> = ({
  items,
  isLoading,
  theme_id,
}) => {
  const [text, setText] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: add_comment, isPending: isAdding } =
    courseQueries.add_comment();
  const { mutate: reply_comment, isPending: isReplying } =
    courseQueries.reply_comment();

  const isPending = isAdding || isReplying;
  const placeholder = replyTarget
    ? `Ответ для ${replyTarget.name}...`
    : "Написать комментарий...";

  useEffect(() => {
    if (replyTarget) {
      inputRef.current?.focus();
    }
  }, [replyTarget]);

  const handleSubmit = () => {
    if (!text.trim() || !theme_id) return;

    if (replyTarget) {
      reply_comment(
        { comment_id: replyTarget.id, text },
        {
          onSuccess: () => {
            setText("");
            setReplyTarget(null);
          },
        }
      );
      return;
    }

    add_comment(
      { theme: theme_id, text },
      {
        onSuccess: () => setText(""),
      }
    );
  };

  const handleReply = (item: FeedItem) => {
    setReplyTarget((current) =>
      current?.id === item.id
        ? null
        : { id: item.id, name: item.user.name }
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
        {isLoading ? (
          <div className="space-y-4 p-2">
            <Skeleton className="h-16 w-3/4 rounded-xl" />
            <Skeleton className="ml-auto h-16 w-2/3 rounded-xl" />
            <Skeleton className="h-16 w-3/4 rounded-xl" />
          </div>
        ) : items.length === 0 ? (
          <Empty className="h-full min-h-48 border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircleDashedIcon />
              </EmptyMedia>
              <EmptyTitle>Пока нет обсуждения</EmptyTitle>
              <EmptyDescription>
                Будьте первым — напишите комментарий в поле ниже.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <MessageGroup className="gap-4">
            {items.map((item) => (
              <FeedMessage
                key={item.id}
                item={item}
                replyTargetId={replyTarget?.id ?? null}
                onReply={handleReply}
              />
            ))}
          </MessageGroup>
        )}
      </div>

      <form
        className="shrink-0 pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <InputGroup>
          {replyTarget && (
            <InputGroupAddon align="block-start" className="border-b">
              <InputGroupText className="text-xs">
                <MessageCircle className="size-3.5 text-primary" />
                Режим ответа ·{" "}
                <span className="font-medium text-foreground">
                  {replyTarget.name}
                </span>
              </InputGroupText>
              <InputGroupButton
                size="icon-xs"
                className="ml-auto"
                aria-label="Отменить ответ"
                onClick={() => setReplyTarget(null)}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
          <InputGroupTextarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
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
              disabled={isPending || !text.trim() || !theme_id}
              className="ml-auto"
            >
              <ArrowUpIcon />
              <span className="sr-only">Отправить</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
};

type FeedMessageProps = {
  item: FeedItem;
  depth?: number;
  replyTargetId: string | null;
  onReply: (item: FeedItem) => void;
};

const FeedMessage: React.FC<FeedMessageProps> = ({
  item,
  depth = 0,
  replyTargetId,
  onReply,
}) => {
  const auth = useAuth();
  const { mutate: like_comment } = courseQueries.like_comment();
  const isOwn = auth?.id === item.user.user_id;
  const isReplying = replyTargetId === item.id;

  return (
    <div className={cn(depth > 0 && "pl-10")}>
      <Message align={isOwn ? "end" : "start"}>
        <MessageAvatar className="self-start group-has-data-[slot=message-footer]/message:translate-y-0">
          <Avatar className="size-8">
            <AvatarImage
              src={item.user.avatar}
              alt={item.user.name}
              className="object-cover"
            />
            <AvatarFallback>{getInitials(item.user.name)}</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader className="gap-2">
            <span className="truncate text-foreground">{item.user.name}</span>
            <span className="shrink-0 font-normal">
              {format(new Date(item.created_at), "d MMM, HH:mm", {
                locale: ru,
              })}
            </span>
          </MessageHeader>
          <Bubble variant={isOwn ? "default" : "secondary"}>
            <BubbleContent className="whitespace-pre-wrap">
              {item.text}
            </BubbleContent>
          </Bubble>
          <MessageFooter className="gap-1 px-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onReply(item)}
              className={cn(
                "h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground",
                isReplying && "bg-muted text-primary hover:text-primary"
              )}
            >
              <MessageCircle className="size-3.5" />
              {isReplying ? "Отвечаете" : "Ответить"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => like_comment({ comment_id: item.id })}
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ThumbsUp className="size-3.5" />
              Полезно
              {(item.likes || 0) > 0 && (
                <span className="tabular-nums">({item.likes})</span>
              )}
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>

      {item.replies && item.replies.length > 0 && (
        <MessageGroup className="mt-3 gap-3">
          {item.replies.map((reply) => (
            <FeedMessage
              key={reply.id}
              item={reply}
              depth={depth + 1}
              replyTargetId={replyTargetId}
              onReply={onReply}
            />
          ))}
        </MessageGroup>
      )}
    </div>
  );
};
