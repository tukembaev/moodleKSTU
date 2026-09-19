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
      {required ? (
        <span className="shrink-0 text-destructive" aria-hidden="true">
          *
        </span>
      ) : null}
    </Label>
  );
}
