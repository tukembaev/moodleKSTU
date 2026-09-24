import { format } from "date-fns";
import { AlertCircle, Check, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "shared/config/i18n/dateLocale";
import i18n from "shared/config/i18n/i18n";
import { LuSend } from "react-icons/lu";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Separator } from "shared/shadcn/ui/separator";
import { Remark, RemarkStatus } from "entities/Remarks";

// Типы сообщений для логики UI
export type ReviewMessageType = 
  | "teacher_remark"       // Замечание от учителя
  | "student_reply"        // Ответ студента
  | "teacher_rejection"    // Отклонение учителя
  | "teacher_approval";    // Одобрение учителя

// Статус всего обсуждения
export type ReviewStatus = 
  | "pending"              // Ожидает ответа студента
  | "student_replied"      // Студент ответил, ожидает реакции учителя
  | "approved"             // Учитель одобрил
  | "rejected";            // Учитель отклонил (цикл продолжается)

// Структура одного сообщения
export interface ReviewMessage {
  id: string;
  type: ReviewMessageType;
  message: string;
  timestamp: string;
  author_id: string;
  author_name: string;
  author_role: "teacher" | "student";
}

// Структура одного замечания (может содержать несколько сообщений)
export interface Review {
  id: string;
  theme_id: string;
  student_id: string;
  status: ReviewStatus;
  messages: ReviewMessage[];
  created_at: string;
  updated_at: string;
  has_student_reply: boolean; // Ключ для UI: студент ответил на замечание
  needs_teacher_action: boolean; // Ключ для UI: требуется действие учителя
  submission_version?: number | null;
}

const normalizeRemarkStatus = (
  status: Remark["status"] | string
): ReviewStatus => {
  const value = String(status ?? "").toLowerCase();
  if (value === RemarkStatus.PENDING || value === "pending") return "pending";
  if (
    value === RemarkStatus.RESPONDED ||
    value === "responded" ||
    value === "student_replied"
  ) {
    return "student_replied";
  }
  if (value === RemarkStatus.APPROVED || value === "approved") return "approved";
  if (value === RemarkStatus.REJECTED || value === "rejected") return "rejected";
  return "pending";
};

const messageTime = (timestamp?: string) => {
  const time = new Date(timestamp ?? "").getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
};

export const sortMessagesByTime = <T extends { id: string; timestamp: string }>(
  messages: T[]
) =>
  [...messages].sort((left, right) => {
    const byTime = messageTime(left.timestamp) - messageTime(right.timestamp);
    if (byTime !== 0) return byTime;
    return String(left.id).localeCompare(String(right.id));
  });

export type ThreadMessage = ReviewMessage & { reviewId: string };

export type ThreadMarkerType =
  | "date"
  | "remark_opened"
  | "rejected"
  | "approved"
  | "teacher_replied"
  | "awaiting_student"
  | "awaiting_teacher";

export interface ThreadMarker {
  id: string;
  type: ThreadMarkerType;
  label: string;
}

export type ThreadItem =
  | { kind: "marker"; marker: ThreadMarker }
  | { kind: "message"; message: ThreadMessage };

const threadMarkerLabel = (
  type: Exclude<ThreadMarkerType, "date">
): string => {
  switch (type) {
    case "remark_opened":
      return i18n.t("Замечание преподавателя");
    case "rejected":
      return i18n.t("Преподаватель отклонил ответ");
    case "approved":
      return i18n.t("Преподаватель одобрил работу");
    case "teacher_replied":
      return i18n.t("Преподаватель ответил");
    case "awaiting_student":
      return i18n.t("Ожидает ответа студента");
    case "awaiting_teacher":
      return i18n.t("Студент ответил — ожидает проверки");
  }
};

const calendarDayKey = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const classifyRemarkMessages = (
  messages: ReviewMessage[],
  status: ReviewStatus
): ReviewMessage[] => {
  let studentHasReplied = false;

  return messages.map((message, index) => {
    if (message.author_role === "student") {
      studentHasReplied = true;
      return { ...message, type: "student_reply" };
    }

    if (!studentHasReplied) {
      return { ...message, type: "teacher_remark" };
    }

    const isLast = index === messages.length - 1;
    if (isLast && status === "approved") {
      return { ...message, type: "teacher_approval" };
    }
    if (status === "rejected" || status === "approved") {
      return { ...message, type: "teacher_rejection" };
    }
    return { ...message, type: "teacher_remark" };
  });
};

const teacherTransitionMarkerType = (
  message: ReviewMessage
): Exclude<ThreadMarkerType, "date" | "remark_opened"> => {
  if (message.type === "teacher_approval") return "approved";
  if (message.type === "teacher_rejection") return "rejected";
  return "teacher_replied";
};

