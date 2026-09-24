import { CourseLessonsStatusCounter, CourseProgress } from "entities/Course";
import { useTranslation } from "react-i18next";
import { LuInfo } from "react-icons/lu";
import { useAuth } from "shared/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/shadcn/ui/tooltip";
import { HoverScale } from "../Animations/animate";

export default function CourseStatisticTooltip({
  progress,
  count_lb_pr,
  count_stud,
}: {
  progress: CourseProgress;
  count_lb_pr: CourseLessonsStatusCounter;
  count_stud?: number;
}) {
  const { t } = useTranslation();
  const { isStudent } = useAuth();
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <HoverScale>
          <TooltipTrigger asChild>
            <LuInfo className="cursor-pointer w-6 h-6" />
          </TooltipTrigger>
        </HoverScale>

        <TooltipContent side="right">
          {!isStudent ? (
            <p>
              {t("Количество студентов : {{count}}", { count: count_stud })}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <p>
                {t("Общий прогресс : {{success}}/{{failure}}", {
                  success: progress?.success,
                  failure: progress?.failure,
                })}
              </p>
              <p>
                {t("Лабораторных: {{done}} из {{total}}", {
                  done: count_lb_pr?.lb_done,
                  total: count_lb_pr?.lb_left,
                })}
              </p>
              <p>
                {t("Практик: {{done}} из {{total}}", {
                  done: count_lb_pr?.pr_done,
                  total: count_lb_pr?.pr_left,
                })}
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
