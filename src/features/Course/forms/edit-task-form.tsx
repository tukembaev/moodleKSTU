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
  };
  onSubmit: (data: EditTaskFormData) => void;
  isPending?: boolean;
}

const TASK_TYPES = [
  { value: "lb", label: "Лабораторная работа" },
  { value: "pr", label: "Практическая работа" },
  { value: "lc", label: "Лекция" },
  { value: "srs", label: "СРС" },
  { value: "other", label: "Другое" },
];

export const EditTaskForm = ({
  open,
  onOpenChange,
  taskData,
  onSubmit,
  isPending = false,
}: EditTaskFormProps) => {
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
      setValue("week", taskData.week);
      setValue("title", taskData.title);
      setValue("max_points", taskData.max_points);
      setValue("description", taskData.description || "");
      setValue("type_less", taskData.type_less);
    }
  }, [taskData, setValue]);

  const handleFormSubmit = (data: EditTaskFormData) => {
    onSubmit(data);
    reset();
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
                    <SelectItem key={type.value} value={type.value}>
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
