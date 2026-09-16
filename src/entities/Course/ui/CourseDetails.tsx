import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  LuBookA,
  LuClipboardList,
  LuFolderOpen,
  LuInfo,
  LuLock,
  LuHistory,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import AboutCourse from "./Details/AboutCourse";
import { CourseAnnouncementsTab } from "./Details/CourseAnnouncementsTab";
import { CourseMaterialsTab } from "./Details/CourseMaterialsTab";
import { MySubmissionsTab } from "./Details/MySubmissionsTab";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "shared/hooks";
import {
  COURSE_FEED_TAB,
  isCourseFeedTab,
  useCourseId,
} from "shared/lib/navigation/hidden-ids";
import { courseQueries } from "../model/services/courseQueryFactory";
import { CourseManagementTab } from "./Details/OwnerDetails/CourseManagement";
import CourseResultTable from "./Details/OwnerDetails/CourseResultTable";
import { CourseTasksLayout } from "./Themes2";
import { CourseInviteQrButton } from "./invite/CourseInviteQrSection";
import { Badge } from "shared/shadcn/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";

const CourseDetails = () => {
  const id = useCourseId();
  const {isStudent} = useAuth();
  const safeId = id || "";
  const isLocked = false;
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() =>
    isCourseFeedTab(searchParams.get("tab"))
      ? COURSE_FEED_TAB
      : "study_proccess"
  );
  const [openThemeRequest, setOpenThemeRequest] = useState<{
    id: string;
    nonce: number;
  } | null>(null);
  
  const { data: courseModulesData, isLoading } = useQuery(
    courseQueries.courseModules(safeId)
  );
  const { isLoading: isLoadingDetails } = useQuery(
    courseQueries.allTasks(safeId)
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const currentTab = searchParams.get("tab");
    if (isCourseFeedTab(value)) {
      if (currentTab !== COURSE_FEED_TAB) {
        const next = new URLSearchParams(searchParams);
        next.set("tab", COURSE_FEED_TAB);
        setSearchParams(next, { replace: true });
      }
      return;
    }
    if (currentTab) {
      const next = new URLSearchParams(searchParams);
      next.delete("tab");
      setSearchParams(next, { replace: true });
    }
  };

  const openThemeFromTab = (themeId: string) => {
    setOpenThemeRequest({ id: themeId, nonce: Date.now() });
    handleTabChange("study_proccess");
  };

  useEffect(() => {
    if (isCourseFeedTab(searchParams.get("tab"))) {
      setActiveTab(COURSE_FEED_TAB);
    }
  }, [searchParams]);

  const tabs = [
    {
      name: "Учебный процесс",
      value: "study_proccess",
      icon: LuInfo,
      count: 0,
    },
    {
      name: "Лента курса",
      value: COURSE_FEED_TAB,
      icon: LuHistory,
      count: 0,
    },
    {
      name: "Материалы",
      value: "course_materials",
      icon: LuFolderOpen,
      count: 0,
    },
    ...(isStudent
      ? [
          {
            name: "Мои сдачи",
            value: "my_submissions",
            icon: LuClipboardList,
            count: 0,
          },
        ]
      : []),
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
      {
        name: "Управление курсом",
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
    <div className="flex min-h-0 flex-col gap-3 sm:gap-4 lg:h-full lg:overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-3 shrink-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex w-full min-w-0 items-stretch gap-3 pt-1 sm:w-auto sm:pt-2">
            <div className="flex w-full min-w-0 flex-col items-center gap-2 text-center sm:w-auto sm:items-start sm:gap-3 sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-xl font-bold tracking-tight break-words sm:text-2xl md:text-4xl">
                {courseModulesData?.discipline_name}
              </h1>
              {!isStudent && safeId && (
              <CourseInviteQrButton
                courseId={safeId}
                courseName={courseModulesData?.discipline_name}
                teacherName={courseModulesData?.course_owner?.[0]?.owner_name}
              />
            )}
              </div>
          
              
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
           
          </div>

          <div className="w-full min-w-0 overflow-x-auto pb-1 -mx-1 px-1 sm:w-auto sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
            <TabsList className="h-auto w-max flex-shrink-0 justify-start gap-1.5 rounded-xl bg-muted p-1 sm:gap-2 sm:justify-center">
          {tabs.map(({ icon: Icon, name, value, count }) => {
            return (
              <TabsTrigger
                key={value}
                value={value}
                aria-label={name}
                title={name}
                className="group h-9 w-auto flex-none cursor-pointer overflow-hidden rounded-lg px-0 py-0 sm:h-10"
              >
                <span className="flex h-full items-center">
                  <Icon className="mx-2.5 h-4 w-4 shrink-0" />
                  <span
                    className="grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity] duration-200 ease-out group-hover:grid-cols-[1fr] group-hover:opacity-100 group-focus-visible:grid-cols-[1fr] group-focus-visible:opacity-100 group-data-[state=active]:grid-cols-[1fr] group-data-[state=active]:opacity-100"
                  >
                    <span className="flex min-w-0 items-center overflow-hidden pr-2.5">
                      <span className="whitespace-nowrap text-xs font-medium sm:text-sm">
                        {name}
                      </span>
                      {count > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 h-5 min-w-5 px-1.5 text-xs"
                        >
                          {count}
                        </Badge>
                      )}
                    </span>
                  </span>
                </span>
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
                  <CourseTasksLayout openThemeRequest={openThemeRequest} />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value={COURSE_FEED_TAB} className="m-0 h-full overflow-y-auto p-0 data-[state=inactive]:hidden">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CourseAnnouncementsTab onOpenTheme={openThemeFromTab} />
            </motion.div>
          </TabsContent>

          <TabsContent value="course_materials" className="m-0 h-full overflow-y-auto p-0 data-[state=inactive]:hidden">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CourseMaterialsTab onOpenTheme={openThemeFromTab} />
            </motion.div>
          </TabsContent>

          {isStudent && (
            <TabsContent value="my_submissions" className="m-0 h-full overflow-y-auto p-0 data-[state=inactive]:hidden">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MySubmissionsTab onOpenTheme={openThemeFromTab} />
              </motion.div>
            </TabsContent>
          )}

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
