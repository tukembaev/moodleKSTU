import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "shared/shadcn/ui/label";
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
  const testId = watch("test_id");

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="test_id">Выберите тест</Label>
      {userTests.length === 0 ? (
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            value="Нет доступных тестов"
            disabled
            className="w-full"
          />
          <span className="text-xs text-muted-foreground">
            Создайте тест, чтобы добавить его в тему
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
            <SelectValue placeholder="Выберите тест" />
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
        <span className="text-xs text-red-500">Выберите тест</span>
      )}
    </div>
  );
};

