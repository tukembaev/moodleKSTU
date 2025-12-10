import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ModuleThemesList from "./Themes/ModuleThemesList";

import { testQueries } from "entities/Test";
import { LuLock } from "react-icons/lu";
import { Separator } from "shared/shadcn/ui/separator";
import CourseDetails from "./CourseDetails";

const CourseThemes = () => {
  const { id } = useParams();
  const safeId = id || "default_id";
  const {
    data: course_tests,
  
    // error: errorTest,
  } = useQuery(testQueries.allTest(`?course=${safeId}`));

  const isLocked = false;

  // if (isLoadingCourse) return <CourseThemeSkeleton />;

  return (
    <div className="min-h-screen flex py-3">
      <div className="w-full flex flex-col gap-4">
        <CourseDetails />

        <Separator />
        <div className="flex flex-col gap-4 relative">
          {isLocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80">
              <LuLock className="w-12 h-12 text-gray-700" />
              <p className="text-lg font-semibold text-gray-800 mt-2">
                Доступ запрещен, купите курс
              </p>
            </div>
          )}

          <div className={`flex flex-col gap-4 ${isLocked ? "blur-xs" : ""}`}>
            <ModuleThemesList
              course_id={safeId}
              // course_name={course_name}
              tests={course_tests || []}
              // course_owner={course_owner}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseThemes;
