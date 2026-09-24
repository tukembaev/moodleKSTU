import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseStudentGroup } from "entities/Course/model/types/course";
import { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "shared/config/i18n/i18n";

export type StudentFilterGroupColorId =
  | "blue"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "cyan"
  | "orange"
  | "indigo";

export type StudentFilterGroup = {
  id: string;
  name: string;
  colorId: StudentFilterGroupColorId;
  userIds: number[];
};

export const STUDENT_GROUP_COLORS: Record<
  StudentFilterGroupColorId,
  {
    id: StudentFilterGroupColorId;
    core: string;
    ring: string;
    bloom: string;
    inactive: string;
    active: string;
  }
> = {
  blue: {
    id: "blue",
    core: "bg-blue-500",
    ring: "bg-blue-400/45",
    bloom: "bg-blue-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-950/70",
  },
  emerald: {
    id: "emerald",
    core: "bg-emerald-500",
    ring: "bg-emerald-400/45",
    bloom: "bg-emerald-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200 dark:hover:bg-emerald-950/70",
  },
  amber: {
    id: "amber",
    core: "bg-amber-500",
    ring: "bg-amber-400/45",
    bloom: "bg-amber-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200 dark:hover:bg-amber-950/70",
  },
  violet: {
    id: "violet",
    core: "bg-violet-500",
    ring: "bg-violet-400/45",
    bloom: "bg-violet-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-violet-300 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-950/70",
  },
  rose: {
    id: "rose",
    core: "bg-rose-500",
    ring: "bg-rose-400/45",
    bloom: "bg-rose-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200 dark:hover:bg-rose-950/70",
  },
  cyan: {
    id: "cyan",
    core: "bg-cyan-500",
    ring: "bg-cyan-400/45",
    bloom: "bg-cyan-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-cyan-300 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200 dark:hover:bg-cyan-950/70",
  },
  orange: {
    id: "orange",
    core: "bg-orange-500",
    ring: "bg-orange-400/45",
    bloom: "bg-orange-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-orange-300 bg-orange-50 text-orange-800 hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-200 dark:hover:bg-orange-950/70",
  },
  indigo: {
    id: "indigo",
    core: "bg-indigo-500",
    ring: "bg-indigo-400/45",
    bloom: "bg-indigo-400/25",
    inactive:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
    active:
      "border-indigo-300 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200 dark:hover:bg-indigo-950/70",
  },
};

const COLOR_ORDER: StudentFilterGroupColorId[] = [
  "blue",
  "emerald",
  "amber",
  "violet",
  "rose",
  "cyan",
  "orange",
  "indigo",
];

export const isColorId = (value: unknown): value is StudentFilterGroupColorId =>
  typeof value === "string" && value in STUDENT_GROUP_COLORS;

export const getGroupColor = (colorId: unknown) =>
  isColorId(colorId)
    ? STUDENT_GROUP_COLORS[colorId]
    : STUDENT_GROUP_COLORS.blue;

const colorIdFromKey = (key: string): StudentFilterGroupColorId => {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return COLOR_ORDER[Math.abs(hash) % COLOR_ORDER.length];
};

export const colorIdFromGroup = (
  color: unknown,
  fallbackKey: string
): StudentFilterGroupColorId =>
  isColorId(color) ? color : colorIdFromKey(fallbackKey);

export const nextGroupColorId = (
  existing: StudentFilterGroup[]
): StudentFilterGroupColorId => {
  const used = new Set(existing.map((group) => group.colorId));
  return (
    COLOR_ORDER.find((color) => !used.has(color)) ??
    COLOR_ORDER[existing.length % COLOR_ORDER.length]
  );
};

export const mapCourseStudentGroup = (
  group: CourseStudentGroup
): StudentFilterGroup => ({
  id: group.id,
  name: group.name,
  colorId: colorIdFromGroup(group.color, group.id),
  userIds: group.user_ids,
});

export const studentActiveGroupDots = (
  userId: number,
  groups: StudentFilterGroup[],
  activeIds: string[]
) => {
  if (activeIds.length === 0) return [];
  const activeSet = new Set(activeIds);
  return groups
    .filter((group) => activeSet.has(group.id) && group.userIds.includes(userId))
    .map((group) => group.colorId)
    .filter(isColorId);
};

export const studentMatchesActiveGroups = (
  userId: number,
  groups: StudentFilterGroup[],
  activeIds: string[]
) => {
  if (activeIds.length === 0) return true;
  const activeSet = new Set(activeIds);
  return groups.some(
    (group) => activeSet.has(group.id) && group.userIds.includes(userId)
  );
};

export const useCourseStudentGroups = (courseId: string | null) => {
  const [activeGroupIds, setActiveGroupIds] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    ...courseQueries.studentGroups(courseId),
  });

  const groups = useMemo(
    () => (data ?? []).map(mapCourseStudentGroup),
    [data]
  );

  const { mutateAsync: createGroup, isPending: isCreating } =
    courseQueries.create_student_group();
  const { mutateAsync: updateGroup, isPending: isUpdating } =
    courseQueries.edit_student_group();
  const { mutateAsync: deleteGroup, isPending: isDeleting } =
    courseQueries.delete_student_group();

  useEffect(() => {
    setActiveGroupIds([]);
  }, [courseId]);

  useEffect(() => {
    if (!data) return;
    const ids = new Set(data.map((group) => group.id));
    setActiveGroupIds((prev) => prev.filter((id) => ids.has(id)));
  }, [data]);

  const addGroup = useCallback(
    async (name: string, userIds: number[]) => {
      if (!courseId) throw new Error(i18n.t("Курс не выбран"));
      await createGroup({
        courseId,
        data: {
          name: name.trim(),
          user_ids: [...new Set(userIds)],
          color: nextGroupColorId(groups),
        },
      });
    },
    [courseId, createGroup, groups]
  );

  const editGroup = useCallback(
    async (groupId: string, name: string, userIds: number[]) => {
      if (!courseId) throw new Error(i18n.t("Курс не выбран"));
      await updateGroup({
        courseId,
        groupId,
        data: {
          name: name.trim(),
          user_ids: [...new Set(userIds)],
        },
      });
    },
    [courseId, updateGroup]
  );

  const removeGroup = useCallback(
    async (groupId: string) => {
      if (!courseId) throw new Error(i18n.t("Курс не выбран"));
      await deleteGroup({ courseId, groupId });
      setActiveGroupIds((prev) => prev.filter((id) => id !== groupId));
    },
    [courseId, deleteGroup]
  );

  const toggleGroup = useCallback((groupId: string) => {
    setActiveGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  }, []);

  return {
    groups,
    activeGroupIds,
    isLoading,
    isPending: isCreating || isUpdating || isDeleting,
    addGroup,
    editGroup,
    removeGroup,
    toggleGroup,
  };
};
