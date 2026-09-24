import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useEffect } from "react";
import { LuCloudUpload } from "react-icons/lu";
import { useFormParam } from "shared/hooks";
import { Card } from "shared/shadcn/ui/card";
import { FieldLabel } from "shared/components/FieldLabel";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";
import { CreateFAQPayload } from "../model/types/course_payload";

const Add_Theme_FAQ = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateFAQPayload>();
  const { mutate: add_theme_faq, isPending } = courseQueries.create_faq();

  const themeId = useFormParam("id");

  useEffect(() => {
    setValue("theme", themeId || "");
  }, [themeId, setValue]);

  const onSubmit = async (data: CreateFAQPayload) => {
    add_theme_faq(data);
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6 ">
        <form onSubmit={handleSubmit(onSubmit, onFormInvalid)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="course" required>
              {t("Часто задаваемый вопрос")}
            </FieldLabel>
            <Input
              type="text"
              placeholder={t("Введите вопрос")}
              {...register("question", requiredField(t("Заполните вопрос")))}
            />
            {errors.question && (
              <span className="text-xs text-red-500">{t("Вопрос обязателен")}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="title" required>
              {t("Ответ")}
            </FieldLabel>
            <Input
              type="text"
              placeholder={t("Введите ответ")}
              {...register("answer", requiredField(t("Заполните ответ")))}
            />
            {errors.answer && (
              <span className="text-xs text-red-500">{t("Ответ обязателен")}</span>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload /> {isPending ? t("Загрузка...") : t("Добавить FAQ")}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Theme_FAQ;
