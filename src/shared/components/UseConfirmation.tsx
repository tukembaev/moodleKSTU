import { ReactNode } from "react";
import { cn } from "shared/lib/utils";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogShadcn,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "shared/shadcn/ui/alert-dialog";
import { buttonVariants } from "shared/shadcn/ui/button";

interface AlertDialogProps {
  title: string;
  description: string;
  action: () => void;
  children: ReactNode;
  cancelText?: string;
  actionText?: string;
  className?: string;
}

const UseConfirmation = ({
  title,
  description,
  action,
  children,
  cancelText = "Отмена",
  actionText = "Подтвердить",
  className,
}: AlertDialogProps) => {
  return (
    <AlertDialogShadcn>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className={cn("sm:max-w-[425px]", className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "default" }))}
            onClick={action}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogShadcn>
  );
};

export default UseConfirmation;
