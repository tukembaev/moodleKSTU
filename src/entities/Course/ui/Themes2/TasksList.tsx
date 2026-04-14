import { FC, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useAuth } from "shared/hooks";
import { TaskGroup } from "./TaskGroup";

interface TasksListProps {
  courseId: string | null;
  selectedTaskId: string | null;
  onTaskClick: (taskId: string) => void;
}

export const TasksList: FC<TasksListProps> = ({
  courseId,
  selectedTaskId,
  onTaskClick,
}) => {
  const auth_data = useAuth();

  const { data: courseDetails } = useQuery(
    courseQueries.allTasks(courseId || null)
  );

  const tasks = courseDetails?.detail || [];

  const groupedTasks = useMemo(() => {
    const groups: Record<string, typeof tasks> = {};

    tasks.forEach((task) => {
      const type = task.type_less || "Другое";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(task);
    });

    return groups;
  }, [tasks]);

  return (
    <div className="space-y-4 overflow-y-auto pr-2">
      {Object.entries(groupedTasks).map(([type, typeTasks]) => (
        <TaskGroup
          key={type}
          title={type}
          tasks={typeTasks}
          isStudent={auth_data.isStudent}
          onTaskClick={onTaskClick}
          selectedTaskId={selectedTaskId}
        />
      ))}

      {Object.keys(groupedTasks).length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Задания пока не добавлены</p>
        </div>
      )}
    </div>
  );
};
