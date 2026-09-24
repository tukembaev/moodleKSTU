import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CheckboxCard from "shared/components/CheckboxCard";
import { FieldLabel } from "shared/components/FieldLabel";
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
  const { t } = useTranslation();
  const lockedOptions = useMemo(
    () =>
      LOCKED_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
        description: t(option.description),
      })),
    [t]
  );
  const selectedValues = watch("locked") ? ["locked"] : [];

  const handleCheckboxChange = (_value: string, checked: boolean) => {
    setValue("locked", checked);
  };

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor="locked">{t("Дополнительно")}</FieldLabel>
      <CheckboxCard
        options={lockedOptions}
        selectedValues={selectedValues}
        onChange={handleCheckboxChange}
      />
    </div>
  );
};

