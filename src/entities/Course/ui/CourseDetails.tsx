import { useState } from "react";
import { motion } from "motion/react";
import {
  LuBookA,
  LuInfo,
  LuLock,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import AboutCourse from "./Details/AboutCourse";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { courseQueries } from "../model/services/courseQueryFactory";
import { CourseManagementTab } from "./Details/OwnerDetails/CourseManagement";
import CourseResultTable from "./Details/OwnerDetails/CourseResultTable";
import { CourseTasksLayout } from "./Themes2";
import { Badge } from "shared/shadcn/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";

const CourseDetails = () => {
  const { id } = useParams();
  const {isStudent} = useAuth();
  const safeId = id || "";
  const isLocked = false;
  const [activeTab, setActiveTab] = useState("study_proccess");
  
  const { data: courseModulesData, isLoading } = useQuery(
    courseQueries.courseModules(safeId)
  );
  const { isLoading: isLoadingDetails } = useQuery(
    courseQueries.allTasks(safeId)
  );
  const tabs = [
    {
      name: "Учебный процесс",
      shortName: "Процесс",
      value: "study_proccess",
      icon: LuInfo,
      count: 0,
    },
    {
      name: "О курсе",
      shortName: "О курсе",
      value: "about_course",
      icon: LuInfo,
      count: 0,
    },
    ...(!isStudent ? [
      {
        name: "Успеваемость студентов",
        shortName: "Успеваемость",
        value: "students_progress",
        icon: LuBookA,
        count: 0,
      },
      {
        name: "Управление курсом",
        shortName: "Управление",
        value: "course_management",
        icon: LuSettings,
        count: 0,
      },
    ] : []),
  ];
  
  if (isLoading || isLoadingDetails) {
    return <div className="py-8 text-center text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-full lg:overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-3 shrink-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-col gap-2 pt-2 sm:gap-3">
            <h1 className="text-xl font-bold tracking-tight break-words sm:text-2xl md:text-4xl">
              {courseModulesData?.discipline_name}
            </h1>
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border-2 border-border shrink-0">
                <AvatarImage src={courseModulesData?.course_owner?.[0]?.avatar} />
                <AvatarFallback className="bg-muted">
                  <LuUser className="h-4 w-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground font-medium truncate sm:text-base">
                {courseModulesData?.course_owner?.[0]?.owner_name}
              </span>
            </div>
          </div>

          <div className="w-full min-w-0 overflow-x-auto pb-1 -mx-1 px-1 sm:w-auto sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
            <TabsList className="h-auto gap-1.5 rounded-xl p-1 bg-muted justify-start flex-shrink-0 w-max sm:gap-2 sm:justify-center">
          {tabs.map(({ icon: Icon, name, shortName, value, count }) => {
            
            return (
              <TabsTrigger key={value} value={value} asChild>
                <motion.div
                  className="flex h-9 sm:h-10 items-center justify-center gap-1.5 px-2 sm:px-3 relative cursor-pointer rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  
                  <span className="font-medium whitespace-nowrap text-xs sm:text-sm">
                    <span className="sm:hidden">{shortName}</span>
                    <span className="hidden sm:inline">{name}</span>
                  </span>
                  
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                      {count}
                    </Badge>
                  )}
                </motion.div>
              </TabsTrigger>
            );
          })}
        </TabsList>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
          <TabsContent value="study_proccess" className="m-0 h-full p-0 data-[state=inactive]:hidden">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full min-h-0"
            >
              <div className="relative flex h-full min-h-0 flex-col gap-4 pt-2">
                {isLocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80">
                    <LuLock className="w-12 h-12 text-gray-700" />
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      Доступ запрещен, купите курс
                    </p>
                  </div>
                )}
                
                <div className={`h-full min-h-0 ${isLocked ? "blur-xs" : ""}`}>
                  <CourseTasksLayout />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="about_course" className="m-0 h-full overflow-y-auto p-0 data-[state=inactive]:hidden">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AboutCourse
                requirements={courseModulesData?.requirements}
                description={courseModulesData?.description}
                audience={courseModulesData?.audience}
                course_owner={courseModulesData?.course_owner?.[0]}
              />
            </motion.div>
          </TabsContent>

          {!isStudent && (
            <TabsContent value="students_progress" className="m-0 h-full overflow-y-auto p-0 data-[state=inactive]:hidden">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CourseResultTable />
              </motion.div>
            </TabsContent>
          )}

          {!isStudent && (
            <TabsContent value="course_management" className="m-0 h-full overflow-y-auto p-0 data-[state=inactive]:hidden">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CourseManagementTab
                  courseId={safeId}
                  courseName={courseModulesData?.discipline_name}
                />
              </motion.div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default CourseDetails;
