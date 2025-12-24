import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CircleCheck } from "lucide-react";
import { HoverScale } from "./Animations/animate";
import UseTooltip from "./UseTooltip";
import React from "react";

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
    <div className="w-full max-w-sm grid grid-cols-3 gap-3">
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value);

        return (
          <HoverScale key={option.value}>
            <UseTooltip text={option.description}>
              <CheckboxPrimitive.Root
                checked={isChecked}
                onCheckedChange={(checked) => {
                  onChange(option.value, !!checked);
                }}
                className="relative ring-[1px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:text-primary cursor-pointer"
              >
                <option.icon className="mb-3 size-6" />
                <span className="font-medium tracking-tight">
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
