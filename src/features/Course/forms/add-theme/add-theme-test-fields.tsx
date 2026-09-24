import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FieldLabel } from "shared/components/FieldLabel";
import { Input } from "shared/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { CreateThemePayload } from "../../model/types/course_payload";
import { Test } from "entities/Test/model/types/test";

interface AddThemeTestFieldsProps {
  setValue: UseFormSetValue<CreateThemePayload>;
  watch: UseFormWatch<CreateThemePayload>;
  userTests: Test[];
}

export const AddThemeTestFields = ({
  setValue,
  watch,
  userTests,
}: AddThemeTestFieldsProps) => {
  const { t } = useTranslation();
  const testId = watch("test_id");

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor="test_id" required>
        {t("Выберите тест")}
      </FieldLabel>
      {userTests.length === 0 ? (
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            value={t("Нет доступных тестов")}
            disabled
            className="w-full"
            readOnly
          />
          <span className="text-xs text-muted-foreground">
            {t("Создайте тест, чтобы добавить его в тему")}
          </span>
        </div>
      ) : (
        <Select
          onValueChange={(value) => {
            setValue("test_id", value, { shouldValidate: true });
          }}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("Выберите тест")} />
          </SelectTrigger>
          <SelectContent>
            {userTests.map((test) => (
              <SelectItem key={test.id} value={test.id}>
                {test.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {!testId && userTests.length > 0 && (
        <span className="text-xs text-red-500">{t("Выберите тест")}</span>
      )}
    </div>
  );
};
