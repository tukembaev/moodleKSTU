import { FC, useMemo, useState } from "react";
import { TaskItem } from "./TaskItem";
import { Progress } from "shared/shadcn/ui/progress";
import { Button } from "shared/shadcn/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "shared/hooks";
import { FormQuery } from "shared/config";
import { useSearchParams } from "react-router-dom";
import { EditTaskForm } from "features/Course/forms/edit-task-form";

interface Task {
  id: string;
  title: string;
  week: string;
  result: string;
  max_points: number;
  status: boolean;
  locked: boolean;
  type_less: string;
  deadline: string;
  active_remarks_count: number;
}

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  isStudent: boolean;
  onTaskClick?: (taskId: string) => void;
  selectedTaskId?: string | null;
}

export const TaskGroup: FC<TaskGroupProps> = ({
  title,
  tasks,
  isStudent,
  onTaskClick,
  selectedTaskId,
}) => {
  const openForm = useForm();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  console.log(tasks)
  if (tasks.length === 0) return null;

  const handleEdit = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (taskId: string) => {
    // TODO: Implement delete logic
    console.log("Delete task:", taskId);
  };

  const handleEditSubmit = (data: any) => {
    // TODO: Implement edit logic
    console.log("Edit task:", editingTask?.id, data);
    setEditDialogOpen(false);
    setEditingTask(null);
  };

  // Вычисляем прогресс
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

  return (
    <div className="bg-background border rounded-lg overflow-hidden mb-6">
      {/* Заголовок группы */}
      <div className="bg-muted/50 px-4 py-3 border-b">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          
          <div className="flex items-center gap-3">
            {isStudent && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <Progress value={percentage} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {Math.round(earnedPoints)}/{maxPoints}
                </span>
              </div>
            )}
            
            {!isStudent && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (title === "Тесты") {
                    openForm(FormQuery.ADD_TEST, {
                      id: courseId || "",
                    });
                  } else {
                    openForm(FormQuery.ADD_THEME, {
                      type: title,
                      id: courseId || "",
                    });
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                {title === "Тесты" ? "Добавить тест" : "Добавить тему"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Список заданий */}
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
            onClick={() => onTaskClick?.(task.id)}
            isActive={selectedTaskId === task.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Форма редактирования */}
      {editingTask && (
        <EditTaskForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          taskData={{
            id: editingTask.id,
            week: editingTask.week,
            title: editingTask.title,
            max_points: editingTask.max_points,
            description: "",
            type_less: editingTask.type_less,
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};
