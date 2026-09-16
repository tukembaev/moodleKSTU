import { cn } from "shared/lib/utils";

export function teacherCommentText(comment?: string | null) {
  const text = comment?.trim();
  return text ? text : null;
}

export function TeacherGradeComment({
  comment,
  compact = false,
  className,
}: {
  comment?: string | null;
  compact?: boolean;
  className?: string;
}) {
  const text = teacherCommentText(comment);
  if (!text) return null;

  if (compact) {
    return (
      <p
        className={cn(
          "max-w-xs text-xs text-muted-foreground whitespace-pre-wrap break-words",
          className
        )}
      >
        {text}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-muted/40 px-2.5 py-2",
        className
      )}
    >
      <p className="text-[11px] font-medium text-muted-foreground">
        Комментарий
      </p>
      <p className="mt-0.5 text-sm whitespace-pre-wrap break-words">{text}</p>
    </div>
  );
}
