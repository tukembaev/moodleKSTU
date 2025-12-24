import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import CheckboxCard from "shared/components/CheckboxCard";
import { Label } from "shared/shadcn/ui/label";
import { CreateThemePayload } from "../../model/types/course_payload";
import { LOCKED_OPTIONS } from "./add-theme-constants";

interface AddThemeLockedCheckboxProps {
  setValue: UseFormSetValue<CreateThemePayload>;
  watch: UseFormWatch<CreateThemePayload>;
}

export const AddThemeLockedCheckbox = ({
  setValue,
  watch,
}: AddThemeLockedCheckboxProps) => {
  const selectedValues = watch("locked") ? ["locked"] : [];

  const handleCheckboxChange = (_value: string, checked: boolean) => {
    setValue("locked", checked);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="locked">Дополнительно</Label>
      <CheckboxCard
        options={LOCKED_OPTIONS}
        selectedValues={selectedValues}
        onChange={handleCheckboxChange}
      />
    </div>
  );
};

