import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
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
import { TYPE_LABELS } from "./add-theme/add-theme-constants";

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

const TASK_TYPES = Object.entries(TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const toTypeLabel = (value: string) => TYPE_LABELS[value] || value;

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
  } = useForm<EditTaskFormData>();

  const selectedWeek = watch("week");
  const selectedType = watch("type_less");

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
          week: Number(data.week),
          type_less: toTypeLabel(data.type_less),
          max_points: data.max_points,
          description: data.description,
          ...(taskData.deadline ? { deadline: taskData.deadline } : {}),
          ...(taskData.open_date ? { open_date: taskData.open_date } : {}),
          ...(typeof taskData.locked === "boolean" ? { locked: taskData.locked } : {}),
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Название темы */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Название темы</Label>
            <Input
              type="text"
              placeholder="Введите название темы"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-xs text-red-500">
                Название темы обязательно
              </span>
            )}
          </div>

          {/* Описание */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              placeholder="Введите описание задания"
              rows={4}
              {...register("description")}
            />
          </div>

          {/* Максимальные баллы */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="max_points">Максимальные баллы</Label>
            <Input
              type="number"
              min="0"
              placeholder="Введите максимальные баллы"
              {...register("max_points", {
                required: true,
                valueAsNumber: true,
                min: 0,
              })}
            />
            {errors.max_points && (
              <span className="text-xs text-red-500">
                Максимальные баллы обязательны
              </span>
            )}
          </div>

          {/* Неделя и Тип занятия в одной строке */}
          <div className="grid grid-cols-2 gap-4">
            {/* Неделя */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="week">Неделя</Label>
              <Select
                value={selectedWeek}
                onValueChange={(value) => setValue("week", value)}
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

            {/* Тип занятия */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="type_less">Тип занятия</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setValue("type_less", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип занятия" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.label}>
                      {type.label}
                    </SelectItem>
                  ))}
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
