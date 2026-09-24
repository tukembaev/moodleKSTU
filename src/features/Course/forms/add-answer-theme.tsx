import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { isGradableThemeType } from "features/Course/forms/add-theme/add-theme-constants";

import { useFormParam } from "shared/hooks";
import { Card } from "shared/shadcn/ui/card";
import { FieldLabel } from "shared/components/FieldLabel";
import { UploadAnswerPayload } from "../model/types/course_payload";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LuCloudUpload } from "react-icons/lu";
import { useCourseId } from "shared/lib/navigation/hidden-ids";


const Add_Answer_Theme = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,

    setValue,
    watch,
  } = useForm<UploadAnswerPayload>();
  const { mutate: add_answer, isPending } = courseQueries.create_answer();

  const taskId = useFormParam("id");
  const courseId = useCourseId();
  const { data: courseDetails } = useQuery({
    ...courseQueries.allTasks(courseId || null),
    enabled: Boolean(courseId && taskId),
  });
  const theme = courseDetails?.detail?.find((item) => item.id === taskId);
  const canUpload = !theme || isGradableThemeType(theme.type_less);

  useEffect(() => {
    setValue("task", taskId || "");
  }, [taskId, setValue]);

  const onSubmit = async () => {
    if (theme && !isGradableThemeType(theme.type_less)) return;
    const files = watch("list_files");
    const task = watch("task");
    const formData = new FormData();

    const fileArray = files ? Array.from(files) : [];

    fileArray.forEach((file, index) => {
      formData.append(`list_files[${index}]`, file, file.name);
    });
    formData.append("task", task || taskId || "");

    add_answer(formData);
  };

  if (theme && !canUpload) {
    return (
      <section className="py-4">
        <Card className="p-6 text-sm text-muted-foreground">
          {t("Для этого типа занятия загрузка файлов не нужна.")}
        </Card>
      </section>
    );
  }

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6 ">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="file">
              {t("Материалы (выберите несколько файлов)")}
            </FieldLabel>
            <Input type="file" multiple {...register("list_files")} />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
           
            <Button type="submit" className="w-full mt-4" disabled={isPending || !canUpload}>
              <LuCloudUpload />{" "}
              {isPending ? t("Загрузка...") : t("Загрузить материал")}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Answer_Theme;
