import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuCloudUpload, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "shared/shadcn/ui/card";
import { Label } from "shared/shadcn/ui/label";
import { UploadMaterialPayload } from "../model/types/course_payload";
import { useEffect } from "react";

const Add_Material_file = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadMaterialPayload>();
  const { mutate: add_material, isPending } = courseQueries.create_material();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setValue("course_detail", id || "");
  }, [id]);

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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="course">Описание материала</Label>
            <Input
              type="text"
              placeholder="Введите описание"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-xs text-red-500">Вопрос обязателен</span>
            )}
          </div>
          {!watch("file")?.length && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="course">Ссылка на файл/видео/фото</Label>
              <Input
                type="text"
                placeholder="Добавьте ссылку"
                {...register("url")}
              />
            </div>
          )}
          {!watch("url")?.length && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Материал</Label>
              <Input
                type="file"
                placeholder="Выберите файл.."
                {...register("file")}
              />
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload />{" "}
              {isPending ? "Загрузка..." : "Загрузить материал"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Material_file;
