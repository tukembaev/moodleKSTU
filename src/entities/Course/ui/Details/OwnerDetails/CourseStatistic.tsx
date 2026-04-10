import { CourseOverallFilesStatistic } from "./Statistics/CourseOverallFilesStatistic";
import { CourseStudentsStatistic } from "./Statistics/CourseStudentsStatistic";

import { CourseRegisterLineStatistic } from "./Statistics/CourseRegisterLineStatistic";
import { CourseBlocksStatistic } from "./Statistics/CourseBlocksStatistic";

const CourseStatistic = () => {
  return (
    <div className="flex flex-col gap-2">
      <CourseBlocksStatistic />
      <div className="grid gap-6 pt-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 ">
        <CourseStudentsStatistic />

        <CourseRegisterLineStatistic />
      </div>
      <CourseOverallFilesStatistic />
    </div>
  );
};

export default CourseStatistic;
