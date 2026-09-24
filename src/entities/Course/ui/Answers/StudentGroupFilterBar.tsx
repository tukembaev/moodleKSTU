import { StudentsAnswers } from "entities/Course/model/types/course";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { LuPencil, LuPlus, LuUsers, LuX } from "react-icons/lu";
import { FieldLabel } from "shared/components";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";
import { Input } from "shared/shadcn/ui/input";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  getGroupColor,
  StudentFilterGroup,
  StudentFilterGroupColorId,
} from "./studentFilterGroups";

const mockAvatarUrl = (seed: string | number) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(String(seed))}`;

const studentAvatarSrc = (student: StudentsAnswers) => {
  const avatar = student.avatar?.trim();
  return avatar || mockAvatarUrl(student.user_id || student.fullname);
};

const studentInitials = (fullname: string) =>
  fullname
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const badgeClassName =
  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-dotted px-3.5 text-sm font-medium shadow-xs transition-colors";

const badgeActionClassName =
  "inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full text-current/50 opacity-100 transition-all duration-200 hover:bg-black/10 hover:text-current sm:ml-0 sm:w-0 sm:opacity-0 group-hover/badge:ml-0.5 group-hover/badge:w-5 group-hover/badge:opacity-100 dark:hover:bg-white/10";

export const StudentGroupDot = ({
  colorId,
  size = "md",
  delayMs = 0,
}: {
  colorId: StudentFilterGroupColorId;
  size?: "sm" | "md";
  delayMs?: number;
}) => {
  const color = getGroupColor(colorId);
  const isMd = size === "md";
  const delayStyle = delayMs ? { animationDelay: `${delayMs}ms` } : undefined;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        isMd ? "size-4" : "size-3.5"
      )}
      aria-hidden
    >
      <span
        className={cn(
          "absolute rounded-full animate-group-dot-beam",
          color.ring,
          isMd ? "size-2" : "size-1.5"
        )}
        style={delayStyle}
      />
      <span
        className={cn(
          "absolute rounded-full blur-[3px] animate-group-dot-glow",
          color.bloom,
          isMd ? "size-4" : "size-3.5"
        )}
        style={delayStyle}
      />
      <span
        className={cn(
          "absolute rounded-full",
          color.ring,
          isMd ? "size-[11px]" : "size-2.5"
        )}
      />
      <span
        className={cn(
          "relative z-[1] rounded-full",
          color.core,
          isMd ? "size-2" : "size-1.5"
        )}
      />
    </span>
  );
};

export const StudentGroupDots = ({
  dots,
}: {
  dots: StudentFilterGroupColorId[];
}) => {
  if (dots.length === 0) return null;

  return (
    <div className="flex items-center gap-1" aria-hidden>
      {dots.map((colorId, index) => (
        <StudentGroupDot
          key={`${colorId}-${index}`}
          colorId={colorId}
          delayMs={index * 220}
        />
      ))}
    </div>
  );
};

export const StudentGroupFilterBar = ({
  groups,
  activeGroupIds,
  students,
  isLoading = false,
  isPending = false,
  onToggleGroup,
  onRemoveGroup,
  onCreateGroup,
  onEditGroup,
}: {
  groups: StudentFilterGroup[];
  activeGroupIds: string[];
  students: StudentsAnswers[];
  isLoading?: boolean;
  isPending?: boolean;
  onToggleGroup: (groupId: string) => void;
  onRemoveGroup: (groupId: string) => Promise<unknown> | void;
  onCreateGroup: (name: string, userIds: number[]) => Promise<unknown> | void;
  onEditGroup: (
    groupId: string,
    name: string,
    userIds: number[]
  ) => Promise<unknown> | void;
}) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StudentFilterGroup | null>(
    null
  );
  const [groupName, setGroupName] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [nameError, setNameError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = Boolean(editingGroup);
  const actionsDisabled = isLoading || isPending || isSaving;

  useEffect(() => {
    if (!isDialogOpen) return;
    setGroupName(editingGroup?.name ?? "");
    setStudentSearch("");
    setSelectedUserIds(editingGroup?.userIds ?? []);
    setNameError("");
  }, [isDialogOpen, editingGroup]);

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      student.fullname.toLowerCase().includes(query)
    );
  }, [studentSearch, students]);

  const openCreate = () => {
    if (actionsDisabled) return;
    setEditingGroup(null);
    setIsDialogOpen(true);
  };

  const openEdit = (group: StudentFilterGroup) => {
    if (actionsDisabled) return;
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const toggleStudent = (userId: number, checked: boolean) => {
    setSelectedUserIds((prev) => {
      if (checked) {
        return prev.includes(userId) ? prev : [...prev, userId];
      }
      return prev.filter((id) => id !== userId);
    });
  };

  const handleSubmit = async () => {
    const name = groupName.trim();
    if (!name) {
      setNameError(t("Введите название группы"));
      return;
    }
    if (selectedUserIds.length === 0) return;
    setIsSaving(true);
    try {
      if (editingGroup) {
        await onEditGroup(editingGroup.id, name, selectedUserIds);
      } else {
        await onCreateGroup(name, selectedUserIds);
      }
      setIsDialogOpen(false);
    } catch {
      // toast already shown by mutation
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (groupId: string) => {
    if (actionsDisabled) return;
    try {
      await onRemoveGroup(groupId);
    } catch {
      // toast already shown by mutation
    }
  };

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-28 rounded-full" />
            ))
          : groups.map((group) => {
          const color = getGroupColor(group.colorId);
          const isActive = activeGroupIds.includes(group.id);
          return (
            <div
              key={group.id}
              className={cn(
                "group/badge",
                badgeClassName,
                isActive ? color.active : color.inactive
              )}
            >
              <button
                type="button"
                onClick={() => onToggleGroup(group.id)}
                aria-pressed={isActive}
                className="inline-flex h-full min-w-0 items-center gap-1.5"
              >
                <StudentGroupDot colorId={group.colorId} size="sm" />
                <span className="max-w-[140px] truncate">{group.name}</span>
              </button>
              <button
                type="button"
                aria-label={t("Изменить группу {{name}}", { name: group.name })}
                disabled={actionsDisabled}
                className={badgeActionClassName}
                onClick={() => openEdit(group)}
              >
                <LuPencil className="size-3" />
              </button>
              <button
                type="button"
                aria-label={t("Удалить группу {{name}}", { name: group.name })}
                disabled={actionsDisabled}
                className={badgeActionClassName}
                onClick={() => handleRemove(group.id)}
              >
                <LuX className="size-3" />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={openCreate}
          disabled={actionsDisabled}
          className={cn(
            badgeClassName,
            "border-dotted border-border bg-background text-muted-foreground hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <LuPlus className="size-3.5" />
          {t("Добавить группу")}
        </button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (isSaving) return;
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="flex max-h-[85vh] flex-col gap-4 overflow-hidden sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? t("Изменить группу") : t("Создать группу")}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t("Измените название или состав. Сохранение полностью заменяет список студентов.")
                : t("Назовите группу и отметьте студентов. Затем её можно включить как фильтр в списке.")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="student-filter-group-name" required>
                {t("Название группы")}
              </FieldLabel>
              <Input
                id="student-filter-group-name"
                value={groupName}
                maxLength={80}
                onChange={(event) => {
                  setGroupName(event.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder={t("Например, Подгруппа А")}
                aria-invalid={Boolean(nameError)}
              />
              {nameError ? (
                <span className="text-xs text-destructive">{nameError}</span>
              ) : null}
            </div>

            <div className="flex min-h-0 flex-col gap-2">
              <FieldLabel htmlFor="student-filter-group-search">
                {t("Студенты")}
              </FieldLabel>
              <Input
                id="student-filter-group-search"
                type="text"
                placeholder={t("Поиск по имени...")}
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
              />
              <div className="h-[280px] overflow-y-auto rounded-md border">
                {filteredStudents.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-sm text-muted-foreground">
                    <LuUsers className="size-5" />
                    {t("Студенты не найдены")}
                  </div>
                ) : (
                  <ul className="divide-y">
                    {filteredStudents.map((student) => {
                      const checked = selectedUserIds.includes(student.user_id);
                      return (
                        <li key={student.user_id}>
                          <div
                            className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-muted/50"
                            onClick={() =>
                              toggleStudent(student.user_id, !checked)
                            }
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                toggleStudent(student.user_id, value === true)
                              }
                              onClick={(event) => event.stopPropagation()}
                              aria-label={t("Выбрать {{name}}", { name: student.fullname })}
                            />
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage
                                src={studentAvatarSrc(student)}
                                alt={student.fullname}
                              />
                              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                {studentInitials(student.fullname)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {student.fullname}
                              </span>
                              {student.group ? (
                                <span className="block truncate text-xs text-muted-foreground">
                                  {student.group}
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("Выбрано: {{count}}", { count: selectedUserIds.length })}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                !groupName.trim() || selectedUserIds.length === 0 || isSaving
              }
            >
              {isSaving
                ? isEdit
                  ? t("Сохраняем...")
                  : t("Создаём...")
                : isEdit
                  ? t("Сохранить")
                  : t("Создать")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
