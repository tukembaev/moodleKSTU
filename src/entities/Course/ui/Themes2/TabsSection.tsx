import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import {
  LuClipboardList,
  LuGlasses,
  LuList,
  LuMessageSquareText,
  LuInfo,
} from "react-icons/lu";
import { useAuth } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import ThemeAnswers from "../Answers/ThemeAnswers";
import { StudentComments } from "features/Course/hooks/StudentComments";
import { remarksQueries } from "entities/Remarks";
import ThemeFAQ from "../Themes/ThemeDetail/ThemeFAQ";
import { ThemeFeed } from "../Themes/ThemeDetail/ThemeFeed";
import { cn } from "shared/lib/utils";

interface TabsSectionProps {
  themeId: string | null;
}

export const TabsSection: FC<TabsSectionProps> = ({ themeId }) => {
  const auth_data = useAuth();
  const [activeTab, setActiveTab] = useState("theme_answers");

  const { data: comments, isLoading: isLoadingComments } = useQuery(
    courseQueries.allThemeFeed(themeId)
  );

  const { data: themeRemarks } = useQuery({
    ...remarksQueries.byTheme(themeId),
    enabled: !!themeId && auth_data.isStudent,
  });

  const tabs = [
    {
      name: auth_data.isStudent ? "Мои файлы" : "Список студентов",
      shortName: auth_data.isStudent ? "Файлы" : "Студенты",
      value: "theme_answers",
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
    ...(auth_data.isStudent
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

  if (!themeId) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Empty>
          <EmptyContent>
            <EmptyMedia variant="icon">
              <LuInfo size={24} />
            </EmptyMedia>
            <EmptyTitle>Выберите тему</EmptyTitle>
            <EmptyDescription>
              Выберите тему из списка слева для просмотра дополнительной
              информации
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full pt-3 sm:pt-4"
      >
        <div className="mx-3 mb-0 min-w-0 overflow-x-auto pb-1 sm:mx-4">
          <TabsList className="h-auto gap-1.5 rounded-xl p-1 bg-muted justify-start flex-shrink-0 w-max cursor-pointer sm:gap-2">
          {tabs.map(({ icon: Icon, name, shortName, value, count }) => {
            const isActive = activeTab === value;
            return (
              <motion.div
                key={value}
                layout
                className={cn(
                  "flex h-9 items-center justify-center overflow-hidden rounded-lg sm:h-9",
                  isActive ? "flex-1" : "flex-none"
                )}
                onClick={() => setActiveTab(value)}
                initial={false}
                animate={{
                  width: isActive ? "auto" : 40,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <TabsTrigger value={value} asChild>
                  <motion.div
                    className="flex h-9 w-full items-center justify-center gap-1.5 px-2 sm:px-3 relative"
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
                        <div className="h-[15px] min-w-[15px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shadow-sm">
                          {count}
                        </div>
                      </motion.div>
                    )}

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.span
                          className="font-medium whitespace-nowrap text-xs sm:text-sm"
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

        <div className="bg-background mx-3 mb-3 flex-1 min-h-0 overflow-hidden flex flex-col sm:mx-4 sm:mb-4">
          <TabsContent
            value="theme_answers"
            className="m-0 p-0 data-[state=inactive]:hidden h-full overflow-auto"
          >
            <div className="h-full">
              <ThemeAnswers id={themeId} />
            </div>
          </TabsContent>

          <TabsContent
            value="feed"
            className="m-0 p-0 data-[state=inactive]:hidden h-full min-h-0 overflow-hidden"
          >
            <div className="flex h-full min-h-0 flex-col p-3 sm:p-4">
              <ThemeFeed
                items={comments || []}
                isLoading={isLoadingComments}
                theme_id={themeId}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="faq"
            className="m-0 p-0 data-[state=inactive]:hidden h-full overflow-auto"
          >
            <div className="h-full">
              <ThemeFAQ theme_id={themeId} />
            </div>
          </TabsContent>

          <TabsContent
            value="comments"
            className="m-0 p-0 data-[state=inactive]:hidden h-full min-h-0 overflow-hidden"
          >
            <div className="flex h-full min-h-0 flex-col">
              {auth_data.isStudent && <StudentComments theme_id={themeId} />}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
