import { Label } from "shared/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { TYPE_LABELS } from "./add-theme-constants";

interface AddThemeTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const AddThemeTypeSelect = ({
  value,
  onChange,
  error,
}: AddThemeTypeSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="type_theme">Тип занятия</Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите тип занятия" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

