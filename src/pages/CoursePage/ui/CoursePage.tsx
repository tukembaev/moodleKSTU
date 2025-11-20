import { CourseList } from "entities/Course";
import { Outlet, useLocation } from "react-router-dom";
import { AppSubRoutes } from "shared/config";
import { useAuth } from "shared/hooks";
import { toast } from "sonner";

const CoursePage = () => {
  const location = useLocation();
  const isCourseTheme = location.pathname.includes(AppSubRoutes.COURSE_THEMES);
  const auth = useAuth();

  return (
    <div>
      {" "}
      
      {!isCourseTheme ? (
        <div className="flex flex-col">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
            Мои курсы
          </h2>
          <p className="mt-1.5 text-lg text-muted-foreground">
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
