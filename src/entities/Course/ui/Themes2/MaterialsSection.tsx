import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { DragEvent, FC, useRef, useState } from "react";
import { LuFileText, LuUpload } from "react-icons/lu";
import { useAuth } from "shared/hooks";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { cn } from "shared/lib/utils";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { toast } from "sonner";
import { AddMaterialCard } from "./AddMaterialCard";
import { MaterialAttachment } from "./MaterialAttachment";

interface MaterialsSectionProps {
  themeId: string | null;
  className?: string;
}

export const MaterialsSection: FC<MaterialsSectionProps> = ({
  themeId,
  className,
}) => {
  const auth_data = useAuth();

  const courseId = useCourseId();
 
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const { data: materials, isPending } = useQuery(
    courseQueries.allTaskMaterials(themeId)
  );

  const { data: courseDetails } = useQuery(
    courseQueries.allTasks(courseId || null)
  );

  const { mutate: delete_material } = courseQueries.delete_material();
  const { mutate: add_material } = courseQueries.create_material();

  const isOwner = courseDetails?.course_owner?.[0]?.user_id === auth_data?.id;

  const allMaterials = [
    ...(materials?.filter((material) => material.files) || []),
    ...(materials?.filter((material) => material.url) || []),
  ];

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

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (!themeId || auth_data.isStudent) {
      toast.error("У вас нет прав для загрузки материалов");
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) {
      toast.error("Файлы не найдены");
      return;
    }

    // Загружаем каждый файл отдельно
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", file.name);
      formData.append("course_detail", themeId);

      add_material(formData);
    }
  };

  if (!themeId) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col px-3 pb-3 sm:px-4 sm:pb-4",
        isDragging && !auth_data.isStudent && "ring-2 ring-primary ring-inset",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && !auth_data.isStudent && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-background border-2 border-dashed border-primary rounded-lg p-8 flex flex-col items-center gap-3">
            <LuUpload size={48} className="text-primary" />
            <p className="text-lg font-semibold">Перетащите файлы сюда</p>
            <p className="text-sm text-muted-foreground">Файлы будут загружены как учебные материалы</p>
          </div>
        </div>
      )}

      <div className="mb-2 flex shrink-0 items-center justify-between gap-2 sm:mb-3">
        <p className="min-w-0 truncate text-base font-semibold sm:text-lg">
          Учебные материалы
        </p>
       
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPending ? null : !allMaterials.length ? (
          !auth_data.isStudent && themeId ? (
            <div className="flex flex-wrap gap-2">
              <AddMaterialCard themeId={themeId} />
            </div>
          ) : (
            <Empty className="h-full min-h-0 p-4 md:p-6">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <LuFileText size={24} />
                </EmptyMedia>
                <EmptyTitle>Нет материалов</EmptyTitle>
                <EmptyDescription>
                  Учебные материалы для этой темы еще не добавлены
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          )
        ) : (
          <div className="flex flex-wrap gap-2">
            {allMaterials.map((material) => (
              <MaterialAttachment
                key={material.id}
                material={material}
                canDelete={isOwner}
                onDelete={delete_material}
                className="w-full sm:min-w-[240px] sm:flex-1 sm:max-w-md"
              />
            ))}
            {!auth_data.isStudent && themeId && (
              <AddMaterialCard themeId={themeId} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
