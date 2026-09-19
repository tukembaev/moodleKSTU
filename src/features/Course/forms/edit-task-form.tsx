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

interface EditTaskFormData {
  week: string;
  title: string;
  max_points: number;
  description: string;
  type_less: string;
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
    deadline?: string;
    locked?: boolean;
    open_date?: string;
  };
}

const toTypeLabel = (value: string) => resolveThemeTypeLabel(value);

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
  } = useForm<EditTaskFormData>();

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
          ...(taskData.deadline ? { deadline: taskData.deadline } : {}),
          ...(taskData.open_date ? { open_date: taskData.open_date } : {}),
          ...(canReceivePoints
            ? typeof taskData.locked === "boolean"
              ? { locked: taskData.locked }
              : {}
            : { locked: false }),
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать задание</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, onFormInvalid)} className="space-y-4">
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

          <div className={canReceivePoints ? "grid grid-cols-2 gap-4" : ""}>
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

          <DialogFooter>
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