export const reviewsToThreadItems = (reviews: Review[]): ThreadItem[] => {
  const items: ThreadItem[] = [];
  let lastDateKey: string | undefined;

  const ordered = [...reviews].sort((left, right) => {
    const byTime = messageTime(left.created_at) - messageTime(right.created_at);
    if (byTime !== 0) return byTime;
    return String(left.id).localeCompare(String(right.id));
  });

  ordered.forEach((review, reviewIndex) => {
    let hasApprovalMarker = false;

    review.messages.forEach((message, messageIndex) => {
      const dayKey = calendarDayKey(message.timestamp);
      if (dayKey !== lastDateKey) {
        items.push({
          kind: "marker",
          marker: {
            id: `date-${dayKey}-${review.id}`,
            type: "date",
            label: formatMessageDate(message.timestamp),
          },
        });
        lastDateKey = dayKey;
      }

      if (messageIndex === 0) {
        const versionSuffix =
          review.submission_version != null
            ? i18n.t(" · к версии {{version}}", {
                version: review.submission_version,
              })
            : "";
        items.push({
          kind: "marker",
          marker: {
            id: `remark-open-${review.id}`,
            type: "remark_opened",
            label:
              (reviewIndex === 0
                ? threadMarkerLabel("remark_opened")
                : i18n.t("Новое замечание")) + versionSuffix,
          },
        });
      } else {
        const previous = review.messages[messageIndex - 1];
        if (
          previous.author_role === "student" &&
          message.author_role === "teacher"
        ) {
          const type = teacherTransitionMarkerType(message);
          if (type === "approved") hasApprovalMarker = true;
          items.push({
            kind: "marker",
            marker: {
              id: `transition-${message.id}`,
              type,
              label: threadMarkerLabel(type),
            },
          });
        }
      }

      items.push({
        kind: "message",
        message: { ...message, reviewId: review.id },
      });
    });

    const lastMessage = review.messages[review.messages.length - 1];
    const isLastReview = reviewIndex === ordered.length - 1;

    if (review.status === "approved") {
      if (!hasApprovalMarker) {
        items.push({
          kind: "marker",
          marker: {
            id: `approved-${review.id}`,
            type: "approved",
            label: threadMarkerLabel("approved"),
          },
        });
      }
    } else if (isLastReview) {
      if (
        review.needs_teacher_action ||
        review.status === "student_replied"
      ) {
        items.push({
          kind: "marker",
          marker: {
            id: `awaiting-teacher-${review.id}`,
            type: "awaiting_teacher",
            label: threadMarkerLabel("awaiting_teacher"),
          },
        });
      } else if (lastMessage?.author_role === "teacher") {
        items.push({
          kind: "marker",
          marker: {
            id: `awaiting-student-${review.id}`,
            type: "awaiting_student",
            label: threadMarkerLabel("awaiting_student"),
          },
        });
      }
    }
  });

  return items;
};

export const reviewsToThreadMessages = (reviews: Review[]): ThreadMessage[] =>
  reviewsToThreadItems(reviews)
    .filter(
      (item): item is Extract<ThreadItem, { kind: "message" }> =>
        item.kind === "message"
    )
    .map((item) => item.message);

// Адаптер: Remark (из API /api/v1/remarks) -> Review (формат UI ReviewThread)
export const remarkToReview = (remark: Remark): Review => {
  const mappedStatus = normalizeRemarkStatus(remark.status);
  const messages = classifyRemarkMessages(
    sortMessagesByTime(
      (remark.messages ?? []).map((m) => {
        const senderRole = String(m.sender_role ?? "").toLowerCase();
        return {
          id: m.id,
          type: (senderRole === "student"
            ? "student_reply"
            : "teacher_remark") as ReviewMessageType,
          message: m.message,
          timestamp:
            typeof m.created_at === "string"
              ? m.created_at
              : m.created_at
                ? new Date(m.created_at).toISOString()
                : new Date().toISOString(),
          author_id: String(m.sender_id),
          author_name: m.sender_name,
          author_role: senderRole === "student" ? "student" : "teacher",
        };
      })
    ),
    mappedStatus
  );

  const lastMessage = messages[messages.length - 1];
  const hasStudentReply = messages.some(
    (message) => message.author_role === "student"
  );

  return {
    id: remark.id,
    theme_id: remark.theme_id,
    student_id: String(remark.student_id),
    status: mappedStatus,
    messages,
    created_at:
      typeof remark.created_at === "string"
        ? remark.created_at
        : new Date(remark.created_at).toISOString(),
    updated_at:
      typeof remark.updated_at === "string"
        ? remark.updated_at
        : new Date(remark.updated_at).toISOString(),
    has_student_reply: hasStudentReply,
    needs_teacher_action:
      mappedStatus === "student_replied" ||
      (mappedStatus !== "approved" && lastMessage?.author_role === "student"),
    submission_version: remark.submission_version,
  };
};

