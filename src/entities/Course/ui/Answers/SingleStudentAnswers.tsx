import { useQuery } from "@tanstack/react-query";
import {
  blockedUploadCaption,
  canUploadAnswerFiles,
  groupAnswerFiles,
} from "entities/Course/lib/answerSubmissions";
import { TeacherGradeComment } from "entities/Course/lib/teacherComment";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { FileAnswer } from "entities/Course/model/types/course";
import { remarksQueries } from "entities/Remarks";
import { DragEvent, useMemo, useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { cn } from "shared/lib/utils";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { toast } from "sonner";
import { AddAnswerCard } from "./AddAnswerCard";
import { AnswerVersionList } from "./AnswerVersionList";

const fileCardClass = "w-full sm:min-w-[240px] sm:flex-1 sm:max-w-md";

const SingleStudentAnswers = ({
  data,
  isLoading,
  error,
  id,
}: {
  data: FileAnswer[];
  isLoading: boolean;
  error: Error | null;
  id: string;
}) => {
  const { mutate: add_answer } = courseQueries.create_answer();
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const courseId = useCourseId();
  const { data: courseDetails } = useQuery(courseQueries.allTasks(courseId || null));
  const { data: themeRemarks = [] } = useQuery(remarksQueries.byTheme(id));
  const theme = courseDetails?.detail?.find((item) => item.id === id);

  const groups = useMemo(() => groupAnswerFiles(data), [data]);
  const canUpload = canUploadAnswerFiles(data);
  const blockedCaption = blockedUploadCaption(themeRemarks);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!canUpload) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!canUpload) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!canUpload) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (!canUpload) return;

    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) {
      toast.error("Файлы не найдены");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`list_files[${index}]`, file, file.name);
    });
    formData.append("task", id);
    add_answer(formData);
  };

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">{error.message}</div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col px-3 pb-3 sm:px-4 sm:pb-4",
        canUpload && isDragging && "ring-2 ring-primary ring-inset"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {canUpload && isDragging && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-background border-2 border-dashed border-primary rounded-lg p-8 flex flex-col items-center gap-3">
            <LuUpload size={48} className="text-primary" />
            <p className="text-lg font-semibold">Перетащите файлы сюда</p>
            <p className="text-sm text-muted-foreground">
              Файлы будут загружены как ответы по теме
            </p>
          </div>
        </div>
      )}

      <div className="mb-2 flex shrink-0 flex-col gap-2 sm:mb-3">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-base font-semibold sm:text-lg">
            Мои файлы
          </p>
          {theme?.result != null && theme.result !== "—" ? (
            <p className="shrink-0 text-sm text-muted-foreground">
              Оценка: {theme.result}
              {theme.max_points != null ? ` / ${theme.max_points}` : ""}
            </p>
          ) : null}
        </div>
        <TeacherGradeComment comment={theme?.comment} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className={cn("h-14 rounded-xl", fileCardClass)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <AnswerVersionList
              groups={groups}
              fileClassName={fileCardClass}
              deleteFallback
              currentExtra={canUpload ? <AddAnswerCard themeId={id} /> : null}
            />
            {!canUpload && data.length > 0 ? (
              <p className="text-xs text-muted-foreground">{blockedCaption}</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleStudentAnswers;
