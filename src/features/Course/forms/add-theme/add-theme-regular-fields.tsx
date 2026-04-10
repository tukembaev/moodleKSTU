import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "shared/shadcn/ui/label";
import { Input } from "shared/shadcn/ui/input";
import { Textarea } from "shared/shadcn/ui/textarea";
import { CreateThemePayload } from "../../model/types/course_payload";

interface AddThemeRegularFieldsProps {
  register: UseFormRegister<CreateThemePayload>;
  errors: FieldErrors<CreateThemePayload>;
  isTestType: boolean;
}

export const AddThemeRegularFields = ({
  register,
  errors,
  isTestType,
}: AddThemeRegularFieldsProps) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Название</Label>
        <Textarea
          placeholder="Введите название"
          className="resize-none break-words w-full max-w-full"
          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
          {...register("title", { required: !isTestType })}
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
          {...register("description", { required: !isTestType })}
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
            required: !isTestType,
            valueAsNumber: true,
          })}
        />
        {errors.max_points && (
          <span className="text-xs text-red-500">
            Укажите количество баллов
          </span>
        )}
      </div>
    </>
  );
};

