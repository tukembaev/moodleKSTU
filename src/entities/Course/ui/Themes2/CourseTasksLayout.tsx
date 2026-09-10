import { studentCanTakeTest } from "entities/Test/model/types/test";
import { ArrowLeft } from "lucide-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { openTestPass, useCourseId } from "shared/lib/navigation/hidden-ids";
import { CourseItemKind, SelectedCourseItem, TasksList } from "./TasksList";
import { TestEditorPanel } from "./TestEditorPanel";
import { ThemeWorkspace } from "./ThemeWorkspace";

export const CourseTasksLayout: FC = () => {
  const courseId = useCourseId();
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
      openTestPass(navigate, itemId, courseId);
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
    <div className="grid min-h-0 gap-3 sm:gap-4 lg:h-[calc(100dvh-13rem)] lg:max-h-[calc(100dvh-13rem)] lg:grid-cols-[minmax(0,30%)_minmax(0,70%)] lg:gap-6 lg:overflow-hidden">
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
          !hasSelection
            ? "hidden lg:flex lg:h-full lg:flex-col"
            : "flex h-[calc(100dvh-9rem)] flex-col lg:h-full"
        )}
      >
        {hasSelection && (
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            className="mb-3 flex w-full min-h-[44px] shrink-0 items-center gap-2 rounded-lg border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:bg-muted/80 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Назад к списку</span>
          </button>
        )}

        {isTestSelected && courseId && selectedItem ? (
          <div className="min-h-0 flex-1 overflow-hidden lg:h-full lg:pr-4">
            <TestEditorPanel
              testId={selectedItem.id}
              courseId={courseId}
              onDeleted={() => setSelectedItem(null)}
            />
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-hidden lg:h-full lg:pr-4">
            <ThemeWorkspace themeId={selectedThemeId} />
          </div>
        )}
      </div>
    </div>
  );
};
