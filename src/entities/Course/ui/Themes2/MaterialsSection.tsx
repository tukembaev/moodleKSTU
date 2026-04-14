import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuFileText } from "react-icons/lu";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { MaterialCard } from "./MaterialCard";
import { cn } from "shared/lib/utils";

interface MaterialsSectionProps {
  themeId: string | null;
}

export const MaterialsSection: FC<MaterialsSectionProps> = ({ themeId }) => {
  const auth_data = useAuth();
  const openForm = useForm();

  const { data: materials, isLoading } = useQuery(
    courseQueries.allTaskMaterials(themeId)
  );

  const { data: courseDetails } = useQuery(
    courseQueries.allTasks(themeId?.split("-")[0] || null)
  );

  const { mutate: delete_material } = courseQueries.delete_material();

  const isOwner = courseDetails?.course_owner?.[0]?.user_id === auth_data?.id;

  const allMaterials = [
    ...(materials?.filter((material) => material.files) || []),
    ...(materials?.filter((material) => material.url) || []),
  ];

  if (!themeId) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <Empty>
          <EmptyContent>
            <EmptyMedia variant="icon">
              <LuFileText size={24} />
            </EmptyMedia>
            <EmptyTitle>Выберите тему</EmptyTitle>
            <EmptyDescription>
              Выберите тему из списка слева для просмотра учебных материалов
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <p className="text-lg font-semibold">Учебные материалы</p>
        {!auth_data.isStudent && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openForm(FormQuery.ADD_MATERIAL, { id: themeId })}
          >
            Добавить материал
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        ) : !allMaterials.length ? (
          <Empty>
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {allMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                isOwner={isOwner}
                onDelete={delete_material}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
