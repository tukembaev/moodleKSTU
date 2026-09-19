import { FieldLabel } from "shared/components/FieldLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { TYPE_LABELS, TYPE_SELECT_ORDER } from "./add-theme-constants";

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
        <SelectContent>
          <ThemeTypeSelectItems />
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
