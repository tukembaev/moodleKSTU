import {
  CourseThemes,
  CourseThemesTypes,
} from "entities/Course/model/types/course";
import { Grid, List } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "shared/shadcn/ui/button";
import { Test } from "entities/Test/model/types/test";
import { useParams, useSearchParams } from "react-router-dom";
import UseTabs from "shared/components/UseTabs";
import { useAuth, useForm } from "shared/hooks";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import { categories, GridThemes, ListThemes } from "./ThemeViews";
import { mockWeek } from "shared/mocks/weekMock";

const WeekContent = ({
  weekNumber,
  baseData,
  tests,
  isStudent,
  isOwner,
  expandedId,
  setExpandedId,
  themeRefs,
  openForm,
  isMobile,
  id_theme,
  viewMode,
}: {
  weekNumber: number;
  baseData: CourseThemes;
  tests: Test[];
  isStudent: boolean;
  isOwner: boolean;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  themeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  openForm: any;
  isMobile: boolean | undefined;
  id_theme?: string;
  viewMode: "grid" | "list";
}) => {
  const [weekData, setWeekData] = useState<CourseThemes | null>(null);
  console.log(weekNumber

  )
  useEffect(() => {
    // Simulate fetch
    // In a real scenario, you would fetch data for the specific week here
    // const fetchData = async () => { ... }

    // Using mockWeek as requested
    const mockedData = { ...baseData, detail: mockWeek.detail } as unknown as CourseThemes;
    setWeekData(mockedData);
  }, [weekNumber, baseData]);

  if (!weekData) {
    return <div className="py-8 text-center text-muted-foreground">Загрузка...</div>;
  }

  // Define the order of categories
  const orderedCategories: (keyof CourseThemesTypes)[] = [
    "lb", // Laboratory
    "pr", // Practice
    "lc", // Lectures
    "srs", // SRS
    "test", // Tests
    "other", // Other
  ];

  return (
    <div className="flex flex-col gap-4 pb-10">
      {orderedCategories.map((catKey) => {
        const category = categories.find((c) => c.key === catKey);

        // Determine if we should show this category
        let hasItems = false;
        if (catKey === "test") {
          // For tests, we currently don't have week filtering in the mock/types provided in context,
          // so we'll show them if they exist. In a real app, filter by week.
          hasItems = tests.length > 0;
        } else {
          hasItems = (weekData.detail[catKey]?.length || 0) > 0;
        }

        if (!hasItems) return null;

        return (
          <div key={catKey} className="flex flex-col">
            <h2 className="text-xl font-semibold flex items-center gap-2 pt-4">
              {category?.icon}
              {category?.title}
            </h2>
            {viewMode === "grid" ? (
              <GridThemes
                categoryKey={catKey}
                data={weekData}
                tests={tests}
                isStudent={isStudent}
                isOwner={isOwner}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                themeRefs={themeRefs}
                openForm={openForm}
                isMobile={isMobile}
                id_theme={id_theme}
              />
            ) : (
              <ListThemes
                categoryKey={catKey}
                data={weekData}
                tests={tests}
                isStudent={isStudent}
                isOwner={isOwner}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                themeRefs={themeRefs}
                openForm={openForm}
                isMobile={isMobile}
                id_theme={id_theme}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const ListOfThemes = ({
  data,
  tests,
}: {
  data: CourseThemes;
  tests: Test[];
}) => {
  const { id, isStudent } = useAuth();
  const { id: id_theme } = useParams();
  const isOwner = id === data?.course_owner[0]?.user_id;

  const [searchParams] = useSearchParams();
  const theme_id = searchParams.get("themeId");
  const themeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openForm = useForm();
  const isMobile = useIsMobile();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("theme_view") as "grid" | "list";
    return saved || "grid";
  });

  useEffect(() => {
    if (isMobile !== undefined) {
      if (isMobile) {
        setViewMode("list");
      } else {
        const saved = localStorage.getItem("theme_view") as "grid" | "list";
        if (saved) {
          setViewMode(saved);
        }
      }
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile !== undefined && !isMobile) {
      localStorage.setItem("theme_view", viewMode);
    }
  }, [viewMode, isMobile]);

  useEffect(() => {
    if (theme_id && themeRefs.current[theme_id]) {
      const allThemes = Object.values(data?.detail || {}).flat();
      const theme = allThemes.find((t) => t.id === theme_id);

      if (theme && !theme.locked) {
        const element = themeRefs.current[theme_id];
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        setExpandedId(theme_id);
      }
    }
  }, [theme_id, data]);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Generate tabs for 16 weeks
  const tabs = Array.from({ length: 16 }, (_, i) => {
    const weekNum = i + 1;
    return {
      name: `${weekNum} неделя`,
      value: `week-${weekNum}`,
      icon: null, // Or some calendar icon if desired
      count: 8, // We could calculate this if we had the data upfront, but we fetch it lazily
      content: (
        <WeekContent
          weekNumber={weekNum}
          baseData={data}
          tests={tests}
          isStudent={isStudent}
          isOwner={isOwner}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          themeRefs={themeRefs}
          openForm={openForm}
          isMobile={isMobile}
          id_theme={id_theme}
          viewMode={viewMode}
        />
      ),
    };
  });

  return (
    <div className="flex flex-col gap-4 relative w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        {/* Wrapper to control width if needed, UseTabs handles overflow */}
        <div className="w-full max-w-full overflow-hidden">
          <UseTabs tabs={tabs} classNames="w-full" defaultValue="week-8" />
        </div>

        {!isMobile && (
          <div className="flex gap-2 absolute right-0 top-0 z-10 bg-background pl-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              isAnimated={false}
              onClick={() => handleViewModeChange("grid")}
              className="touch-manipulation"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              isAnimated={false}
              onClick={() => handleViewModeChange("list")}
              className="touch-manipulation"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOfThemes;
