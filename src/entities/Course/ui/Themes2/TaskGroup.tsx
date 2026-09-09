import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { EditTaskForm } from "features/Course/forms/edit-task-form";
import { FC, useMemo, useState } from "react";
import { Progress } from "shared/shadcn/ui/progress";
import { CourseItemKind, CourseListTask } from "./TasksList";
import { TaskItem } from "./TaskItem";

interface TaskGroupProps {
  title: string;
  tasks: CourseListTask[];
  isStudent: boolean;
  onItemClick?: (
    taskId: string,
    kind: CourseItemKind,
    meta?: { passed: boolean | null; is_open: boolean | null; locked?: boolean }
  ) => void;
  selectedTaskId?: string | null;
  isTestsGroup?: boolean;
}

export const TaskGroup: FC<TaskGroupProps> = ({
  title,
  tasks,
  isStudent,
  onItemClick,
  selectedTaskId,
  isTestsGroup = false,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CourseListTask | null>(null);
  const { mutate: deleteTheme } = courseQueries.delete_theme();

  const { earnedPoints, maxPoints, percentage } = useMemo(() => {
    const maxPoints = tasks.reduce((sum, task) => sum + task.max_points, 0);
    const earnedPoints = tasks.reduce((sum, task) => {
      if (!isStudent) return 0;
      const points = task.result !== "—" ? parseFloat(task.result) : 0;
      return sum + (isNaN(points) ? 0 : points);
    }, 0);
    const percentage = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : 0;

    return { earnedPoints, maxPoints, percentage };
  }, [tasks, isStudent]);

  if (tasks.length === 0) return null;

  const handleEdit = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (taskId: string) => {
    deleteTheme(taskId);
  };

  return (
    <div className="bg-background border rounded-lg overflow-hidden mb-4 sm:mb-6">
      <div className="bg-muted/50 px-3 py-2.5 border-b sm:px-4 sm:py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>

          <div className="flex items-center gap-3">
            {isStudent && (
              <div className="flex w-full items-center gap-3 sm:min-w-[200px] sm:w-auto">
                <Progress value={percentage} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {Math.round(earnedPoints)}/{maxPoints}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            week={task.week}
            result={task.result}
            maxPoints={task.max_points}
            status={task.status}
            locked={task.locked}
            isStudent={isStudent}
            deadline={task.deadline}
            activeRemarksCount={task.active_remarks_count}
            onClick={() =>
              onItemClick?.(task.id, task.itemKind, {
                passed: task.passed ?? null,
                is_open: task.is_open ?? null,
                locked: task.locked,
              })
            }
            isActive={selectedTaskId === task.id}
            onEdit={isTestsGroup ? undefined : handleEdit}
            onDelete={isTestsGroup ? undefined : handleDelete}
            isTest={task.itemKind === "test"}
            isOpen={task.is_open}
            passed={task.passed ?? null}
          />
        ))}
      </div>

      {editingTask && !isTestsGroup && (
        <EditTaskForm
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingTask(null);
          }}
          taskData={{
            id: editingTask.id,
            week: editingTask.week,
            title: editingTask.title,
            max_points: editingTask.max_points,
            description: editingTask.description || "",
            type_less: editingTask.type_less,
            deadline: editingTask.deadline,
            locked: editingTask.locked,
            open_date: editingTask.open_date,
          }}
        />
      )}
    </div>
  );
};
