import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { FieldLabel } from "shared/components/FieldLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { ThemeTypeSelectItems } from "./add-theme/add-theme-type-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "shared/shadcn/ui/dialog";
import { Textarea } from "shared/shadcn/ui/textarea";
import { useEffect } from "react";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import {
  isGradableThemeType,
  resolveThemeTypeLabel,
} from "./add-theme/add-theme-constants";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";
import { ThemeDateRangeField } from "./theme-date-range-field";

interface EditTaskFormData {
  week: string;
  title: string;
  max_points: number;
  description: string;
  type_less: string;
  opening_date: number | null;
  deadline: number | null;
}

interface EditTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskData?: {
    id: string;
    week: string;
    title: string;
    max_points: number;
    description?: string;
    type_less: string;
    deadline?: string | number | null;
    locked?: boolean;
    open_date?: string | number | null;
    opening_date?: string | number | null;
  };
}

const toTypeLabel = (value: string) => resolveThemeTypeLabel(value);

const toTimestamp = (value?: string | number | null) => {
  if (value == null || value === "") return undefined;
  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value < 1e12 ? value * 1000 : value;
  }
  if (/^\d+$/.test(value.trim())) {
    const numeric = Number(value);
    return numeric < 1e12 ? numeric * 1000 : numeric;
  }
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const EditTaskForm = ({
  open,
  onOpenChange,
  taskData,
}: EditTaskFormProps) => {
  const { mutate: editTheme, isPending } = courseQueries.edit_theme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    unregister,
  } = useForm<EditTaskFormData>({
    defaultValues: {
      opening_date: null,
      deadline: null,
    },
  });

  const selectedWeek = watch("week");
  const selectedType = watch("type_less");
  const canReceivePoints = isGradableThemeType(selectedType);

  useEffect(() => {
    register("type_less", requiredField("Выберите тип занятия"));
  }, [register]);

  useEffect(() => {
    if (!canReceivePoints) {
      unregister("max_points");
      unregister("week");
      return;
    }
    register("week", requiredField("Выберите неделю"));
  }, [canReceivePoints, register, unregister]);

  useEffect(() => {
    if (taskData) {
      setValue("week", String(taskData.week));
      setValue("title", taskData.title);
      setValue("max_points", taskData.max_points);
      setValue("description", taskData.description || "");
      setValue("type_less", toTypeLabel(taskData.type_less));
      setValue(
        "opening_date",
        toTimestamp(taskData.open_date ?? taskData.opening_date) ?? null
      );
      setValue("deadline", toTimestamp(taskData.deadline) ?? null);
    }
  }, [taskData, setValue]);

  const handleFormSubmit = (data: EditTaskFormData) => {
    if (!taskData?.id) return;

    editTheme(
      {
        id: taskData.id,
        data: {
          title: data.title,
          week: canReceivePoints ? Number(data.week) : Number(data.week) || 1,
          type_less: toTypeLabel(data.type_less),
          max_points: canReceivePoints ? data.max_points : 0,
          description: data.description,
          opening_date: data.opening_date ?? null,
          deadline: data.deadline ?? null,
        },
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-w-0 flex-col overflow-hidden sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Редактировать задание</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, onFormInvalid)} className="flex min-h-0 min-w-0 flex-col gap-4">
          <div className="min-w-0 space-y-4 overflow-y-auto pr-1">
          {/* Название темы */}
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="title" required>
              Название темы
            </FieldLabel>
            <Input
              type="text"
              placeholder="Введите название темы"
              {...register("title", requiredField("Заполните название темы"))}
            />
            {errors.title && (
              <span className="text-xs text-red-500">
                Название темы обязательно
              </span>
            )}
          </div>

          {/* Описание */}
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="description">Описание</FieldLabel>
            <Textarea
              placeholder="Введите описание задания"
              rows={4}
              {...register("description")}
            />
          </div>

          {canReceivePoints && (
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="max_points" required={canReceivePoints}>
              Максимальные баллы
            </FieldLabel>
            <Input
              type="number"
              min="0"
              placeholder="Введите максимальные баллы"
              {...register("max_points", {
                ...requiredField("Укажите максимальные баллы"),
                valueAsNumber: true,
                min: { value: 0, message: "Максимальные баллы не могут быть меньше 0" },
              })}
            />
            {errors.max_points && (
              <span className="text-xs text-red-500">
                Максимальные баллы обязательны
              </span>
            )}
          </div>
          )}

          <div className={canReceivePoints ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : ""}>
            {canReceivePoints && (
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="week" required>
                Неделя
              </FieldLabel>
              <Select
                value={selectedWeek}
                onValueChange={(value) => setValue("week", value, { shouldValidate: true })}
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
              {errors.week && (
                <span className="text-xs text-red-500">Неделя обязательна</span>
              )}
            </div>
            )}

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="type_less" required>
                Тип занятия
              </FieldLabel>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setValue("type_less", value, { shouldValidate: true });
                  if (!isGradableThemeType(value)) {
                    setValue("max_points", 0);
                    setValue("week", "1");
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип занятия" />
                </SelectTrigger>
                <SelectContent>
                  <ThemeTypeSelectItems />
                </SelectContent>
              </Select>
              {errors.type_less && (
                <span className="text-xs text-red-500">
                  Тип занятия обязателен
                </span>
              )}
            </div>
          </div>

          <ThemeDateRangeField
            openingDate={watch("opening_date")}
            deadline={watch("deadline")}
            onChange={({ opening_date, deadline }) => {
              setValue("opening_date", opening_date, { shouldDirty: true });
              setValue("deadline", deadline, { shouldDirty: true });
            }}
          />
          </div>

          <DialogFooter className="shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
