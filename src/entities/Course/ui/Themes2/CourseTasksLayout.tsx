import { studentCanTakeTest } from "entities/Test/model/types/test";
import { ChevronLeft } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { useMobileBackHandler } from "shared/lib/navigation/mobile-back";
import { cn } from "shared/lib/utils";
import {
  clearFocusCourseItem,
  peekFocusCourseItem,
  openTestPass,
  useCourseId,
} from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import { CourseItemKind, SelectedCourseItem, TasksList } from "./TasksList";
import { TestEditorPanel } from "./TestEditorPanel";
import { ThemeWorkspace } from "./ThemeWorkspace";

interface CourseTasksLayoutProps {
  openThemeRequest?: { id: string; nonce: number } | null;
}

type LayoutLocationState = {
  selectedCourseItem?: SelectedCourseItem | null;
};

/** Список тем скрыт ниже lg — открытая тема занимает весь экран. */
const STACKED_LAYOUT_QUERY = "(max-width: 1023px)";

const isStackedViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia(STACKED_LAYOUT_QUERY).matches;

function useStackedViewport() {
  const [stacked, setStacked] = useState(isStackedViewport);

  useEffect(() => {
    const media = window.matchMedia(STACKED_LAYOUT_QUERY);
    const onChange = () => setStacked(media.matches);
    media.addEventListener("change", onChange);
    setStacked(media.matches);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return stacked;
}

export const CourseTasksLayout: FC<CourseTasksLayoutProps> = ({
  openThemeRequest,
}) => {
  const courseId = useCourseId();
  const navigate = useNavigate();
  const location = useLocation();
  const isStacked = useStackedViewport();
  const auth = useAuth();
  const isStudent = Boolean(auth?.isStudent);
  const pushedSelection = useRef(false);
  const seenCourseId = useRef(courseId);
  const [selectedItem, setSelectedItem] = useState<SelectedCourseItem | null>(
    () =>
      peekFocusCourseItem() ??
      (openThemeRequest ? { kind: "theme", id: openThemeRequest.id } : null)
  );

  useEffect(() => {
    const item = peekFocusCourseItem();
    const previousCourseId = seenCourseId.current;
    const courseChanged = previousCourseId !== courseId && previousCourseId !== "";
    seenCourseId.current = courseId;

    if (item) {
      setSelectedItem(item);
      const timer = window.setTimeout(() => {
        const current = peekFocusCourseItem();
        if (current?.id === item.id && current.kind === item.kind) {
          clearFocusCourseItem();
        }
      }, 0);
      return () => window.clearTimeout(timer);
    }

    if (courseChanged) setSelectedItem(null);
  }, [courseId, location.key]);

  const selectItem = (item: SelectedCourseItem | null) => {
    setSelectedItem(item);
    if (!isStackedViewport()) return;
    const state = (location.state as LayoutLocationState | null) ?? {};
    if (item) {
      pushedSelection.current = true;
      navigate(
        { pathname: location.pathname, search: location.search },
        {
          state: { ...state, selectedCourseItem: item },
          replace: Boolean(state.selectedCourseItem),
        }
      );
      return;
    }
    if (state.selectedCourseItem) {
      pushedSelection.current = false;
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!isStackedViewport() || !pushedSelection.current) return;
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
    selectItem({ kind, id: itemId });
  };

  const selectedThemeId =
    selectedItem?.kind === "theme" ? selectedItem.id : null;
  const isTestSelected = selectedItem?.kind === "test";
  const hasSelection = selectedItem !== null;

  useMobileBackHandler(isStacked && hasSelection, () => selectItem(null));

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
        {hasSelection && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-1 h-9 w-fit shrink-0 px-2 lg:hidden"
            onClick={() => selectItem(null)}
          >
            <ChevronLeft className="size-4" />
            К темам
          </Button>
        )}
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