// Утилиты
export const getMessageIcon = (type: ReviewMessageType) => {
  switch (type) {
    case "teacher_remark":
    case "teacher_rejection":
      return <AlertCircle className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />;
    case "student_reply":
      return <MessageCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />;
    case "teacher_approval":
      return <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />;
  }
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString(i18n.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatMessageTime = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString(i18n.language, {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return format(date, "d MMMM yyyy", {
    locale: getDateLocale(i18n.language),
  });
};

export const isSameCalendarDay = (a?: string, b?: string) => {
  if (!a || !b) return false;
  const left = new Date(a);
  const right = new Date(b);
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

// Компонент для отображения thread'а замечаний
interface ReviewThreadProps {
  reviews: Review[];
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string, message: string) => void;
  onReply?: (reviewId: string, message: string) => void;
  showTeacherActions?: boolean;
  showStudentActions?: boolean;
}

export function ReviewThread({
  reviews,
  onApprove,
  onReject,
  onReply,
  showTeacherActions = false,
  showStudentActions = false,
}: ReviewThreadProps) {
  const { t } = useTranslation();
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [rejectMessage, setRejectMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const handleReject = (reviewId: string) => {
    if (!rejectMessage.trim() || !onReject) return;
    onReject(reviewId, rejectMessage);
    setRejectMessage("");
    setActiveReviewId(null);
  };

  const handleReply = (reviewId: string) => {
    if (!replyMessage.trim() || !onReply) return;
    onReply(reviewId, replyMessage);
    setReplyMessage("");
    setActiveReviewId(null);
  };

  return (
    <div className="space-y-2 ">
      {reviews.map((review, reviewIndex) => (
        <div key={review.id}>
          {reviewIndex > 0 && <Separator className="my-2" />}
          
          {/* Thread container */}
          <div className="relative">
            {review.messages.map((message, messageIndex) => {
              const isLast = messageIndex === review.messages.length - 1;
              const hasTeacherActions = isLast && 
                showTeacherActions &&
                review.has_student_reply && 
                review.needs_teacher_action && 
                review.status === "student_replied";
              
              const hasStudentActions = isLast &&
                showStudentActions &&
                (review.status === "pending" || review.status === "rejected");
              
              return (
                <div key={message.id} className="relative flex gap-3">
                  {/* Icon column with connecting line */}
                  <div className="relative flex flex-col items-center pt-1">
                    {/* Icon */}
                    <div 
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                        message.type === "teacher_remark" || message.type === "teacher_rejection"
                          ? "bg-yellow-500/10 border border-yellow-500/20"
                          : message.type === "student_reply"
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : "bg-green-500/10 border border-green-500/20"
                      )}
                    >
                      {getMessageIcon(message.type)}
                    </div>
                    
                    {/* Connecting line */}
                    {!isLast && (
                      <div 
                        className="w-px flex-1 mt-2 bg-border"
                        style={{ minHeight: "16px" }}
                      />
                    )}
                  </div>

                  {/* Message content */}
                  <div className="flex-1 pb-4 min-w-0">
                    <div className="rounded-md border bg-card p-3">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {message.author_name}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Message text */}
                      <p className="text-sm text-muted-foreground leading-relaxed break-words">
                        {message.message}
                      </p>
                    </div>

                    {/* Action buttons for teacher */}
                    {hasTeacherActions && (
                      <div className="mt-2">
                        {activeReviewId === review.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={rejectMessage}
                              onChange={(e) => setRejectMessage(e.target.value)}
                              placeholder={t("Причина отклонения...")}
                              className="text-sm h-8"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={!rejectMessage.trim()}
                              onClick={() => handleReject(review.id)}
                              className="h-8 w-8 p-0"
                            >
                              <LuSend className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveReviewId(null);
                                setRejectMessage("");
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => setActiveReviewId(review.id)}
                            >
                              {t("Отклонить")}
                              <X className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-8 text-xs bg-green-500/10 border border-green-500/20 text-black hover:bg-green-500/20"
                              onClick={() => onApprove?.(review.id)}
                            >
                              {t("Одобрить")}
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons for student */}
                    {hasStudentActions && (
                      <div className="mt-2">
                        {activeReviewId === review.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder={t("Ваш ответ на замечание...")}
                              className="text-sm h-8"
                            />
                            <Button
                              size="sm"
                              variant="default"
                              disabled={!replyMessage.trim()}
                              onClick={() => handleReply(review.id)}
                              className="h-8 w-8 p-0"
                            >
                              <LuSend className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveReviewId(null);
                                setReplyMessage("");
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => setActiveReviewId(review.id)}
                          >
                            {t("Ответить")}
                            <MessageCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

