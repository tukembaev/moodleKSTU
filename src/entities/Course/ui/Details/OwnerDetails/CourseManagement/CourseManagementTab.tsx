import { CourseStreams } from "./CourseStreams";
import { DuplicateCourseCard } from "./DuplicateCourseCard";

interface CourseManagementTabProps {
  courseId: string;
  courseName?: string;
}

export const CourseManagementTab = ({
  courseId,
  courseName,
}: CourseManagementTabProps) => {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Управление курсом
        </h2>
        <p className="text-sm text-muted-foreground">
          Потоки с доступом к курсу и служебные действия преподавателя.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          <CourseStreams courseId={courseId} />
        </div>
        <DuplicateCourseCard courseId={courseId} courseName={courseName} />
      </div>
    </div>
  );
};
