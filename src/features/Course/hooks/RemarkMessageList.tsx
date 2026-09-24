import {
  BookOpenCheck,
  CircleAlert,
  Clock,
  MessageCircle,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "shared/lib/utils";
import { Bubble, BubbleContent } from "shared/shadcn/ui/bubble";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "shared/shadcn/ui/marker";
import {
  Message,
  MessageContent,
  MessageHeader,
} from "shared/shadcn/ui/message";
import {
  formatMessageTime,
  type ThreadItem,
  type ThreadMarker,
  type ThreadMessage,
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

interface RemarkMessageListProps<T extends ThreadMessage> {
  items: ThreadItem[];
  ownRole: ThreadMessage["author_role"];
  isPending?: boolean;
  afterMessage?: (message: T) => ReactNode;
}

const markerIcon = (type: ThreadMarker["type"]) => {
  switch (type) {
    case "remark_opened":
      return <CircleAlert />;
    case "rejected":
      return <X />;
    case "approved":
      return <BookOpenCheck />;
    case "teacher_replied":
      return <MessageCircle />;
    case "awaiting_student":
    case "awaiting_teacher":
      return <Clock />;
    default:
      return null;
  }
};

function RemarkThreadMarker({ marker }: { marker: ThreadMarker }) {
  const { t } = useTranslation();
  const isApproved = marker.type === "approved";
  const isSeparator =
    marker.type === "date" || marker.type === "remark_opened";
  const isLiveStatus =
    marker.type === "awaiting_student" || marker.type === "awaiting_teacher";
  const icon = markerIcon(marker.type);

  return (
    <Marker
      variant={isSeparator ? "separator" : "default"}
      role={isLiveStatus ? "status" : undefined}
      className={cn(
        "justify-center text-center",
        isApproved && "flex-col gap-1 py-3"
      )}
    >
      {icon ? <MarkerIcon>{icon}</MarkerIcon> : null}
      <MarkerContent>
        {marker.label}
        {isApproved ? (
          <span className="mt-0.5 block text-xs">{t("Замечаний больше нет")}</span>
        ) : null}
      </MarkerContent>
    </Marker>
  );
}

const itemKey = (item: ThreadItem) =>
  item.kind === "message" ? item.message.id : item.marker.id;

export function RemarkMessageList<T extends ThreadMessage>({
  items,
  ownRole,
  isPending,
  afterMessage,
}: RemarkMessageListProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lastItem = items[items.length - 1];
  const lastItemId = lastItem ? itemKey(lastItem) : undefined;

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [items.length, lastItemId]);

  return (
    <div
      ref={scrollerRef}
      aria-busy={isPending}
      className="h-full min-h-0 overflow-y-auto"
    >
      <div className="flex min-h-full flex-col justify-end gap-1 p-4">
        {items.map((item, index) => {
          if (item.kind === "marker") {
            return (
              <div
                key={item.marker.id}
                className={cn(
                  "min-w-0",
                  item.marker.type === "approved"
                    ? "py-3"
                    : item.marker.type === "date"
                      ? "pt-3"
                      : "py-1"
                )}
              >
                <RemarkThreadMarker marker={item.marker} />
              </div>
            );
          }

          const message = item.message as T;
          const isOwn = message.author_role === ownRole;
          const previousMessage = [...items.slice(0, index)]
            .reverse()
            .find((entry): entry is Extract<ThreadItem, { kind: "message" }> =>
              entry.kind === "message"
            )?.message;
          const showAuthor =
            !isOwn &&
            (previousMessage?.author_role !== message.author_role ||
              previousMessage?.author_name !== message.author_name);

          const content = (
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
          );

          return isOwn && !shouldReduceMotion ? (
            <motion.div
              key={message.id}
              className={cn("min-w-0", showAuthor && "pt-2")}
              initial={POP_ANIMATION.initial}
              animate={POP_ANIMATION.animate}
            >
              {content}
            </motion.div>
          ) : (
            <div
              key={message.id}
              className={cn("min-w-0", showAuthor && "pt-2")}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
