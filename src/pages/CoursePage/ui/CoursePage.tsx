import { CourseList } from "entities/Course";
import { Outlet, useLocation } from "react-router-dom";
import { AppSubRoutes } from "shared/config/routeConfig/routeConfig";

const CoursePage = () => {
  const location = useLocation();
  const isCourseTheme = location.pathname.includes(AppSubRoutes.COURSE_THEMES);

  return <div> {!isCourseTheme ? <CourseList /> : <Outlet />}</div>;
};

export default CoursePage;
