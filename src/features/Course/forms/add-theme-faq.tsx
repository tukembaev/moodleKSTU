import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useEffect } from "react";
import { LuCloudUpload, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "shared/shadcn/ui/card";
import { Label } from "shared/shadcn/ui/label";
import { CreateFAQPayload } from "../model/types/course_payload";

const Add_Theme_FAQ = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateFAQPayload>();
  const { mutate: add_theme_faq, isPending } = courseQueries.create_faq();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setValue("theme", id || "");
  }, [id, setValue]);

  const onSubmit = async (data: CreateFAQPayload) => {
    add_theme_faq(data);
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6 ">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="course">Часто задаваемый вопрос</Label>
            <Input
              type="text"
              placeholder="Введите вопрос"
              {...register("question", { required: true })}
            />
            {errors.question && (
              <span className="text-xs text-red-500">Вопрос обязателен</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Ответ</Label>
            <Input
              type="text"
              placeholder="Введите ответ"
              {...register("answer", { required: true })}
            />
            {errors.answer && (
              <span className="text-xs text-red-500">Ответ обязателен</span>
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
              <LuCloudUpload /> {isPending ? "Загрузка..." : "Добавить FAQ"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Theme_FAQ;
