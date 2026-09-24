import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LuTriangleAlert } from "react-icons/lu";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import {
  canShowDeleteCourse,
  courseHasStudents,
} from "entities/Course/model/types/course";
import { UseConfirmationDialog } from "shared/components";
import { Alert, AlertDescription, AlertTitle } from "shared/shadcn/ui/alert";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";

interface DeleteCourseCardProps {
  courseId: string;
  courseName?: string;
}

export const DeleteCourseCard = ({
  courseId,
  courseName,
}: DeleteCourseCardProps) => {
  const { t } = useTranslation();
  const { data: course } = useQuery(courseQueries.allTasks(courseId));
  const { mutate: deleteCourse, isPending } = courseQueries.delete_course();

  if (!course || !canShowDeleteCourse(course, true)) return null;

  const hasStudents = courseHasStudents(course.count_stud);
  const blockMessage = course.count_stud
    ? t("Нельзя удалить курс, пока на нём есть студенты ({{count}})", {
        count: course.count_stud,
      })
    : t("Нельзя удалить курс, пока на нём есть студенты");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-destructive" />
          {t("Удаление курса")}
        </CardTitle>
        <CardDescription>
          {t(
            "Курс можно удалить только если на нём нет студентов. Действие необратимо."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {hasStudents ? (
          <Alert variant="destructive">
            <LuTriangleAlert />
            <AlertTitle>{t("Удаление недоступно")}</AlertTitle>
            <AlertDescription>{blockMessage}</AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <LuTriangleAlert />
            <AlertTitle>{t("Необратимо")}</AlertTitle>
            <AlertDescription>
              {t("Вместе с курсом исчезнут темы и материалы.")}
            </AlertDescription>
          </Alert>
        )}
        {hasStudents ? (
          <Button variant="destructive" disabled>
            <Trash2 />
            {t("Удалить курс")}
          </Button>
        ) : (
          <UseConfirmationDialog
            title={
              courseName
                ? t("Удалить курс «{{name}}»?", { name: courseName })
                : t("Удалить курс?")
            }
            description={t(
              "Удаление необратимо. Вместе с курсом будут удалены все темы и материалы."
            )}
            onConfirm={() => deleteCourse(courseId)}
            trigger={
              <Button variant="destructive" disabled={isPending}>
                <Trash2 />
                {isPending ? t("Удаляем...") : t("Удалить курс")}
              </Button>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
