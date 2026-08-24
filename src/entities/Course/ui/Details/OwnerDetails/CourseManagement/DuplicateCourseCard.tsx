import { useState } from "react";
import { LuCopy, LuTriangleAlert } from "react-icons/lu";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { Alert, AlertDescription, AlertTitle } from "shared/shadcn/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "shared/shadcn/ui/alert-dialog";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";

interface DuplicateCourseCardProps {
  courseId: string;
  courseName?: string;
}

export const DuplicateCourseCard = ({
  courseId,
  courseName,
}: DuplicateCourseCardProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: duplicateCourse, isPending } =
    courseQueries.duplicate_course();

  const handleDuplicate = () => {
    duplicateCourse(courseId, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuCopy className="h-5 w-5 text-primary" />
            Дублирование курса
          </CardTitle>
          <CardDescription>
            Создаёт полный дубликат курса: темы, материалы, описания и настройки.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert>
            <LuTriangleAlert />
            <AlertTitle>Полная копия</AlertTitle>
            <AlertDescription>
              Новый курс будет независимым. Студенты и потоки в копию не
              переносятся — их нужно назначить отдельно.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setOpen(true)} disabled={isPending}>
            <LuCopy />
            {isPending ? "Копируем курс..." : "Дублировать курс"}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!isPending) setOpen(next);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Дублировать курс?</AlertDialogTitle>
            <AlertDialogDescription>
              Будет создан такой же курс
              {courseName ? ` «${courseName}»` : ""} со всеми темами и
              материалами. Исходный курс не изменится.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
            <Button onClick={handleDuplicate} disabled={isPending}>
              {isPending ? "Копируем..." : "Создать копию"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
