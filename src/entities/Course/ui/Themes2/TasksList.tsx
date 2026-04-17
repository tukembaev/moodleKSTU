import { FC, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useAuth, useForm } from "shared/hooks";
import { TaskGroup } from "./TaskGroup";
import { Plus } from "lucide-react";
import { FormQuery } from "shared/config";
import { useSearchParams } from "react-router-dom";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Test } from "entities/Test/model/types/test";

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
  const openForm = useForm();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const { data: courseDetails } = useQuery(
    courseQueries.allTasks(courseId || null)
  );

  // Получаем тесты курса
  const { data: courseTests, error: testsError, isLoading: testsLoading } = useQuery(
    courseQueries.courseTests(courseId || null)
  );

  console.log("Course Details:", courseDetails);
  console.log("Course Tests:", courseTests);
  console.log("Tests Error:", testsError);
  console.log("Tests Loading:", testsLoading);

  const tasks = courseDetails?.detail || [];

  // Удаляем дубликаты задач по ID
  const uniqueTasks = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      if (!map.has(task.id)) {
        map.set(task.id, task);
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  // Преобразуем тесты в формат задач
  const testTasks = useMemo(() => {
    if (!courseTests || courseTests.length === 0) return [];
    
    return courseTests.map((test: Test) => ({
      id: test.id,
      title: test.title,
      week: "Тест",
      result: test.result !== null ? test.result.toString() : "—",
      max_points: test.max_points,
      status: test.status,
      locked: false,
      type_less: "Тесты",
      deadline: test.opening_date,
      active_remarks_count: 0,
      open_date: test.opening_date,
      description: test.description || "",
      discipline_name: "",
      is_favorite: false,
    }));
  }, [courseTests]);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, typeof tasks> = {};

    // Добавляем группу тестов первой, если есть тесты
    if (testTasks.length > 0) {
      groups["Тесты"] = testTasks;
    }

    // Добавляем остальные задачи
    uniqueTasks.forEach((task) => {
      const type = task.type_less || "Другое";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(task);
    });

    return groups;
  }, [uniqueTasks, testTasks]);

  const hasTypeLessGroup = Object.keys(groupedTasks).some(
    (key) => key.toLowerCase() === "type_less"
  );

  return (
    <div className="space-y-4 pr-2">
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

      {/* Empty компонент для добавления темы type_less внизу, если такой группы нет */}
      {!auth_data.isStudent && !hasTypeLessGroup && (
        <Empty className="border border-dashed border-border bg-background rounded-lg w-full mt-6">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <Plus size={24} />
            </EmptyMedia>
            <EmptyTitle>Добавить новую тему</EmptyTitle>
            <EmptyDescription>
              Нажмите кнопку ниже, чтобы добавить новую тему с типом type_less
            </EmptyDescription>

            <button
              onClick={() =>
                openForm(FormQuery.ADD_THEME, {
                  type: "type_less",
                  id: id || "",
                })
              }
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Добавить тему (type_less)
            </button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
};
