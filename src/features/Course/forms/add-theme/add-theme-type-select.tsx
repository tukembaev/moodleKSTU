import { FieldLabel } from "shared/components/FieldLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { cn } from "shared/lib/utils";
import { TYPE_LABELS, TYPE_SELECT_ORDER } from "./add-theme-constants";

/** Полный список типов + видимый скроллбар (Radix по умолчанию скрывает его — остаётся только колесо). */
const themeTypeSelectContentClassName = cn(
  "[&_[data-radix-select-viewport]]:!h-auto",
  "[&_[data-radix-select-viewport]]:max-h-[min(20rem,var(--radix-select-content-available-height))]",
  "[&_[data-radix-select-viewport]]:[scrollbar-width:thin]",
  "[&_[data-radix-select-viewport]]:[&::-webkit-scrollbar]:block",
  "[&_[data-radix-select-viewport]]:[&::-webkit-scrollbar]:w-2",
  "[&_[data-radix-select-viewport]]:[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&_[data-radix-select-viewport]]:[&::-webkit-scrollbar-thumb]:bg-border"
);

interface AddThemeTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ThemeTypeSelectItems = () => (
  <>
    {TYPE_SELECT_ORDER.map((key) => (
      <SelectItem key={key} value={TYPE_LABELS[key]}>
        {TYPE_LABELS[key]}
      </SelectItem>
    ))}
  </>
);

export const AddThemeTypeSelect = ({
  value,
  onChange,
  error,
}: AddThemeTypeSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor="type_theme" required>
        Тип занятия
      </FieldLabel>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите тип занятия" />
        </SelectTrigger>
        <SelectContent
          position="item-aligned"
          className={themeTypeSelectContentClassName}
        >
          <ThemeTypeSelectItems />
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
