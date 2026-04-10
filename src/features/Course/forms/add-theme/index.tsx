import { Button } from "shared/shadcn/ui/button";
import { LuCloudUpload } from "react-icons/lu";
import { Card } from "shared/shadcn/ui/card";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { CreateThemePayload } from "../../model/types/course_payload";
import { useAddThemeForm } from "./use-add-theme-form";
import { AddThemeTypeSelect } from "./add-theme-type-select";
import { AddThemeTestFields } from "./add-theme-test-fields";
import { AddThemeRegularFields } from "./add-theme-regular-fields";
import { AddThemeLockedCheckbox } from "./add-theme-locked-checkbox";

const Add_Theme = () => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    selectedType,
    handleTypeChange,
    isTestType,
    userTests,
  } = useAddThemeForm();

  const { mutate: add_theme, isPending: isThemePending } = courseQueries.create_theme();
  const { mutate: attach_test, isPending: isTestPending } = testQueries.attach_test_to_week();

  const isPending = isThemePending || isTestPending;

  const onSubmit = async (data: CreateThemePayload) => {
    // Validate test_id when test type is selected
    if (isTestType && !data.test_id) {
      return;
    }

    if (isTestType && data.test_id) {
      // Use the new API for attaching test to week
      attach_test({
        week_id: data.week,
        test_id: data.test_id,
      });
    } else {
      // Use the old API for regular themes
      add_theme(data);
    }
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <AddThemeTypeSelect
            value={selectedType}
            onChange={handleTypeChange}
            error={errors.type_less?.message}
          />

          {isTestType ? (
            <AddThemeTestFields
              setValue={setValue}
              watch={watch}
              userTests={userTests}
            />
          ) : (
            <AddThemeRegularFields
              register={register}
              errors={errors}
              isTestType={isTestType}
            />
          )}

          {!isTestType && (
            <AddThemeLockedCheckbox setValue={setValue} watch={watch} />
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload />{" "}
              {isPending ? "Загрузка..." : "Добавить задание"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Theme;

