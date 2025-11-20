import { useForm } from "react-hook-form";
import { LuCloudUpload, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/shadcn/ui/button";
import { Card } from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";

import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";

import { UseDatePicker, UseMultiSelect } from "shared/components";
import { TestPayload } from "../model/types/test_payload";

const Add_Test = () => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label>Название теста</Label>
            <Input
              type="text"
              placeholder="Введите название"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-xs text-red-500">Название обязательно</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Описание</Label>
            <Input
              type="text"
              placeholder="Введите описание"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-xs text-red-500">Описание обязательно</span>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="deadline">Дата открытия</Label>
            <UseDatePicker
              control={control}
              name="opening_date"
              className="w-full"
            />
            {errors.opening_date && (
              <span className="text-xs text-red-500">
                Дата открытия обязательна
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="deadline">Дедлайн</Label>
            <UseDatePicker
              control={control}
              name="deadline"
              className="w-full"
            />
            {errors.deadline && (
              <span className="text-xs text-red-500">Дедлайн обязателен</span>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="deadline">
              Выберите курсы для закрепления теста
            </Label>
            <UseMultiSelect
              options={courseOptions}
              onValueChange={setSelectedCourses}
              defaultValue={selectedCourses}
              placeholder="Выберите курсы"
              variant="default"
              animation={2}
              maxCount={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Максимальное количество баллов</Label>
            <Input
              type="number"
              placeholder="Введите число"
              {...register("max_points", { required: true, min: 0 })}
            />
            {errors.max_points && (
              <span className="text-xs text-red-500">
                Укажите корректное число
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ссылка на форму</Label>
            <Input
              type="url"
              placeholder="https://example.com/form"
              {...register("link_form", { required: true })}
            />
            {errors.link_form && (
              <span className="text-xs text-red-500">Ссылка обязательна</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ссылка на документ</Label>
            <Input
              type="url"
              placeholder="https://example.com/doc"
              {...register("link_doc", { required: true })}
            />
            {errors.link_doc && (
              <span className="text-xs text-red-500">Ссылка обязательна</span>
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
              <LuX /> Отменить
            </Button>
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload />{" "}
              {isPending ? "Загрузка..." : "Опубликовать тест"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Test;
