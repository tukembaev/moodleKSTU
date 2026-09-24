import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuCloudUpload, LuOctagonAlert, LuX } from "react-icons/lu";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "shared/shadcn/ui/card";
import { FieldLabel } from "shared/components/FieldLabel";
import { FinishCourseFormPayload } from "../model/types/course_payload";
import { UseConfirmationDialog } from "shared/components";

const End_Course = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    // formState: { errors },
    setValue,
    watch,
  } = useForm<FinishCourseFormPayload>();

  const location = useLocation();
  const segments = location.pathname.split("/");
  const courseId = segments.at(-1);

  const [searchParams] = useSearchParams();
  const user_id = Number(searchParams.get("user_id"));
  const current_points = Number(searchParams.get("points"));
  const extra_points = watch("points");

  const maxAvailable = Math.min(30, 100 - current_points);
  const isLimitExceeded = (extra_points || 0) + current_points > 100;

  const navigate = useNavigate();
  setValue("course_id", courseId as string);
  setValue("status", true);
  setValue("user_id", user_id);
  const { mutate: finish_course, isPending } = courseQueries.finish_course();
  const onSubmit = async (data: FinishCourseFormPayload) => {
    finish_course(data);
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="title" className="pb-2">
              {t("Причина дополнительных баллов")}
            </FieldLabel>
            <Input
              type="text"
              placeholder={t("Введите причину")}
              maxLength={30}
              minLength={6}
              {...register("reason", {
                required: false,
                minLength: 6,
                maxLength: 30,
              })}
            />
          </div>
          <div className="flex flex-col ">
            <FieldLabel htmlFor="points" className="pb-2">
              {t("Количество доп. баллов")}
            </FieldLabel>
            <Input
              type="number"
              placeholder={t("Макс: {{max}}", { max: maxAvailable })}
              {...register("points", {
                required: false,
                valueAsNumber: true,
                validate: (value) => {
                  const total = current_points + (value || 0);
                  if (value && value > maxAvailable) {
                    return t("Можно добавить не больше {{max}} баллов", {
                      max: maxAvailable,
                    });
                  }
                  if (total > 100) {
                    return t(
                      "Общий лимит 100: сейчас {{current}}, добавляете {{value}}",
                      { current: current_points, value }
                    );
                  }
                  return true;
                },
              })}
              onInput={(e) => {
                const input = e.currentTarget;
                const value = parseInt(input.value, 10);

                if (value > maxAvailable) {
                  input.value = String(maxAvailable);
                }
                if (input.value.length > 2) {
                  input.value = input.value.slice(0, 2);
                }
              }}
              max={maxAvailable}
              disabled={isLimitExceeded}
            />
            {extra_points !== undefined && !isLimitExceeded && (
              <span className="text-xs text-gray-400 pt-3">
                {t("Итого баллов: {{current}} + {{extra}} = {{total}}", {
                  current: current_points,
                  extra: extra_points,
                  total: current_points + extra_points,
                })}
              </span>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant={"outline"}
              className="w-full mt-4"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              <LuX />
              {t("Отменить")}
            </Button>
            <UseConfirmationDialog
              title={t("Подтвердите завершение курса")}
              description={t(
                "Это действие нельзя отменить. Убедитесь, что всё заполнено корректно."
              )}
              icon={<LuOctagonAlert className="h-7 w-7 text-destructive" />}
              onConfirm={handleSubmit(onSubmit)}
              trigger={
                <Button
                  type="button"
                  className="w-full mt-4"
                  disabled={isPending}
                >
                  {isPending ? t("Загрузка...") : t("Подвести итог")}
                  <LuCloudUpload />
                </Button>
              }
            />
          </div>
        </form>
      </Card>
    </section>
  );
};

//TODO Для форм с патчем использовать иконку wand-sparkels

export default End_Course;
