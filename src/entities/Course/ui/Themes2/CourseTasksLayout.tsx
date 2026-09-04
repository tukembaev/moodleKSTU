import { studentCanTakeTest } from "entities/Test/model/types/test";
import { ArrowLeft } from "lucide-react";
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppSubRoutes } from "shared/config";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { MaterialsSection } from "./MaterialsSection";
import { TabsSection } from "./TabsSection";
import { CourseItemKind, SelectedCourseItem, TasksList } from "./TasksList";
import { TestEditorPanel } from "./TestEditorPanel";

export const CourseTasksLayout: FC = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const isStudent = Boolean(auth?.isStudent);
  const [selectedItem, setSelectedItem] = useState<SelectedCourseItem | null>(
    null
  );

  const handleItemClick = (
    itemId: string,
    kind: CourseItemKind,
    meta?: { passed: boolean | null; is_open: boolean | null; locked?: boolean }
  ) => {
    if (kind === "test" && isStudent) {
      if (!studentCanTakeTest({ passed: meta?.passed, is_open: meta?.is_open })) {
        return;
      }
      const params = courseId ? `?course_id=${courseId}` : "";
      navigate(`/test/${AppSubRoutes.TEST_PASS}/${itemId}${params}`);
      return;
    }
    if (kind === "theme" && isStudent && meta?.locked) {
      return;
    }
    setSelectedItem({ kind, id: itemId });
  };

  const selectedThemeId =
    selectedItem?.kind === "theme" ? selectedItem.id : null;
  const isTestSelected = selectedItem?.kind === "test";
  const hasSelection = selectedItem !== null;

  return (
    <div className="grid min-h-0 gap-4 lg:h-[calc(100dvh-13rem)] lg:max-h-[calc(100dvh-13rem)] lg:grid-cols-[minmax(0,30%)_minmax(0,70%)] lg:gap-6 lg:overflow-hidden">
      <div
        className={cn(
          "min-h-0 overflow-hidden",
          hasSelection ? "hidden lg:block lg:h-full" : "block"
        )}
      >
        <TasksList
          courseId={courseId || null}
          selectedTaskId={selectedItem?.id ?? null}
          onItemClick={handleItemClick}
        />
      </div>

      <div
        className={cn(
          "min-h-0 overflow-hidden",
          !hasSelection ? "hidden lg:block lg:h-full" : "block"
        )}
      >
        {hasSelection && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mb-3 gap-1.5 lg:hidden"
            onClick={() => setSelectedItem(null)}
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к списку
          </Button>
        )}

        {isTestSelected && courseId && selectedItem ? (
          <div className="min-h-[50vh] overflow-hidden lg:h-full lg:pr-4">
            <TestEditorPanel
              testId={selectedItem.id}
              courseId={courseId}
              onDeleted={() => setSelectedItem(null)}
            />
          </div>
        ) : (
          <div className="grid min-h-[50vh] gap-4 lg:h-full lg:grid-rows-[minmax(0,2fr)_minmax(0,3fr)] lg:overflow-hidden lg:pr-4">
            <div
              className={cn(
                "flex min-h-[200px] flex-col overflow-hidden rounded-lg border lg:min-h-0",
                !selectedThemeId && "bg-muted/20"
              )}
            >
              <MaterialsSection themeId={selectedThemeId} />
            </div>

            <div className="flex min-h-[280px] flex-col overflow-hidden rounded-lg border lg:min-h-0">
              <TabsSection themeId={selectedThemeId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
