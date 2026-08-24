import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { CourseStreamItemPayload } from "features/Course";

interface AddStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseStreamItemPayload) => void;
  isPending?: boolean;
}

export const AddStreamDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: AddStreamDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseStreamItemPayload>({
    defaultValues: {
      title: "",
      stream: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const submit = (data: CourseStreamItemPayload) => {
    onSubmit({
      title: data.title.trim(),
      stream: data.stream.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить поток</DialogTitle>
          <DialogDescription>
            Поток получит доступ к этому курсу. Студенты потока смогут видеть
            темы и материалы.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Название потока</Label>
            <Input
              id="title"
              placeholder="Например, ПИ-2-24"
              {...register("title", {
                required: true,
                minLength: 2,
                maxLength: 50,
              })}
            />
            {errors.title && (
              <span className="text-xs text-destructive">
                Укажите название потока от 2 до 50 символов
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="stream">Идентификатор потока</Label>
            <Input
              id="stream"
              placeholder="ID потока"
              {...register("stream", { required: true, minLength: 1 })}
            />
            {errors.stream && (
              <span className="text-xs text-destructive">
                Укажите идентификатор потока
              </span>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Добавляем..." : "Добавить поток"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
