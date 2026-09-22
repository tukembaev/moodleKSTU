import { CourseList } from "entities/Course";
import { Outlet, useLocation } from "react-router-dom";
import { AppSubRoutes } from "shared/config/routeConfig/routePath";

const CoursePage = () => {
  const location = useLocation();
  const isAnnouncementPath =
    /^\/courses\/[^/]+\/(?:announcements|feed)\/?$/.test(location.pathname);
  const isCourseTheme =
    location.pathname.includes(AppSubRoutes.COURSE_THEMES) || isAnnouncementPath;

  return !isCourseTheme ? <CourseList /> : <Outlet />;
};

export default CoursePage;
