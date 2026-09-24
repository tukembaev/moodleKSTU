import { useForm } from "react-hook-form";
import { LuCloudUpload, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import { Card } from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { FieldLabel } from "shared/components/FieldLabel";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";

import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";

import { UseDatePicker, UseMultiSelect } from "shared/components";
import { TestPayload } from "../model/types/test_payload";

const Add_Test = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,

    control,
  } = useForm<TestPayload>();
  const { data } = useQuery(courseQueries.allCourses());

  const { mutate: add_test, isPending } = testQueries.create_test();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const [date] = useState<Date | undefined>(new Date());
  const [opening_date] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setValue("deadline", date!);
  }, [date, setValue]);

  useEffect(() => {
    setValue("opening_date", opening_date!);
  }, [opening_date, setValue]);

  const courseOptions: {
    label: string;
    value: string;
    icon?: string;
  }[] =
    data?.map((course) => ({
      label: course.discipline_name,
      value: String(course.id),
      icon: course.category_icon,
    })) || [];

  useEffect(() => {
    setValue(
      "course",
      selectedCourses.map((id) => id)
    );
  }, [selectedCourses, setValue]);

  const navigate = useNavigate();

  const onSubmit = async (data: TestPayload) => {
    add_test(data);
  };
  // https://docs.google.com/forms/d/e/1FAIpQLSdYBbyB6kWiHNlB_Ng9qDMPHZg_4jvE60a78lpUoAfTfRVx2Q/viewform?usp=dialog

  // https://docs.google.com/spreadsheets/d/1COC5m2Ftp-xIPeXZKoeZs2WDuuKBPTUGdjsw8qkvh54/edit?resourcekey=&gid=114923027#gid=114923027

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6 h-full overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit, onFormInvalid)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel required>{t("Название теста")}</FieldLabel>
            <Input
              type="text"
              placeholder={t("Введите название")}
              {...register("title", requiredField(t("Заполните название теста")))}
            />
            {errors.title && (
              <span className="text-xs text-red-500">{t("Название обязательно")}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel required>{t("Описание")}</FieldLabel>
            <Input
              type="text"
              placeholder={t("Введите описание")}
              {...register("description", requiredField(t("Заполните описание теста")))}
            />
            {errors.description && (
              <span className="text-xs text-red-500">{t("Описание обязательно")}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <FieldLabel htmlFor="deadline" required>
              {t("Дата открытия")}
            </FieldLabel>
            <UseDatePicker
              control={control}
              name="opening_date"
              className="w-full"
            />
            {errors.opening_date && (
              <span className="text-xs text-red-500">
                {t("Дата открытия обязательна")}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <FieldLabel htmlFor="deadline" required>
              {t("Дедлайн")}
            </FieldLabel>
            <UseDatePicker
              control={control}
              name="deadline"
              className="w-full"
            />
            {errors.deadline && (
              <span className="text-xs text-red-500">{t("Дедлайн обязателен")}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <FieldLabel htmlFor="deadline">
              {t("Выберите курсы для закрепления теста")}
            </FieldLabel>
            <UseMultiSelect
              options={courseOptions}
              onValueChange={setSelectedCourses}
              defaultValue={selectedCourses}
              placeholder={t("Выберите курсы")}
              variant="default"
              animation={2}
              maxCount={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel required>{t("Максимальное количество баллов")}</FieldLabel>
            <Input
              type="number"
              placeholder={t("Введите число")}
              {...register("max_points", {
                ...requiredField(t("Укажите максимальное количество баллов")),
                min: { value: 0, message: t("Укажите корректное число") },
                valueAsNumber: true,
              })}
            />
            {errors.max_points && (
              <span className="text-xs text-red-500">
                {t("Укажите корректное число")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel required>{t("Ссылка на форму")}</FieldLabel>
            <Input
              type="url"
              placeholder="https://example.com/form"
              {...register("link_form", requiredField(t("Укажите ссылку на форму")))}
            />
            {errors.link_form && (
              <span className="text-xs text-red-500">{t("Ссылка обязательна")}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel required>{t("Ссылка на документ")}</FieldLabel>
            <Input
              type="url"
              placeholder="https://example.com/doc"
              {...register("link_doc", requiredField(t("Укажите ссылку на документ")))}
            />
            {errors.link_doc && (
              <span className="text-xs text-red-500">{t("Ссылка обязательна")}</span>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="w-full mt-4"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              <LuX /> {t("Отменить")}
            </Button>
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload />{" "}
              {isPending ? t("Загрузка...") : t("Опубликовать тест")}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Test;
