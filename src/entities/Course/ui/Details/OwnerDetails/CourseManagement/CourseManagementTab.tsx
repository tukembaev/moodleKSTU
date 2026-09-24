import { useTranslation } from "react-i18next";
import { CourseAccessCard } from "./CourseAccessCard";
import { CourseStreams } from "./CourseStreams";
import { DeleteCourseCard } from "./DeleteCourseCard";
import { DuplicateCourseCard } from "./DuplicateCourseCard";
import { EditCourseCard } from "./EditCourseCard";
import { ReassignOrganizationCard } from "./ReassignOrganizationCard";

interface CourseManagementTabProps {
  courseId: string;
  courseName?: string;
}

export const CourseManagementTab = ({
  courseId,
  courseName,
}: CourseManagementTabProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("Управление курсом")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(
            "Название курса, потоки с доступом, кафедра и служебные действия преподавателя."
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <EditCourseCard courseId={courseId} />
        <CourseAccessCard courseId={courseId} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          <CourseStreams courseId={courseId} />
        </div>
        <div className="flex flex-col gap-6">
          <ReassignOrganizationCard courseId={courseId} />
          <DuplicateCourseCard courseId={courseId} courseName={courseName} />
          <DeleteCourseCard courseId={courseId} courseName={courseName} />
        </div>
      </div>
    </div>
  );
};
