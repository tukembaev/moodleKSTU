import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import {
  ThemeDateRangeField,
  type ThemeScheduleValue,
  toThemeTimestamp,
} from "features/Course/forms/theme-date-range-field";
import { useEffect, useState } from "react";
import { LuCalendarClock, LuSave, LuUsers } from "react-icons/lu";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import { Separator } from "shared/shadcn/ui/separator";
import ListOfStudentsWithAnswers from "./ListOfStudentsWithAnswers";

const ThemeAccess = ({ themeId }: { themeId: string }) => {
  const { t } = useTranslation();
  const courseId = useCourseId();
  const {
    data: answers,
    isLoading,
    error,
    refetch,
  } = useQuery(courseQueries.allAnswerTask(themeId));
  const { data: courseDetails } = useQuery({
    ...courseQueries.allTasks(courseId || null),
    enabled: Boolean(courseId && themeId),
  });
  const currentTheme = courseDetails?.detail?.find((task) => task.id === themeId);
  const { mutate: editTheme, isPending } = courseQueries.edit_theme();

  const savedSchedule: ThemeScheduleValue = {
    opening_date: toThemeTimestamp(
      currentTheme?.open_date ?? currentTheme?.opening_date
    ),
    deadline: toThemeTimestamp(currentTheme?.deadline),
  };

  const [schedule, setSchedule] = useState<ThemeScheduleValue>(savedSchedule);

  useEffect(() => {
    setSchedule({
      opening_date: toThemeTimestamp(
        currentTheme?.open_date ?? currentTheme?.opening_date
      ),
      deadline: toThemeTimestamp(currentTheme?.deadline),
    });
  }, [
    themeId,
    currentTheme?.opening_date,
    currentTheme?.open_date,
    currentTheme?.deadline,
  ]);

  const isDirty =
    schedule.opening_date !== savedSchedule.opening_date ||
    schedule.deadline !== savedSchedule.deadline;

  const handleSave = () => {
    if (!themeId) return;
    editTheme({
      id: themeId,
      data: {
        opening_date: schedule.opening_date,
        deadline: schedule.deadline,
      },
    });
  };

  return (
    <div className="h-full min-h-0 flex-1 overflow-auto px-3 pb-3 lg:px-4 sm:pb-4">
      <div className="flex flex-col">
        <section className="flex flex-col gap-3 py-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex min-w-0 items-center gap-2 text-base font-semibold">
                <LuCalendarClock className="h-4 w-4 shrink-0 text-primary" />
                {t("Срок доступа к теме")}
              </h3>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isPending || !isDirty}
                className="shrink-0"
              >
                <LuSave />
                {isPending ? t("Сохранение...") : t("Сохранить")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Настройте период, в который тема автоматически открыта для всех студентов. Ниже можно точечно управлять доступом отдельных студентов.")}
            </p>
          </div>
          <ThemeDateRangeField
            compact
            className="w-full"
            openingDate={schedule.opening_date}
            deadline={schedule.deadline}
            onChange={setSchedule}
          />
        </section>

        <Separator className="my-4" />

        <section className="flex flex-col gap-3 py-1">
          <div className="flex flex-col gap-1">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <LuUsers className="h-4 w-4 text-primary" />
              {t("Доступ студентов к теме")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("Открывайте и закрывайте доступ конкретным студентам или сразу всей группе.")}
            </p>
          </div>
          <ListOfStudentsWithAnswers
            mode="access"
            data={answers ?? []}
            isLoading={isLoading}
            refetch={refetch}
            error={error}
            theme_id={themeId}
          />
        </section>
      </div>
    </div>
  );
};

export default ThemeAccess;
