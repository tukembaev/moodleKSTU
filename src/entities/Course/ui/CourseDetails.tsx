import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LuBookA,
  LuChartBar,
  LuInfo,
  LuLock,
} from "react-icons/lu";
import AboutCourse from "./Details/AboutCourse";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { courseQueries } from "../model/services/courseQueryFactory";
import CourseResultTable from "./Details/OwnerDetails/CourseResultTable";
import { CourseStatisticsTab } from "./Details/OwnerDetails/CourseStatisticsTab";
import { StudentCourseStatisticsTab } from "./Details/OwnerDetails/StudentCourseStatisticsTab";
import { CourseTasksLayout } from "./Themes2";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";

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
      value: "study_proccess",
      icon: LuInfo,
      count: 0,
    },
    {
      name: "О курсе",
      value: "about_course",
      icon: LuInfo,
      count: 0,
    },
    ...(!isStudent ? [
      {
        name: "Успеваемость студентов",
        value: "students_progress",
        icon: LuBookA,
        count: 0,
      },
    ] : []),
    {
      name: "Статистика",
      value: "course_statistics",
      icon: LuChartBar,
      count: 0,
    },
  ];
  
  if (isLoading || isLoadingDetails) {
    return <div className="py-8 text-center text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-lg sm:text-xl tracking-tight">
          {courseModulesData?.course_owner?.[0]?.owner_name}
        </span>
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight pb-2">
          {courseModulesData?.discipline_name}
        </span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <TabsList className="h-auto gap-2 rounded-xl p-1 bg-muted justify-start flex-shrink-0 w-fit">
          {tabs.map(({ icon: Icon, name, value, count }) => {
            const isActive = activeTab === value;
            return (
              <motion.div
                key={value}
                layout
                className={cn(
                  'flex h-10 items-center justify-center overflow-hidden rounded-lg',
                  isActive ? 'flex-1' : 'flex-none'
                )}
                onClick={() => setActiveTab(value)}
                initial={false}
                animate={{
                  width: isActive ? 'auto' : 44
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }}
              >
                <TabsTrigger value={value} asChild>
                  <motion.div
                    className="flex h-10 w-full items-center justify-center gap-1.5 px-3 relative cursor-pointer"
                    animate={{ filter: 'blur(0px)' }}
                    exit={{ filter: 'blur(2px)' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    
                    {/* Счетчик для неактивного таба */}
                    {!isActive && count > 0 && (
                      <motion.div
                        className="absolute -top-0.5 right-0.5"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="h-[15px] min-w-[15px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shadow-sm">
                          {count}
                        </div>
                      </motion.div>
                    )}
                    
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.span
                          className="font-medium whitespace-nowrap"
                          initial={{ opacity: 0, scaleX: 0.8 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0.8 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          style={{ originX: 0 }}
                        >
                          {name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Счетчик для активного таба */}
                    {count > 0 && isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                          {count}
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                </TabsTrigger>
              </motion.div>
            );
          })}
        </TabsList>

        <div className="mt-4">
          <TabsContent value="study_proccess" className="m-0 p-0 data-[state=inactive]:hidden">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4 relative pt-2">
                {isLocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80">
                    <LuLock className="w-12 h-12 text-gray-700" />
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      Доступ запрещен, купите курс
                    </p>
                  </div>
                )}
                
                <div className={`${isLocked ? "blur-xs" : ""}`}>
                  <CourseTasksLayout />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="about_course" className="m-0 p-0 data-[state=inactive]:hidden">
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
            <TabsContent value="students_progress" className="m-0 p-0 data-[state=inactive]:hidden">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CourseResultTable />
              </motion.div>
            </TabsContent>
          )}

          <TabsContent value="course_statistics" className="m-0 p-0 data-[state=inactive]:hidden">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isStudent ? <StudentCourseStatisticsTab /> : <CourseStatisticsTab />}
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CourseDetails;
