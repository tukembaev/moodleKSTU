import { FieldLabel } from "shared/components/FieldLabel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { TYPE_LABELS, TYPE_SELECT_GROUPS } from "./add-theme-constants";

interface AddThemeTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ThemeTypeSelectItems = () => (
  <>
    {TYPE_SELECT_GROUPS.map((group) => (
      <SelectGroup key={group.label}>
        <SelectLabel>{group.label}</SelectLabel>
        {group.keys.map((key) => (
          <SelectItem key={key} value={TYPE_LABELS[key]}>
            {TYPE_LABELS[key]}
          </SelectItem>
        ))}
      </SelectGroup>
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
