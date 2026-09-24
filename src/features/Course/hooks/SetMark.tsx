import { teacherCommentText } from "entities/Course/lib/teacherComment";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LucideWandSparkles } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GaugeWithSliderSmall } from "shared/components/Progress/GaugeWithSliderSmall";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { FieldLabel } from "shared/components/FieldLabel";
import { Textarea } from "shared/shadcn/ui/textarea";

export function SetMark({
  text,
  id,
  max_points,
  points,
  comment,
  children,
}: {
  text: string;
  id?: string;
  max_points: number;
  points?: number;
  comment?: string | null;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { mutate: rate_answer, isPending } = courseQueries.rate_answer();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(points ?? 0);
  const [teacherComment, setTeacherComment] = useState(comment ?? "");
  const existingComment = teacherCommentText(comment);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setScore(points ?? 0);
      setTeacherComment(comment ?? "");
    }
  };

  const handleSubmit = () => {
    rate_answer(
      {
        answer: id as string,
        points: score,
        comment: existingComment ?? (teacherComment.trim() || null),
      },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 overflow-visible p-4" onCloseAutoFocus={(event) => event.preventDefault()}>
        <DropdownMenuLabel className="mb-2 text-center">
          {text}
        </DropdownMenuLabel>

        <GaugeWithSliderSmall
          score={score}
          maxScore={Number(max_points)}
          onChange={setScore}
        />

        <div className="mt-4 space-y-1.5">
          <FieldLabel
            htmlFor={`grade-comment-${id ?? "new"}`}
            className="text-xs text-muted-foreground"
          >
            {t("Комментарий")}
          </FieldLabel>
          {existingComment ? (
            <p className="rounded-md border bg-muted/40 px-2.5 py-2 text-sm whitespace-pre-wrap break-words">
              {existingComment}
            </p>
          ) : (
            <Textarea
              id={`grade-comment-${id ?? "new"}`}
              value={teacherComment}
              onChange={(event) => setTeacherComment(event.target.value)}
              placeholder={t("Необязательный комментарий к оценке")}
              rows={3}
              className="min-h-16 resize-none"
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            />
          )}
        </div>

        <Button
          className="mt-5 flex w-full gap-2"
          variant={"outline"}
          disabled={isPending}
          onClick={() => handleSubmit()}
        >
          {t("Применить")}
          <LucideWandSparkles />
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
