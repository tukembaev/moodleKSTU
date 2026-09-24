import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { DragEvent, FC, useRef, useState } from "react";
import { LuChevronDown, LuFileText, LuUpload } from "react-icons/lu";
import { useAuth } from "shared/hooks";
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
  collapsible?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MaterialsSection: FC<MaterialsSectionProps> = ({
  themeId,
  className,
  collapsible = false,
  open = true,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const auth_data = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const { data: materials, isPending } = useQuery(
    courseQueries.allTaskMaterials(themeId)
  );

  const { mutate: delete_material } = courseQueries.delete_material();
  const { mutate: add_material } = courseQueries.create_material();

  const canManageMaterials = Boolean(auth_data.isAuthenticated && !auth_data.isStudent);

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

    if (!themeId || !canManageMaterials) {
      toast.error(t("У вас нет прав для загрузки материалов"));
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) {
      toast.error(t("Файлы не найдены"));
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
          "relative flex min-h-0 flex-col px-3 lg:px-4",
        (!collapsible || open) && "h-full",
          (!collapsible || open) ? "pb-3 sm:pb-4" : "pb-1",
        isDragging && canManageMaterials && "ring-2 ring-primary ring-inset",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && canManageMaterials && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-background border-2 border-dashed border-primary rounded-lg p-8 flex flex-col items-center gap-3">
            <LuUpload size={48} className="text-primary" />
            <p className="text-lg font-semibold">{t("Перетащите файлы сюда")}</p>
            <p className="text-sm text-muted-foreground">{t("Файлы будут загружены как учебные материалы")}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!collapsible}
        onClick={() => onOpenChange?.(!open)}
        className={cn(
          "mb-2 flex w-full shrink-0 items-center justify-between gap-2 text-left sm:mb-3",
          collapsible && "min-h-10 rounded-lg px-1 -mx-1 active:bg-accent/50 lg:pointer-events-none lg:min-h-0 lg:px-0 lg:mx-0"
        )}
      >
        <p className="min-w-0 truncate text-base font-semibold sm:text-lg">
          {t("Учебные материалы")}
        </p>
        {collapsible && (
          <LuChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform lg:hidden",
              open && "rotate-180"
            )}
          />
        )}
      </button>

      {(!collapsible || open) && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isPending ? null : !allMaterials.length ? (
            canManageMaterials && themeId ? (
              <div className="flex flex-wrap gap-2">
                <AddMaterialCard themeId={themeId} />
              </div>
            ) : (
              <Empty className="h-full min-h-0 p-4 md:p-6">
                <EmptyContent>
                  <EmptyMedia variant="icon">
                    <LuFileText size={24} />
                  </EmptyMedia>
                  <EmptyTitle>{t("Нет материалов")}</EmptyTitle>
                  <EmptyDescription>
                    {t("Учебные материалы для этой темы еще не добавлены")}
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
                  canDelete={canManageMaterials}
                  onDelete={delete_material}
                  className="w-full sm:min-w-[240px] sm:flex-1 sm:max-w-md"
                />
              ))}
              {canManageMaterials && themeId && (
                <AddMaterialCard themeId={themeId} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
