import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { TasksList } from "./TasksList";
import { MaterialsSection } from "./MaterialsSection";
import { TabsSection } from "./TabsSection";
import { cn } from "shared/lib/utils";

export const CourseTasksLayout: FC = () => {
  const { id: courseId } = useParams();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6 h-[calc(100vh-200px)]">
      {/* Левая колонка - список заданий (40%) */}
      <TasksList
        courseId={courseId || null}
        selectedTaskId={selectedTaskId}
        onTaskClick={handleTaskClick}
      />

      {/* Правая колонка - учебные материалы и табы (60%) */}
      <div className="flex flex-col gap-4 h-full overflow-hidden">
        {/* Верхний блок - учебные материалы */}
        <div
          className={cn(
            "border rounded-lg overflow-hidden flex flex-col flex-shrink-0 mr-4",
            !selectedTaskId && "items-center justify-center bg-muted/20"
          )}
        >
          <MaterialsSection themeId={selectedTaskId} />
        </div>

        {/* Нижний блок - табы */}
        <div
          className={cn(
            "border rounded-lg overflow-hidden flex flex-col flex-1 min-h-0 mr-4",
            !selectedTaskId && "items-center justify-center"
          )}
        >
          <TabsSection themeId={selectedTaskId} />
        </div>
      </div>
    </div>
  );
};
