import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { userQueries } from "entities/User";
import { LuCloudUpload } from "react-icons/lu";
import { Card } from "shared/shadcn/ui/card";
import { FieldLabel } from "shared/components/FieldLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";
import { CreateCoursePayload } from "../model/types/course_payload";

const Add_Course = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateCoursePayload>();

  const selectedOrganizationId = watch("organization_id");
  const { data: me, isLoading: isMeLoading } = useQuery(userQueries.me());

  const departments = useMemo(() => {
    const employments = me?.employee_profile?.employments ?? [];
    const unique = new Map<string, string>();

    for (const job of employments) {
      if (!job.organization_id || unique.has(job.organization_id)) continue;
      unique.set(job.organization_id, job.organization_name);
    }

    return Array.from(unique, ([id, name]) => ({ id, name }));
  }, [me]);

  const setDepartment = (id: string) => {
    const department = departments.find((item) => item.id === id);
    setValue("organization_id", id, { shouldValidate: true });
    setValue("organization_name", department?.name ?? "", {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (departments.length === 1 && !selectedOrganizationId) {
      setDepartment(departments[0].id);
    }
  }, [departments, selectedOrganizationId]);

  const { mutate: add_course, isPending } = courseQueries.create_course();
  const onSubmit = async (data: CreateCoursePayload) => {
    const organization_name =
      departments.find((item) => item.id === data.organization_id)?.name ??
      data.organization_name;
    add_course({
      discipline_name: data.discipline_name,
      organization_id: data.organization_id,
      organization_name,
    });
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6">
        <form onSubmit={handleSubmit(onSubmit, onFormInvalid)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="title" className="pb-2" required>
              Название курса
            </FieldLabel>
            <Input
              type="text"
              placeholder="Введите название курса"
              maxLength={30}
              minLength={6}
              {...register("discipline_name", {
                ...requiredField("Заполните название курса"),
                minLength: {
                  value: 6,
                  message: "Название курса должно быть от 6 до 30 символов",
                },
                maxLength: {
                  value: 30,
                  message: "Название курса должно быть от 6 до 30 символов",
                },
              })}
            />
            {errors.discipline_name && (
              <span className="text-xs text-red-500 pt-1">
                Название курса должно быть от 6 до 30 символов
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <FieldLabel htmlFor="organization_id" className="pb-2" required>
              Кафедра
            </FieldLabel>
            <Select
              value={selectedOrganizationId || undefined}
              onValueChange={setDepartment}
              disabled={isMeLoading || departments.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isMeLoading
                      ? "Загрузка кафедр..."
                      : departments.length === 0
                        ? "Нет доступных кафедр"
                        : "Выберите кафедру"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("organization_id", requiredField("Выберите кафедру"))}
            />
            {errors.organization_id && (
              <span className="text-xs text-red-500 pt-1">
                Выберите кафедру
              </span>
            )}
            {!isMeLoading && departments.length === 0 && (
              <span className="text-xs text-muted-foreground pt-1">
                В профиле нет кафедр для привязки курса
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
