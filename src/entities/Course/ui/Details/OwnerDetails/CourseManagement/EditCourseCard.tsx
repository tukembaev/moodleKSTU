import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuPencil, LuSave } from "react-icons/lu";
import { FieldLabel } from "shared/components/FieldLabel";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { Textarea } from "shared/shadcn/ui/textarea";

interface EditCourseCardProps {
  courseId: string;
}

export const EditCourseCard = ({ courseId }: EditCourseCardProps) => {
  const { t } = useTranslation();
  const { data: course, isLoading } = useQuery(courseQueries.allTasks(courseId));
  const { mutate: edit_detail, isPending } = courseQueries.edit_details();

  const [disciplineName, setDisciplineName] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [requirements, setRequirements] = useState("");

  useEffect(() => {
    if (!course) return;
    setDisciplineName(course.discipline_name ?? "");
    setDescription(course.description ?? "");
    setAudience(course.audience ?? "");
    setRequirements(course.requirements ?? "");
  }, [course]);

  const trimmedName = disciplineName.trim();
  const isUnchanged =
    trimmedName === (course?.discipline_name ?? "").trim() &&
    description === (course?.description ?? "") &&
    audience === (course?.audience ?? "") &&
    requirements === (course?.requirements ?? "");
  const nameError =
    trimmedName.length === 0
      ? t("Заполните название курса")
      : trimmedName.length > 100
        ? t("Название курса не должно превышать 100 символов")
        : "";
  const canSave =
    !isPending && !isLoading && !isUnchanged && !nameError;

  const handleSave = () => {
    if (!canSave) return;
    edit_detail({
      id: courseId,
      data: {
        discipline_name: trimmedName,
        description,
        audience,
        requirements,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuPencil className="h-5 w-5 text-primary" />
          {t("Редактировать курс")}
        </CardTitle>
        <CardDescription>
          {t("Измените название курса, описание, аудиторию и требования.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="course-discipline-name" required>
            {t("Название курса")}
          </FieldLabel>
          <Input
            id="course-discipline-name"
            type="text"
            maxLength={100}
            placeholder={t("Введите название курса")}
            value={disciplineName}
            onChange={(event) => setDisciplineName(event.target.value)}
            disabled={isLoading || isPending}
          />
          {nameError && !isLoading && (
            <span className="text-xs text-red-500">{nameError}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="course-description">{t("Описание")}</FieldLabel>
          <Textarea
            id="course-description"
            placeholder={t("Кратко опишите курс")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isLoading || isPending}
            className="min-h-20"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="course-audience">{t("Аудитория")}</FieldLabel>
            <Textarea
              id="course-audience"
              placeholder={t("Для кого этот курс")}
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              disabled={isLoading || isPending}
              className="min-h-20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="course-requirements">{t("Требования")}</FieldLabel>
            <Textarea
              id="course-requirements"
              placeholder={t("Что нужно знать перед началом")}
              value={requirements}
              onChange={(event) => setRequirements(event.target.value)}
              disabled={isLoading || isPending}
              className="min-h-20"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={!canSave} className="self-start">
          <LuSave />
          {isPending ? t("Сохраняем...") : t("Сохранить курс")}
        </Button>
      </CardContent>
    </Card>
  );
};
