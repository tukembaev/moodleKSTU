

import CourseDetails from "./CourseDetails";

const CourseThemes = () => {

  // if (isLoadingCourse) return <CourseThemeSkeleton />;

  return (
    <div className="flex flex-col gap-4 py-3">
      <div className="w-full flex flex-col gap-4">
        <CourseDetails />   
      </div>
    </div>
  );
};

export default CourseThemes;
