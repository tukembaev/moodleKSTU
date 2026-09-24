import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuKeyRound, LuLock, LuShieldCheck } from "react-icons/lu";
import { FieldLabel, UseConfirmationDialog, UseMultiSelect } from "shared/components";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";

interface CourseAccessCardProps {
  courseId: string;
}

const studentFullname = (student: {
  first_name: string;
  last_name: string;
  middle_name: string | null;
}) =>
  [student.last_name, student.first_name, student.middle_name]
    .filter(Boolean)
    .join(" ");

const toUserIds = (ids: string[]) =>
  ids.map((id) => Number(id)).filter((id) => Number.isFinite(id));

export const CourseAccessCard = ({ courseId }: CourseAccessCardProps) => {
  const { t } = useTranslation();
  const { data: students = [], isLoading } = useQuery(
    courseQueries.allStudentPerfomance(courseId)
  );
  const { mutate: setCourseAccess, isPending } =
    courseQueries.set_course_access();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const studentOptions = useMemo(
    () =>
      students.map((student) => ({
        label: `${studentFullname(student)}${
          student.group ? ` · ${student.group}` : ""
        }`,
        value: String(student.id),
      })),
    [students]
  );

  const selectedUserIds = useMemo(
    () => toUserIds(selectedStudentIds),
    [selectedStudentIds]
  );
  const hasSelection = selectedUserIds.length > 0;
  const busy = isLoading || isPending;

  const applyAccess = (locked: boolean) => {
    setCourseAccess({
      courseId,
      locked,
      users: hasSelection ? selectedUserIds : undefined,
    });
  };

  const openButton = (
    <Button
      type="button"
      variant="outline"
      className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
      disabled={busy}
      onClick={hasSelection ? () => applyAccess(false) : undefined}
    >
      <LuKeyRound />
      {isPending ? t("Сохраняем...") : t("Открыть доступ ко всем темам")}
    </Button>
  );

  const closeButton = (
    <Button
      type="button"
      variant="outline"
      className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
      disabled={busy}
      onClick={hasSelection ? () => applyAccess(true) : undefined}
    >
      <LuLock />
      {isPending ? t("Сохраняем...") : t("Закрыть доступ ко всем темам")}
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuKeyRound className="h-5 w-5 text-primary" />
          {t("Доступ к курсу")}
        </CardTitle>
        <CardDescription>
          {t(
            "Открывайте или закрывайте доступ ко всем темам курса сразу для выбранных студентов или для всех."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="course-access-students">{t("Студенты")}</FieldLabel>
          <UseMultiSelect
            options={studentOptions}
            onValueChange={setSelectedStudentIds}
            defaultValue={selectedStudentIds}
            placeholder={
              isLoading ? t("Загрузка студентов...") : t("Все студенты курса")
            }
            variant="default"
            maxCount={2}
            disabled={busy}
          />
          {hasSelection ? (
            <p className="text-xs text-muted-foreground">
              {t("Действие будет применено к")}{" "}
              <Badge variant="secondary" className="mx-0.5">
                {selectedUserIds.length}
              </Badge>{" "}
              {t("выбранным студентам.")}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {t(
                "Никто не выбран — действие будет применено ко всем студентам курса."
              )}
            </p>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {hasSelection ? (
            openButton
          ) : (
            <UseConfirmationDialog
              title={t("Открыть доступ всем студентам?")}
              description={t(
                "Доступ ко всем темам курса будет открыт для всех студентов. Тесты и даты тем не изменятся."
              )}
              onConfirm={() => applyAccess(false)}
              trigger={openButton}
            />
          )}
          {hasSelection ? (
            closeButton
          ) : (
            <UseConfirmationDialog
              title={t("Закрыть доступ всем студентам?")}
              description={t(
                "Доступ ко всем темам курса будет закрыт для всех студентов. Точечный доступ внутри отдельных тем можно будет открыть снова."
              )}
              onConfirm={() => applyAccess(true)}
              trigger={closeButton}
            />
          )}
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <LuShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          {t(
            "Точечный доступ по отдельным темам настраивается во вкладке «Доступ» внутри каждой темы курса."
          )}
        </div>
      </CardContent>
    </Card>
  );
};
