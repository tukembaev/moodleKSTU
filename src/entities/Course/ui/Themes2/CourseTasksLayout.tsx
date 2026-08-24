import { studentCanTakeTest } from "entities/Test/model/types/test";
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppSubRoutes } from "shared/config";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
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

  return (
    <div className="grid h-[calc(100dvh-13rem)] max-h-[calc(100dvh-13rem)] min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
      <div className="h-full min-h-0 overflow-hidden">
        <TasksList
          courseId={courseId || null}
          selectedTaskId={selectedItem?.id ?? null}
          onItemClick={handleItemClick}
        />
      </div>

      {isTestSelected && courseId && selectedItem ? (
        <div className="h-full min-h-0 overflow-hidden pr-4">
          <TestEditorPanel
            testId={selectedItem.id}
            courseId={courseId}
            onDeleted={() => setSelectedItem(null)}
          />
        </div>
      ) : (
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,2fr)_minmax(0,3fr)] gap-4 overflow-hidden pr-4">
          <div
            className={cn(
              "flex min-h-0 flex-col overflow-hidden rounded-lg border",
              !selectedThemeId && "bg-muted/20"
            )}
          >
            <MaterialsSection themeId={selectedThemeId} />
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border">
            <TabsSection themeId={selectedThemeId} />
          </div>
        </div>
      )}
    </div>
  );
};
