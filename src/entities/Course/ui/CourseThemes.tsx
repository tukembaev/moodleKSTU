

import CourseDetails from "./CourseDetails";

const CourseThemes = () => {

  // if (isLoadingCourse) return <CourseThemeSkeleton />;

  return (
    <div className="min-h-screen flex py-3">
      <div className="w-full flex flex-col gap-4">
        <CourseDetails />   
      </div>
    </div>
  );
};

export default CourseThemes;
