import { useAuth } from "shared/hooks";
import { CourseStatisticsTab } from "./CourseStatisticsTab";
import { StudentCourseStatisticsTab } from "./StudentCourseStatisticsTab";

const CourseStatistic = () => {
  const { isStudent } = useAuth();
  console.log(isStudent)
  return (
    <div className="flex flex-col gap-2">
      {/* {isStudent ? <StudentCourseStatisticsTab /> : <CourseStatisticsTab />}0 */}
      'adsd'
    </div>
  );
};

export default CourseStatistic;
