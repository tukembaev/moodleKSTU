import { UseFormRegister, FieldErrors, Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FieldLabel } from "shared/components/FieldLabel";
import { Input } from "shared/shadcn/ui/input";
import { Textarea } from "shared/shadcn/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { CreateThemePayload } from "../../model/types/course_payload";
import { requiredField } from "shared/lib/onFormInvalid";
import { ThemeDateRangeField } from "../theme-date-range-field";

interface AddThemeRegularFieldsProps {
  register: UseFormRegister<CreateThemePayload>;
  errors: FieldErrors<CreateThemePayload>;
  isTestType: boolean;
  control: Control<CreateThemePayload>;
  canReceivePoints: boolean;
  setValue: UseFormSetValue<CreateThemePayload>;
  watch: UseFormWatch<CreateThemePayload>;
}

export const AddThemeRegularFields = ({
  register,
  errors,
  isTestType,
  control,
  canReceivePoints,
  setValue,
  watch,
}: AddThemeRegularFieldsProps) => {
  return (
    <>
      {canReceivePoints && (
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="week" required>
          Неделя
        </FieldLabel>
        <Controller
          name="week"
          control={control}
          rules={requiredField("Выберите неделю")}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(parseInt(value, 10))}
              value={field.value?.toString() || "1"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите неделю" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 16 }, (_, i) => i + 1).map((week) => (
                  <SelectItem key={week} value={week.toString()}>
                    Неделя {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.week && (
          <span className="text-xs text-red-500">Выберите неделю</span>
        )}
      </div>
      )}

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="title" required={!isTestType}>
          Название
        </FieldLabel>
        <Textarea
          placeholder="Введите название"
          className="resize-none break-words w-full max-w-full"
          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
          {...register("title", requiredField("Заполните название"))}
        />
        {errors.title && (
          <span className="text-xs text-red-500">Название обязательно</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="description" required={!isTestType}>
          Описание
        </FieldLabel>
        <Textarea
          placeholder="Введите описание"
          className="resize-none break-words w-full max-w-full"
          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
          {...register("description", requiredField("Заполните описание"))}
          rows={4}
        />
        {errors.description && (
          <span className="text-xs text-red-500">Описание обязательно</span>
        )}
      </div>

      {canReceivePoints && (
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="max_points" required={!isTestType && canReceivePoints}>
          Макс. баллы
        </FieldLabel>
        <Input
          type="number"
          placeholder="Введите баллы"
          {...register("max_points", {
            ...requiredField("Укажите количество баллов"),
            valueAsNumber: true,
          })}
        />
        {errors.max_points && (
          <span className="text-xs text-red-500">
            Укажите количество баллов
          </span>
        )}
      </div>
      )}

      <ThemeDateRangeField
        openingDate={watch("opening_date")}
        deadline={watch("deadline")}
        onChange={({ opening_date, deadline }) => {
          setValue("opening_date", opening_date, { shouldDirty: true });
          setValue("deadline", deadline, { shouldDirty: true });
        }}
      />
    </>
  );
};
