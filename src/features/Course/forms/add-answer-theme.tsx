import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuCloudUpload } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";
import { Card } from "shared/shadcn/ui/card";
import { Label } from "shared/shadcn/ui/label";
import { UploadAnswerPayload } from "../model/types/course_payload";
import { useEffect } from "react";

const Add_Answer_Theme = () => {
  const {
    register,
    handleSubmit,

    setValue,
    watch,
  } = useForm<UploadAnswerPayload>();
  const { mutate: add_answer, isPending } = courseQueries.create_answer();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setValue("task", id || "");
  }, [id, setValue]);

  const onSubmit = async () => {
    const files = watch("list_files");
    const formData = new FormData();

    const fileArray = files ? Array.from(files) : [];

    fileArray.forEach((file, index) => {
      formData.append(`list_files[${index}]`, file, file.name);
    });
    formData.append("task", id || "");

    add_answer(formData);
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6 ">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="file">Материалы (выберите несколько файлов)</Label>
            <Input type="file" multiple {...register("list_files")} />
          </div>

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

export default Add_Answer_Theme;
