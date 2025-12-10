import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Control, useController } from "react-hook-form";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { Calendar } from "shared/shadcn/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/shadcn/ui/popover";
import { ru } from "date-fns/locale";
interface DatePickerProps {
  control: Control<any>;
  name: string;
  className?: string;
}

export function UseDatePicker({ control, name, className }: DatePickerProps) {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          isAnimated={false}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "PPP", { locale: ru })
          ) : (
            <span>Выберите дату</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[9999]">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
