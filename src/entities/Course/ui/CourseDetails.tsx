import {
  LuBookA,
  LuInfo,
  LuLock
} from "react-icons/lu";
import { UseTabs } from "shared/components";
import AboutCourse from "./Details/AboutCourse";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { courseQueries } from "../model/services/courseQueryFactory";
import CourseResultTable from "./Details/OwnerDetails/CourseResultTable";
import ModuleThemesList from "./Themes/ModuleThemesList";

const CourseDetails = () => {
  const { id } = useParams();
  const { isStudent } = useAuth();
  const safeId = id || "";
  const isLocked = false;
  const { data: courseModulesData, isLoading } = useQuery(
    courseQueries.courseModules(safeId)
  );

  const tabs = [
    {
      name: "Учебный процесс",
      value: "study_proccess",
      content:
        (
          <div className="flex flex-col gap-4 relative pt-2">
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
              />
            </div>
          </div>
        ),
      icon: <LuInfo />,
    },
    {
      name: "О курсе",
      value: "about_course",
      content:
        (
          <AboutCourse
            requirements={courseModulesData?.requirements}
            description={courseModulesData?.description}
            audience={courseModulesData?.audience}
            course_owner={courseModulesData?.course_owner?.[0]}
          />
        ),
      icon: <LuInfo />,
    },
    ...(!isStudent ? [
      {
        name: "Успеваемость студентов",
        value: "students_progress",
        content: <CourseResultTable />,
        icon: <LuBookA />,
      },

    ] : []),
    // {
    //   name: "Статистика",
    //   value: "course_statistics",
    //   content: isStudent ? <StudentCourseStatisticsTab /> : <CourseStatisticsTab />,
    //   icon: <LuChartBar />,
    // },
    // ...(!isStudent ? [{
    //   name: "Вовлеченность",
    //   value: "attendance",
    //   content: <CourseInvolvement />,
    //   icon: <LuHandshake />,
    // }] : []),

    // {
    //   name: "Отзывы",
    //   value: "rules",
    //   content: <TestimonialSection />,
    //   icon: <LuSpeech />,
    // },
  ];
  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <span className="text-lg sm:text-xl tracking-tight">
          {courseModulesData?.course_owner?.[0]?.owner_name}
        </span>
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight pb-2">
          {courseModulesData?.discipline_name}
        </span>
      </div>
      <UseTabs tabs={tabs}></UseTabs>
    </div>
  );
};

export default CourseDetails;
