import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { FileAnswer } from "entities/Course/model/types/course";
import { DragEvent, useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { cn } from "shared/lib/utils";
import { toast } from "sonner";
import { AddAnswerCard } from "./AddAnswerCard";
import { AnswerFileAttachment } from "./AnswerFileAttachment";

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

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

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
        isDragging && "ring-2 ring-primary ring-inset"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
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

      <div className="mb-2 flex shrink-0 items-center justify-between gap-2 sm:mb-3">
        <p className="min-w-0 truncate text-base font-semibold sm:text-lg">
          Мои файлы
        </p>
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
          <div className="flex flex-wrap gap-2">
            {data.map((material) => (
              <AnswerFileAttachment
                key={material.id}
                file={material}
                canDelete
                className={fileCardClass}
              />
            ))}
            <AddAnswerCard themeId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleStudentAnswers;
