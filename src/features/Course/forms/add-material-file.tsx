import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuCloudUpload } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useFormParam } from "shared/hooks";
import { Card } from "shared/shadcn/ui/card";
import { FieldLabel } from "shared/components/FieldLabel";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";
import { UploadMaterialPayload } from "../model/types/course_payload";
import { useEffect } from "react";

const Add_Material_file = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadMaterialPayload>();
  const { mutate: add_material, isPending } = courseQueries.create_material();
  const navigate = useNavigate();

  const themeId = useFormParam("id");

  useEffect(() => {
    setValue("course_detail", themeId || "");
  }, [themeId, setValue]);

  const onSubmit = async (data: UploadMaterialPayload) => {
    const file = watch("file");

    const formData = new FormData();
    if (file?.length) {
      formData.append("file", file[0]); // Передаем первый файл в бинарном виде
    } else {
      formData.append("url", data.url || "");
    }
    formData.append("description", watch("description"));
    formData.append("course_detail", data.course_detail);

    add_material(formData);
    navigate(-1);
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6 ">
        <form onSubmit={handleSubmit(onSubmit, onFormInvalid)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="course" required>
              {t("Описание материала")}
            </FieldLabel>
            <Input
              type="text"
              placeholder={t("Введите описание")}
              {...register("description", requiredField(t("Заполните описание материала")))}
            />
            {errors.description && (
              <span className="text-xs text-red-500">{t("Вопрос обязателен")}</span>
            )}
          </div>
          {!watch("file")?.length && (
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="course">{t("Ссылка на файл/видео/фото")}</FieldLabel>
              <Input
                type="text"
                placeholder={t("Добавьте ссылку")}
                {...register("url")}
              />
            </div>
          )}
          {!watch("url")?.length && (
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="title">{t("Материал")}</FieldLabel>
              <Input
                type="file"
                placeholder={t("Выберите файл..")}
                {...register("file")}
              />
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload />{" "}
              {isPending ? t("Загрузка...") : t("Загрузить материал")}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Material_file;
