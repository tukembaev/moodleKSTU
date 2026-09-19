import * as React from "react";
import { Label } from "shared/shadcn/ui/label";
import { cn } from "shared/lib/utils";

type FieldLabelProps = React.ComponentProps<typeof Label> & {
  required?: boolean;
};

export function FieldLabel({
  required = false,
  children,
  className,
  ...props
}: FieldLabelProps) {
  return (
    <Label className={cn("flex-wrap items-baseline", className)} {...props}>
      {children}
      <span className="shrink-0 text-xs font-normal text-muted-foreground">
        {required ? "обязательное поле" : "необязательное поле"}
      </span>
    </Label>
  );
}
