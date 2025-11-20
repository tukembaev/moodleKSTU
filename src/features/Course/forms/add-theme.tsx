import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Textarea } from "shared/shadcn/ui/textarea";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useEffect, useState } from "react";
import { LuCaptionsOff, LuCloudUpload, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckboxCard from "shared/components/CheckboxCard";
import { Card } from "shared/shadcn/ui/card";
import { Label } from "shared/shadcn/ui/label";
import { CreateThemePayload } from "../model/types/course_payload";

const Add_Theme = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateThemePayload>();

  const typeLabels: Record<string, string> = {
    lb: "Лабораторная работа",
    pr: "Практическое занятие",
    lc: "Лекционное занятие",
    other: "Другое",
    srs: "СРС",
  };
  const type_less: Record<string, string> = {
    lb: "Лб",
    pr: "Пр",
    lc: "Лк",
    other: "Другое",
    srs: "СРС",
  };
  const [themeType, setThemeType] = useState("Неизвестный тип");

  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const navigate = useNavigate();

  const { mutate: add_theme, isPending } = courseQueries.create_theme();

  const options = [
    {
      label: "Закрытый",
      description: "Эта тема будет закрыта по умолчанию для каждого студента",
      value: "locked",
      icon: LuCaptionsOff,
    },
  ];

  const selectedValues = watch("locked") ? ["locked"] : [];

  const handleCheckboxChange = (value: string, checked: boolean) => {
    console.log(value);
    setValue("locked", checked);
  };

  const onSubmit = async (data: CreateThemePayload) => {
    add_theme(data);
  };
  useEffect(() => {
    if (type && id) {
      setValue("type_less", type_less[type]);
      setValue("course", id);
      setThemeType(typeLabels[type]);
    }
  }, [type]);
  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6 ">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type_theme">Тип занятия</Label>
            <Input type="text" value={themeType} disabled />

            {errors.type_less && (
              <span className="text-xs text-red-500">Тип обязателен</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Название</Label>
            <Textarea
              placeholder="Введите название"
              className="resize-none break-words w-full max-w-full"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-xs text-red-500">Название обязательно</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              placeholder="Введите описание"
              className="resize-none break-words w-full max-w-full"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              {...register("description", { required: true })}
              rows={4}
            />
            {errors.description && (
              <span className="text-xs text-red-500">Описание обязательно</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="max_points">Макс. баллы</Label>
            <Input
              type="number"
              placeholder="Введите баллы"
              {...register("max_points", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.max_points && (
              <span className="text-xs text-red-500">
                Укажите количество баллов
              </span>
            )}
          </div>

          {/* <div className="flex flex-col gap-2">
            <Label htmlFor="open_date">Дата открытия</Label>
            <UseDatePicker control={control} name="open_date" />
            {errors.open_date && (
              <span className="text-xs text-red-500">Дата обязательна</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="deadline">Дедлайн</Label>
            <UseDatePicker control={control} name="deadline" />
            {errors.deadline && (
              <span className="text-xs text-red-500">Дедлайн обязателен</span>
            )}
          </div> */}

          <div className="flex flex-col gap-2">
            <Label htmlFor="count_hours">Часы</Label>
            <Input
              type="number"
              placeholder="Введите часы"
              {...register("count_hours", {
                required: true,
                valueAsNumber: true,
                validate: (v) => v <= 60 || "Максимум 60 часов",
              })}
            />
            {errors.count_hours && (
              <span className="text-xs text-red-500">
                {errors.count_hours.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="locked">Дополнительно</Label>
            <CheckboxCard
              options={options}
              selectedValues={selectedValues}
              onChange={handleCheckboxChange}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {/* <Button
              variant="outline"
              className="w-full mt-4"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              <LuX /> Отменить
            </Button> */}
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload /> {isPending ? "Загрузка..." : "Добавить тему"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Theme;
