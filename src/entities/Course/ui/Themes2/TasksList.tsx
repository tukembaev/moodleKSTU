import { FC, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useAuth, useForm } from "shared/hooks";
import { TaskGroup } from "./TaskGroup";
import { Plus } from "lucide-react";
import { FormQuery } from "shared/config";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Test } from "entities/Test/model/types/test";
import { TYPE_LABELS } from "features/Course/forms/add-theme/add-theme-constants";

export type CourseItemKind = "theme" | "test";

export interface SelectedCourseItem {
  kind: CourseItemKind;
  id: string;
}

export interface CourseListTask {
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
  open_date?: string;
  description?: string;
  discipline_name?: string;
  is_favorite?: boolean;
  itemKind: CourseItemKind;
  is_open?: boolean | null;
  passed?: boolean | null;
  min_points?: number;
}

interface TasksListProps {
  courseId: string | null;
  selectedTaskId: string | null;
  onItemClick: (
    taskId: string,
    kind: CourseItemKind,
    meta?: { passed: boolean | null; is_open: boolean | null; locked?: boolean }
  ) => void;
}

export const TasksList: FC<TasksListProps> = ({
  courseId,
  selectedTaskId,
  onItemClick,
}) => {
  const auth_data = useAuth();
  const openForm = useForm();
  const id = useCourseId();
  const isStudent = Boolean(auth_data?.isStudent);

  const { data: courseDetails } = useQuery(
    courseQueries.allTasks(courseId || null)
  );

  const { data: courseTests } = useQuery(
    courseQueries.courseTests(courseId || null)
  );

  const tasks = courseDetails?.detail || [];

  const uniqueTasks = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      if (!map.has(task.id)) {
        map.set(task.id, task);
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  const testTasks = useMemo<CourseListTask[]>(() => {
    if (!courseTests || courseTests.length === 0) return [];

    return courseTests.map((test: Test) => ({
      id: test.id,
      title: test.title,
      week: "",
      result: test.result !== null ? test.result.toString() : "—",
      max_points: test.max_points,
      status: test.status,
      locked: test.is_open === false,
      type_less: "Тесты",
      deadline: test.opening_date,
      active_remarks_count: 0,
      open_date: test.opening_date,
      description: test.description || "",
      discipline_name: "",
      is_favorite: false,
      itemKind: "test" as const,
      is_open: test.is_open,
      passed: test.passed ?? null,
      min_points: test.min_points ?? 0,
    }));
  }, [courseTests]);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, CourseListTask[]> = {};

    if (testTasks.length > 0) {
      groups["Тесты"] = testTasks;
    }

    uniqueTasks.forEach((task) => {
      const type = TYPE_LABELS[task.type_less] || task.type_less || "Другое";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push({
        ...task,
        itemKind: "theme",
      });
    });

    return groups;
  }, [uniqueTasks, testTasks]);

  const hasTypeLessGroup = Object.keys(groupedTasks).some(
    (key) => key.toLowerCase() === "type_less"
  );

  return (
    <div className="h-full min-h-0 space-y-3 overflow-y-auto pr-1 sm:space-y-4 sm:pr-2">
      {Object.entries(groupedTasks).map(([type, typeTasks]) => (
        <TaskGroup
          key={type}
          title={type}
          tasks={typeTasks}
          isStudent={isStudent}
          onItemClick={onItemClick}
          selectedTaskId={selectedTaskId}
          isTestsGroup={type === "Тесты"}
        />
      ))}

      {Object.keys(groupedTasks).length === 0 && isStudent && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Задания пока не добавлены</p>
        </div>
      )}

      {!isStudent && !hasTypeLessGroup && (
        <Empty className="border border-dashed border-border bg-background rounded-lg w-full mt-6">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <Plus size={24} />
            </EmptyMedia>
            <EmptyTitle>Добавить новую тему или тест</EmptyTitle>
            <EmptyDescription>
              Нажмите кнопку ниже, чтобы добавить новую тему или заранее созданный тест
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
              Добавить 
            </button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
};
