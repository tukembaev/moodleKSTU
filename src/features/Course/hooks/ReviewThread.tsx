import { AlertCircle, Check, MessageCircle, X } from "lucide-react";
import { useState } from "react";
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
}

// Адаптер: Remark (из API /api/v1/remarks) -> Review (формат UI ReviewThread)
export const remarkToReview = (remark: Remark): Review => {
  const status: ReviewStatus =
    remark.status === RemarkStatus.PENDING
      ? "pending"
      : remark.status === RemarkStatus.RESPONDED
      ? "student_replied"
      : remark.status === RemarkStatus.APPROVED
      ? "approved"
      : "rejected";

  const messages: ReviewMessage[] = remark.messages.map((m, idx, arr) => {
    const isLast = idx === arr.length - 1;
    let type: ReviewMessageType;
    if (m.sender_role === "student") {
      type = "student_reply";
    } else if (
      isLast &&
      remark.status === RemarkStatus.APPROVED
    ) {
      type = "teacher_approval";
    } else if (
      isLast &&
      remark.status === RemarkStatus.REJECTED
    ) {
      type = "teacher_rejection";
    } else {
      type = "teacher_remark";
    }
    return {
      id: m.id,
      type,
      message: m.message,
      timestamp:
        typeof m.created_at === "string"
          ? m.created_at
          : new Date(m.created_at).toISOString(),
      author_id: String(m.sender_id),
      author_name: m.sender_name,
      author_role: m.sender_role,
    };
  });

  return {
    id: remark.id,
    theme_id: remark.theme_id,
    student_id: String(remark.student_id),
    status,
    messages,
    created_at:
      typeof remark.created_at === "string"
        ? remark.created_at
        : new Date(remark.created_at).toISOString(),
    updated_at:
      typeof remark.updated_at === "string"
        ? remark.updated_at
        : new Date(remark.updated_at).toISOString(),
    has_student_reply: remark.messages.some(
      (m) => m.sender_role === "student"
    ),
    needs_teacher_action: remark.status === RemarkStatus.RESPONDED,
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
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
                              placeholder="Причина отклонения..."
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
                              Отклонить
                              <X className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-8 text-xs bg-green-500/10 border border-green-500/20 text-black hover:bg-green-500/20"
                              onClick={() => onApprove?.(review.id)}
                            >
                              Одобрить
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
                              placeholder="Ваш ответ на замечание..."
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
                            Ответить
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

