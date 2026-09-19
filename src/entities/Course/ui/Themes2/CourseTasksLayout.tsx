import { studentCanTakeTest } from "entities/Test/model/types/test";
import { FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { openTestPass, useCourseId } from "shared/lib/navigation/hidden-ids";
import { CourseItemKind, SelectedCourseItem, TasksList } from "./TasksList";
import { TestEditorPanel } from "./TestEditorPanel";
import { ThemeWorkspace } from "./ThemeWorkspace";

interface CourseTasksLayoutProps {
  openThemeRequest?: { id: string; nonce: number } | null;
}

type LayoutLocationState = {
  selectedCourseItem?: SelectedCourseItem | null;
};

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

export const CourseTasksLayout: FC<CourseTasksLayoutProps> = ({
  openThemeRequest,
}) => {
  const courseId = useCourseId();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const isStudent = Boolean(auth?.isStudent);
  const pushedSelection = useRef(false);
  const [selectedItem, setSelectedItem] = useState<SelectedCourseItem | null>(
    openThemeRequest ? { kind: "theme", id: openThemeRequest.id } : null
  );

  const selectItem = (item: SelectedCourseItem | null) => {
    setSelectedItem(item);
    if (!isMobileViewport()) return;
    const state = (location.state as LayoutLocationState | null) ?? {};
    if (item) {
      pushedSelection.current = true;
      navigate(".", {
        state: { ...state, selectedCourseItem: item },
        replace: Boolean(state.selectedCourseItem),
      });
      return;
    }
    if (state.selectedCourseItem) {
      pushedSelection.current = false;
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!isMobileViewport() || !pushedSelection.current) return;
    const fromHistory =
      (location.state as LayoutLocationState | null)?.selectedCourseItem ??
      null;
    if (!fromHistory) {
      pushedSelection.current = false;
      setSelectedItem(null);
    }
  }, [location.key, location.state]);

  useEffect(() => {
    if (!openThemeRequest) return;
    selectItem({ kind: "theme", id: openThemeRequest.id });
    // nonce is the trigger; selectItem closes over location
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openThemeRequest]);

  const handleItemClick = (
    itemId: string,
    kind: CourseItemKind,
    meta?: {
      passed: boolean | null;
      is_open: boolean | null;
      locked?: boolean;
      needsReview?: boolean | null;
    }
  ) => {
    if (kind === "test" && isStudent) {
      if (!studentCanTakeTest({
        passed: meta?.passed,
        is_open: meta?.is_open,
        needsReview: meta?.needsReview,
      })) {
        return;
      }
      openTestPass(navigate, itemId, courseId);
      return;
    }
    if (kind === "theme" && isStudent && meta?.locked) {
      return;
    }
    selectItem({ kind, id: itemId });
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
            : "flex h-[calc(100dvh-8rem)] flex-col lg:h-full"
        )}
      >
        {isTestSelected && courseId && selectedItem ? (
          <div className="min-h-0 flex-1 overflow-hidden lg:h-full lg:pr-4">
            <TestEditorPanel
              testId={selectedItem.id}
              courseId={courseId}
              onDeleted={() => selectItem(null)}
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
