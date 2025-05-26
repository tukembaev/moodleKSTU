import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { courseQueries } from "../model/services/courseQueryFactory";
import ListOfThemes from "./Themes/ListOfThemes";

import { testQueries } from "entities/Test";
import { LuLock } from "react-icons/lu";
import { Separator } from "shared/shadcn/ui/separator";
import CourseThemeSkeleton from "../lib/skeletons/CourseThemeSkeleton";
import CourseDetails from "./CourseDetails";
import { toast } from "sonner";

const CourseThemes = () => {
  const { id } = useParams();

  const safeId = id || "default_id";

  const { data, isLoading, error } = useQuery(courseQueries.allTasks(safeId));
  if (error) {
    toast.error("Ошибка при загрузке курса: " + error.message);
  }
  const {
    data: course_tests,
    // error: errorTest,
  } = useQuery(testQueries.allTest(`?course=${safeId}`));

  const isLocked = false;

  if (isLoading) return <CourseThemeSkeleton />;
  if (error) return <div>Something went wrong {error.message}</div>;

  return (
    <div className="min-h-screen flex py-3">
      <div className="w-full flex flex-col gap-4">
        <CourseDetails data={data} />

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
            {data && <ListOfThemes data={data} tests={course_tests || []} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseThemes;
