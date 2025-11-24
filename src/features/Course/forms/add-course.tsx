import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuCloudUpload, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Card } from "shared/shadcn/ui/card";
import { Label } from "shared/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "shared/shadcn/ui/select";
import { CreateCoursePayload } from "../model/types/course_payload";

const Add_Course = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateCoursePayload>();

  const navigate = useNavigate();
  const selectedCredit = watch("credit");
  const selectedControlForm = watch("control_form");
  const selectedCategory = watch("category");

  const { mutate: add_course, isPending } = courseQueries.create_course();
  const onSubmit = async (data: CreateCoursePayload) => {
    add_course(data);
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="pb-2">
              Дисциплина
            </Label>
            <Input
              type="text"
              placeholder="Введите название дисциплины"
              maxLength={30}
              minLength={6}
              {...register("discipline_name", {
                required: true,
                minLength: 6,
                maxLength: 30,
              })}
            />
            {errors.discipline_name && (
              <span className="text-xs text-red-500 pt-1">
                Название дисциплины должно быть от 6 до 30 символов
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="control" className="pb-2">
              Категории
              {/* (несколько штук) */}
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("category", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <span>{selectedCategory || "Выберите категорию"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Технологии">Технологии</SelectItem>
                <SelectItem value="Бизнес">Бизнес</SelectItem>
                <SelectItem value="Финансы">Финансы</SelectItem>
                <SelectItem value="Здоровье">Здоровье</SelectItem>
                <SelectItem value="Политика">Политика</SelectItem>
                <SelectItem value="Наука">Наука</SelectItem>
                <SelectItem value="Спорт">Спорт</SelectItem>
              
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("control_form", { required: "Кредит обязателен" })}
            />
            {errors.control_form && (
              <span className="text-xs text-red-500 pt-1 ">
                Форма контроля обязательна
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="credit" className="pb-2">
              Кредит
              {/* ( опционный для частных) */}
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("credit", Number(value), { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <span>{selectedCredit || "Выберите количество кредитов"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("credit", { required: "Кредит обязателен" })}
            />
            {errors.credit && (
              <span className="text-xs text-red-500 pt-1">
                Кредит обязателен
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="control" className="pb-2">
              Форма контроля
              {/* (Убрать возможно) */}
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("control_form", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <span>{selectedControlForm || "Выберите форму контроля"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Экзамен">Экзамен</SelectItem>
                <SelectItem value="Устный">Устный</SelectItem>
                <SelectItem value="СРС">СРС</SelectItem>
                <SelectItem value="Отчет">Отчет</SelectItem>
                <SelectItem value="Тестирование">Тестирование</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("control_form", { required: "Кредит обязателен" })}
            />
            {errors.control_form && (
              <span className="text-xs text-red-500 pt-1 ">
                Форма контроля обязательна
              </span>
            )}
          </div>

        
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
           
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload />
              {isPending ? "Загрузка..." : "Добавить курс"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

//TODO Для форм с патчем использовать иконку wand-sparkels

export default Add_Course;
