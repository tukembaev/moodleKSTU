import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "shared/lib/utils";
import { Bubble, BubbleContent } from "shared/shadcn/ui/bubble";
import {
  Message,
  MessageContent,
  MessageHeader,
} from "shared/shadcn/ui/message";
import {
  formatMessageDate,
  formatMessageTime,
  isSameCalendarDay,
  type ReviewMessage,
} from "./ReviewThread";

const POP_ANIMATION = {
  initial: {
    opacity: 0,
    scale: 0.94,
    y: 6,
    originX: 1,
    originY: 1,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 34,
      mass: 0.7,
    },
  },
};

interface RemarkMessageListProps<T extends ReviewMessage> {
  messages: T[];
  ownRole: ReviewMessage["author_role"];
  isPending?: boolean;
  afterMessage?: (message: T) => ReactNode;
}

export function RemarkMessageList<T extends ReviewMessage>({
  messages,
  ownRole,
  isPending,
  afterMessage,
}: RemarkMessageListProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[messages.length - 1]?.id;

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [messages.length, lastMessageId]);

  return (
    <div
      ref={scrollerRef}
      aria-busy={isPending}
      className="h-full min-h-0 overflow-y-auto"
    >
      <div className="flex min-h-full flex-col justify-end gap-1 p-4">
        {messages.map((message, index) => {
          const isOwn = message.author_role === ownRole;
          const previous = messages[index - 1];
          const showDate = !isSameCalendarDay(
            previous?.timestamp,
            message.timestamp
          );
          const showAuthor =
            !isOwn &&
            (showDate ||
              previous?.author_role !== message.author_role ||
              previous?.author_name !== message.author_name);

          const content = (
            <>
              {showDate && (
                <div className="flex justify-center pb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatMessageDate(message.timestamp)}
                  </span>
                </div>
              )}
              <Message align={isOwn ? "end" : "start"}>
                <MessageContent className="gap-1">
                  {showAuthor && (
                    <MessageHeader>{message.author_name}</MessageHeader>
                  )}
                  <div
                    className={cn(
                      "flex w-fit max-w-full items-end gap-1.5",
                      isOwn && "flex-row-reverse self-end"
                    )}
                  >
                    <Bubble variant="muted">
                      <BubbleContent className="space-y-1">
                        {message.message
                          .split(/\n\s*\n/)
                          .map((paragraph) => paragraph.trim())
                          .filter(Boolean)
                          .map((paragraph, paragraphIndex) => (
                            <p
                              key={paragraphIndex}
                              className="whitespace-pre-wrap"
                            >
                              {paragraph}
                            </p>
                          ))}
                      </BubbleContent>
                    </Bubble>
                    <time className="mb-0.5 shrink-0 text-[10px] leading-none text-muted-foreground">
                      {formatMessageTime(message.timestamp)}
                    </time>
                  </div>
                  {afterMessage?.(message)}
                </MessageContent>
              </Message>
            </>
          );

          return isOwn && !shouldReduceMotion ? (
            <motion.div
              key={message.id}
              className={cn("min-w-0", showDate ? "pt-3" : showAuthor && "pt-2")}
              initial={POP_ANIMATION.initial}
              animate={POP_ANIMATION.animate}
            >
              {content}
            </motion.div>
          ) : (
            <div
              key={message.id}
              className={cn("min-w-0", showDate ? "pt-3" : showAuthor && "pt-2")}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
