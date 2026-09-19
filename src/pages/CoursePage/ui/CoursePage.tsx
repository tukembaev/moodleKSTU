import { CourseList } from "entities/Course";
import { Outlet, useLocation } from "react-router-dom";
import { AppSubRoutes } from "shared/config/routeConfig/routePath";

const CoursePage = () => {
  const location = useLocation();
  const isAnnouncementPath =
    /^\/courses\/[^/]+\/(?:announcements|feed)\/?$/.test(location.pathname);
  const isCourseTheme =
    location.pathname.includes(AppSubRoutes.COURSE_THEMES) || isAnnouncementPath;

  return (
    <div>
      {" "}
      
      {!isCourseTheme ? (
        <div className="flex flex-col">
          <h2 className="hidden text-4xl font-semibold tracking-tight text-left md:block sm:text-5xl">
            Мои курсы
          </h2>
          <p className="text-sm text-muted-foreground md:mt-1.5 md:text-lg">
            Все курсы, которые вы сохраняли или загружали
          </p>
          <CourseList />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default CoursePage;
