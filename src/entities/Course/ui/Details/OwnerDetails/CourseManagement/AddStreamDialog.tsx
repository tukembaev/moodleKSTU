import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { FieldLabel } from "shared/components/FieldLabel";
import { CourseStreamItemPayload } from "features/Course";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";

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
  const { t } = useTranslation();
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
          <DialogTitle>{t("Добавить поток")}</DialogTitle>
          <DialogDescription>
            {t(
              "Поток получит доступ к этому курсу. Студенты потока смогут видеть темы и материалы."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit, onFormInvalid)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="title" required>
              {t("Название потока")}
            </FieldLabel>
            <Input
              id="title"
              placeholder={t("Например, ПИ-2-24")}
              {...register("title", {
                ...requiredField(t("Заполните название потока")),
                minLength: {
                  value: 2,
                  message: t("Укажите название потока от 2 до 50 символов"),
                },
                maxLength: {
                  value: 50,
                  message: t("Укажите название потока от 2 до 50 символов"),
                },
              })}
            />
            {errors.title && (
              <span className="text-xs text-destructive">
                {t("Укажите название потока от 2 до 50 символов")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="stream" required>
              {t("Идентификатор потока")}
            </FieldLabel>
            <Input
              id="stream"
              placeholder={t("ID потока")}
              {...register("stream", requiredField(t("Укажите идентификатор потока")))}
            />
            {errors.stream && (
              <span className="text-xs text-destructive">
                {t("Укажите идентификатор потока")}
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
              {t("Отмена")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("Добавляем...") : t("Добавить поток")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
