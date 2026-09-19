import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { remarksQueries } from "entities/Remarks";
import { isGradableThemeType } from "features/Course/forms/add-theme/add-theme-constants";
import { StudentComments } from "features/Course/hooks/StudentComments";
import { AnimatePresence, motion } from "motion/react";
import { FC, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuClipboardList,
  LuGlasses,
  LuInfo,
  LuList,
  LuMessageSquareText,
} from "react-icons/lu";
import { useAuth } from "shared/hooks";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Separator } from "shared/shadcn/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";
import ThemeAnswers from "../Answers/ThemeAnswers";
import ThemeFAQ from "../Themes/ThemeDetail/ThemeFAQ";
import { ThemeFeed } from "../Themes/ThemeDetail/ThemeFeed";
import { MaterialsSection } from "./MaterialsSection";

const FILES_TAB = "theme_answers";

type WorkspaceTab = {
  name: string;
  shortName: string;
  value: string;
  icon: IconType;
  count: number;
};

interface ThemeWorkspaceProps {
  themeId: string | null;
}

interface WorkspaceTabsListProps {
  tabs: WorkspaceTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const WorkspaceTabsList: FC<WorkspaceTabsListProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mx-0 mb-0 min-w-0 overflow-x-auto sm:mx-1">
      <TabsList className="h-auto w-max flex-shrink-0 cursor-pointer justify-start gap-1.5 rounded-xl bg-muted p-1 sm:gap-2">
        {tabs.map(({ icon: Icon, name, shortName, value, count }) => {
          const isActive = activeTab === value;
          return (
            <motion.div
              key={value}
              layout
              className={cn(
                "flex h-9 items-center justify-center overflow-hidden rounded-lg",
                isActive ? "flex-1" : "flex-none"
              )}
              onClick={() => onTabChange(value)}
              initial={false}
              animate={{ width: isActive ? "auto" : 40 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <TabsTrigger value={value} asChild>
                <motion.div
                  className="relative flex h-9 w-full items-center justify-center gap-1.5 px-2 sm:px-3"
                  animate={{ filter: "blur(0px)" }}
                  exit={{ filter: "blur(2px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {!isActive && count > 0 && (
                    <motion.div
                      className="absolute -top-0.5 right-0.5"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-sm">
                        {count}
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        className="whitespace-nowrap text-xs font-medium sm:text-sm"
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0.8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      >
                        <span className="sm:hidden">{shortName}</span>
                        <span className="hidden sm:inline">{name}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {count > 0 && isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 min-w-5 px-1.5 text-xs"
                      >
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
    </div>
  );
};

export const ThemeWorkspace: FC<ThemeWorkspaceProps> = ({ themeId }) => {
  const auth_data = useAuth();
  const courseId = useCourseId();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(FILES_TAB);
  const [materialsOpen, setMaterialsOpen] = useState(true);
  const [answersOpen, setAnswersOpen] = useState(true);

  const { data: comments, isLoading: isLoadingComments } = useQuery(
    courseQueries.allThemeFeed(themeId)
  );

  const { data: courseDetails } = useQuery({
    ...courseQueries.allTasks(courseId || null),
    enabled: Boolean(courseId && themeId),
  });
  const currentTheme = courseDetails?.detail?.find((task) => task.id === themeId);
  const canReceivePoints = isGradableThemeType(currentTheme?.type_less);
  const showStudentSubmissions = canReceivePoints;
  const showAnswersPane = !auth_data.isStudent || showStudentSubmissions;

  const { data: themeRemarks } = useQuery({
    ...remarksQueries.byTheme(themeId),
    enabled: !!themeId && auth_data.isStudent && showStudentSubmissions,
  });

  useEffect(() => {
    setMaterialsOpen(true);
    setAnswersOpen(true);
    setActiveTab(FILES_TAB);
  }, [themeId]);

  const bothCollapsed =
    isMobile &&
    activeTab === FILES_TAB &&
    !materialsOpen &&
    (!showAnswersPane || !answersOpen);
  const filesGridRows = !showAnswersPane
    ? "minmax(0,1fr)"
    : !isMobile
    ? "minmax(0,35%) auto minmax(0,1fr)"
    : materialsOpen && answersOpen
      ? "minmax(0,35%) auto minmax(0,1fr)"
      : materialsOpen
        ? "minmax(0,1fr) max-content max-content"
        : answersOpen
          ? "max-content max-content minmax(0,1fr)"
          : "max-content max-content max-content";

  const tabs: WorkspaceTab[] = [
    {
      name: auth_data.isStudent
        ? showAnswersPane
          ? "Мои файлы"
          : "Материалы"
        : "Список студентов",
      shortName: auth_data.isStudent
        ? showAnswersPane
          ? "Файлы"
          : "Материалы"
        : "Студенты",
      value: FILES_TAB,
      icon: LuList,
      count: 0,
    },
    {
      name: "Обсуждение",
      shortName: "Чат",
      value: "feed",
      icon: LuMessageSquareText,
      count: comments?.length || 0,
    },
    {
      name: "FAQ",
      shortName: "FAQ",
      value: "faq",
      icon: LuGlasses,
      count: 0,
    },
    ...(auth_data.isStudent && showStudentSubmissions
      ? [
          {
            name: "Замечания",
            shortName: "Замечания",
            value: "comments",
            icon: LuClipboardList,
            count: themeRemarks?.length || 0,
          },
        ]
      : []),
  ];

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden bg-card lg:rounded-lg lg:border",
        bothCollapsed ? "h-auto" : "h-full",
        !themeId && "bg-muted/20"
      )}
    >
      {!themeId ? (
        <div className="flex h-full items-center justify-center p-8">
          <Empty>
            <EmptyContent>
              <EmptyMedia variant="icon">
                <LuInfo size={24} />
              </EmptyMedia>
              <EmptyTitle>Выберите тему</EmptyTitle>
              <EmptyDescription>
                Выберите тему из списка слева, чтобы открыть материалы,
                файлы и обсуждение
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className={cn(
            "flex min-h-0 flex-col gap-0 lg:pt-4",
            bothCollapsed ? "h-auto" : "h-full"
          )}
        >
          <div className="flex min-w-0 items-center px-1 lg:px-3">
            <div className="min-w-0 flex-1">
              <WorkspaceTabsList
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>

          <div
            className={cn(
              "flex min-h-0 flex-col overflow-hidden lg:pt-3",
              bothCollapsed ? "flex-none" : "flex-1"
            )}
          >
            <TabsContent
              value={FILES_TAB}
              className={cn(
                "m-0 min-h-0 data-[state=inactive]:hidden",
                bothCollapsed ? "h-auto" : "h-full"
              )}
            >
              <div
                className={cn(
                  "grid min-h-0",
                  bothCollapsed ? "h-auto" : "h-full",
                  isMobile &&
                    showAnswersPane &&
                    !(materialsOpen && answersOpen) &&
                    "content-start"
                )}
                style={{ gridTemplateRows: filesGridRows }}
              >
                <div
                  className={cn(
                    "min-h-0 overflow-hidden bg-muted/15",
                    isMobile && !materialsOpen && "self-start"
                  )}
                >
                  <MaterialsSection
                    themeId={themeId}
                    collapsible={isMobile}
                    open={materialsOpen}
                    onOpenChange={setMaterialsOpen}
                  />
                </div>
                {showAnswersPane && (
                  <>
                    <Separator className="mb-0 lg:mb-4" />
                    <div
                      className={cn(
                        "min-h-0 overflow-hidden",
                        isMobile && !answersOpen && "self-start"
                      )}
                    >
                      <ThemeAnswers
                        id={themeId}
                        collapsible={isMobile}
                        open={answersOpen}
                        onOpenChange={setAnswersOpen}
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="feed"
              className="m-0 h-full min-h-0 overflow-hidden data-[state=inactive]:hidden"
            >
              <div className="flex h-full min-h-0 flex-col px-3 pb-3 lg:px-4 sm:pb-4">
                <ThemeFeed
                  items={comments || []}
                  isLoading={isLoadingComments}
                  theme_id={themeId}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="faq"
              className="m-0 h-full min-h-0 overflow-auto data-[state=inactive]:hidden"
            >
              <ThemeFAQ theme_id={themeId} />
            </TabsContent>

            <TabsContent
              value="comments"
              className="m-0 h-full min-h-0 overflow-hidden data-[state=inactive]:hidden"
            >
              {auth_data.isStudent && showStudentSubmissions && (
                <StudentComments theme_id={themeId} />
              )}
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};
