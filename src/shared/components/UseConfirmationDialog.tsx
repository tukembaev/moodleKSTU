import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "shared/shadcn/ui/alert-dialog";
// import { Button, buttonVariants } from "shared/shadcn/ui/button";
import { ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  title: string;
  description: string;
  icon?: ReactNode;
  onConfirm: () => void;
};

export default function UseConfirmationDialog({
  trigger,
  title,
  description,
  icon,
  onConfirm,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>
            {icon && (
              <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                {icon}
              </div>
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 sm:justify-center">
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Подтвердить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
