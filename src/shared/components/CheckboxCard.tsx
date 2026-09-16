import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CircleCheck } from "lucide-react";
import { HoverScale } from "./Animations/animate";
import UseTooltip from "./UseTooltip";
import React from "react";
import { cn } from "shared/lib/utils";

interface Option {
  label: string;
  description: string;
  value: string;
  icon: React.ElementType;
}

interface CheckboxCardProps {
  options: Option[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
}

const CheckboxCard: React.FC<CheckboxCardProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "grid w-full gap-4",
        options.length === 2 ? "max-w-md grid-cols-2" : "max-w-sm grid-cols-3"
      )}
    >
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value);

        return (
          <HoverScale key={option.value} className="h-full w-full">
            <UseTooltip text={option.description}>
              <CheckboxPrimitive.Root
                checked={isChecked}
                onCheckedChange={(checked) => {
                  onChange(option.value, !!checked);
                }}
                className="relative flex h-full min-h-[108px] w-full flex-col rounded-lg px-4 py-3 text-start text-muted-foreground ring-[1px] ring-border data-[state=checked]:text-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary cursor-pointer"
              >
                <option.icon className="mb-3 size-6 shrink-0" />
                <span className="min-h-[2.5rem] font-medium leading-tight tracking-tight">
                  {option.label}
                </span>

                {isChecked && (
                  <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
                    <CircleCheck className="fill-primary text-primary-foreground" />
                  </CheckboxPrimitive.Indicator>
                )}
              </CheckboxPrimitive.Root>
            </UseTooltip>
          </HoverScale>
        );
      })}
    </div>
  );
};

export default CheckboxCard;
