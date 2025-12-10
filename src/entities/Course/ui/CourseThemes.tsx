import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { courseQueries } from "../model/services/courseQueryFactory";
import ModuleThemesList from "./Themes/ModuleThemesList";

import { testQueries } from "entities/Test";
import { LuLock } from "react-icons/lu";
import { Separator } from "shared/shadcn/ui/separator";
import CourseThemeSkeleton from "../lib/skeletons/CourseThemeSkeleton";

const CourseThemes = () => {
  const { id } = useParams();

  const safeId = id || "default_id";

  // Fetch course data to get course_owner and course name
  // const { data: courseData, isLoading: isLoadingCourse } = useQuery(
  //   courseQueries.allTasks(safeId)
  // );
  const {
    data: course_tests,
    // error: errorTest,
  } = useQuery(testQueries.allTest(`?course=${safeId}`));

  const isLocked = false;

  // if (isLoadingCourse) return <CourseThemeSkeleton />;

  // const course_name = courseData?.discipline_name || "";
  // const course_owner = courseData?.course_owner;

  return (
    <div className="min-h-screen flex py-3">
      <div className="w-full flex flex-col gap-4">
        {/* <CourseDetails data={courseData} /> */}

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
