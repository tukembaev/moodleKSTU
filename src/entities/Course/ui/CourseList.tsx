import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { Archive, ArchiveRestore, Building2, ChevronRight, Trash2 } from "lucide-react";
import { LuArchive, LuBookCheck, LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  FadeInList,
  SpringPopupList,
  UseConfirmationDialog,
  UseTooltip,
} from "shared/components";
import { FormQuery } from "shared/config/formConfig/formQuery";
import { AppRoutes } from "shared/config/routeConfig/routePath";
import { useAuth, useForm } from "shared/hooks";
import { openCourse } from "shared/lib/navigation/hidden-ids";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/shadcn/ui/tabs";
import CourseCardSkeleton from "../lib/skeletons/CourseCardSkeleton";
import { courseQueries } from "../model/services/courseQueryFactory";
import { Course, canShowDeleteCourse, courseHasStudents, isCourseArchived } from "../model/types/course";

const ownerInitials = (name?: string) =>
  (name || "П")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const CourseCard = ({
  course,
  canArchive,
  forceArchived,
}: {
  course: Course;
  canArchive?: boolean;
  forceArchived?: boolean;
}) => {
  const navigate = useNavigate();
  const owner = course.course_owner?.[0];
  const courseInitial = (course.discipline_name || "?")
    .trim()
    .charAt(0)
    .toUpperCase();
  const archived = forceArchived || isCourseArchived(course);
  const { mutate: setArchive, isPending } = courseQueries.set_archive();
  const { mutate: deleteCourse, isPending: isDeleting } =
    courseQueries.delete_course();
  const hasStudents = courseHasStudents(course.count_stud);
  const canDelete = canShowDeleteCourse(course, canArchive, forceArchived);

  return (
    <div className="group flex min-w-1/3 flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-all duration-300 hover:border-foreground/15 hover:shadow-md">
      <div className="relative overflow-hidden rounded-xl bg-muted/70 p-4 dark:bg-muted/40">
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 -right-1 select-none text-8xl font-bold leading-none text-foreground/[0.06]"
        >
          {courseInitial}
        </span>
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-semibold leading-snug tracking-tight">
              {course.discipline_name}
            </h3>
            <div className="mt-1 flex shrink-0 items-center gap-2">
              {archived && (
                <Badge variant="secondary" className="font-normal">
                  Архив
                </Badge>
              )}
              {course.is_end && (
                <UseTooltip text={`Сдано на ${course.course_points}`}>
                  <LuBookCheck className="size-5 shrink-0 text-green-500 dark:text-green-400" />
                </UseTooltip>
              )}
            </div>
          </div>
          {course.organization_name ? (
            <div className="flex items-center gap-3 rounded-lg border bg-background/80 px-3 py-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Building2 className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Кафедра
                </p>
                <p className="truncate text-sm font-medium">
                  {course.organization_name}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1 pb-0.5">
        {owner ? (
          <Button
            variant="ghost"
            className="h-auto min-w-0 flex-1 justify-start gap-2.5 px-1 py-1"
            onClick={() =>
              navigate("/" + AppRoutes.PROFILE + "/" + owner.user_uuid)
            }
          >
            <Avatar className="size-9">
              <AvatarImage src={owner.avatar} className="object-cover" />
              <AvatarFallback className="bg-muted text-xs font-semibold">
                {ownerInitials(owner.owner_name)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 text-left">
              <span className="block truncate text-sm font-semibold">
                {owner.owner_name}
              </span>
              <span className="text-xs text-muted-foreground">
                Преподаватель
              </span>
            </span>
          </Button>
        ) : (
          <span />
        )}

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {canDelete &&
            (hasStudents ? (
              <UseTooltip
                text={
                  course.count_stud
                    ? `Нельзя удалить курс, пока на нём есть студенты (${course.count_stud})`
                    : "Нельзя удалить курс, пока на нём есть студенты"
                }
              >
                <span className="inline-flex">
                  <Button
                    className="shrink-0 shadow-none text-destructive"
                    variant="outline"
                    disabled
                  >
                    <Trash2 />
                    Удалить
                  </Button>
                </span>
              </UseTooltip>
            ) : (
              <UseConfirmationDialog
                title={`Удалить курс «${course.discipline_name}»?`}
                description="Удаление необратимо. Вместе с курсом будут удалены все темы и материалы."
                onConfirm={() => deleteCourse(course.id)}
                trigger={
                  <Button
                    className="shrink-0 shadow-none text-destructive hover:bg-destructive/10 hover:text-destructive"
                    variant="outline"
                    disabled={isDeleting}
                  >
                    <Trash2 />
                    Удалить
                  </Button>
                }
              />
            ))}
          {canArchive && (
            <UseConfirmationDialog
              title={
                archived
                  ? "Вернуть курс из архива?"
                  : "Отправить курс в архив?"
              }
              description={
                archived
                  ? `Курс «${course.discipline_name}» снова станет доступен студентам.`
                  : `Курс «${course.discipline_name}» будет скрыт у всех. Вы сможете вернуть его из архива.`
              }
              onConfirm={() =>
                setArchive({ id: course.id, archive: !archived })
              }
              trigger={
                <Button
                  className="shrink-0 shadow-none"
                  variant="outline"
                  disabled={isPending}
                >
                  {archived ? <ArchiveRestore /> : <Archive />}
                  {archived ? "Вернуть" : "Архив"}
                </Button>
              }
            />
          )}
          <Button
            className="shrink-0 shadow-none"
            variant="outline"
            onClick={() => openCourse(navigate, course.id)}
          >
            Открыть <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddCourseCard = ({ onClick }: { onClick: () => void }) => (
  <div
    className="group flex min-w-1/3 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
    onClick={onClick}
  >
    <UseTooltip text="Создать курс">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
          <LuPlus size={32} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-foreground transition-colors group-hover:text-primary">
            Добавить курс
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Нажмите, чтобы создать новый курс
          </p>
        </div>
      </div>
    </UseTooltip>
  </div>
);

const CourseCardsGrid = ({
  courses,
  isLoading,
  error,
  canArchive,
  showAddCard,
  emptyText,
  forceArchived,
}: {
  courses?: Course[];
  isLoading: boolean;
  error: { message: string } | null;
  canArchive?: boolean;
  showAddCard?: boolean;
  emptyText?: string;
  forceArchived?: boolean;
}) => {
  const openForm = useForm();

  return (
    <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
      {isLoading ? (
        <SpringPopupList>
          {Array.from({ length: 5 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </SpringPopupList>
      ) : error ? (
        <p>Произошла непредвиденная ошибка! {error.message} </p>
      ) : (
        <FadeInList>
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              canArchive={canArchive}
              forceArchived={forceArchived}
            />
          ))}
          {!isLoading && !courses?.length && emptyText ? (
            <p className="col-span-full text-sm text-muted-foreground">
              {emptyText}
            </p>
          ) : null}
          {showAddCard && (
            <AddCourseCard onClick={() => openForm(FormQuery.ADD_COURSE)} />
          )}
        </FadeInList>
      )}
    </div>
  );
};

const CourseListHeader = ({ tabs }: { tabs?: ReactNode }) => (
  <div
    className={
      tabs
        ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        : undefined
    }
  >
    <div className="min-w-0">
      <h2 className="hidden text-4xl font-semibold tracking-tight text-left md:block sm:text-5xl">
        Мои курсы
      </h2>
      <p className="text-sm text-muted-foreground md:mt-1.5 md:text-lg">
        Все курсы, которые вы сохраняли или загружали
      </p>
    </div>
    {tabs}
  </div>
);

const CourseList = () => {
  const { isStudent } = useAuth();
  const canArchive = !isStudent;
  const { data, isLoading, error } = useQuery(courseQueries.allCourses());
  const {
    data: archivedCourses,
    isLoading: isArchiveLoading,
    error: archiveError,
  } = useQuery({
    ...courseQueries.archivedCourses(),
    enabled: canArchive,
  });

  if (!canArchive) {
    return (
      <div className="flex min-h-screen flex-col py-3">
        <CourseListHeader />
        <div className="w-full">
          <CourseCardsGrid
            courses={data}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col py-3">
      <Tabs defaultValue="active" className="w-full gap-4">
        <CourseListHeader
          tabs={
            <TabsList className="grid w-full shrink-0 grid-cols-2 sm:w-auto">
              <TabsTrigger value="active" className="gap-2">
                Курсы
                {(data?.length ?? 0) > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {data?.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="archive" className="gap-2">
                <LuArchive className="h-4 w-4" />
                Архив
                {(archivedCourses?.length ?? 0) > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {archivedCourses?.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          }
        />
        <TabsContent value="active">
          <CourseCardsGrid
            courses={data}
            isLoading={isLoading}
            error={error}
            canArchive
            showAddCard
          />
        </TabsContent>
        <TabsContent value="archive">
          <CourseCardsGrid
            courses={archivedCourses}
            isLoading={isArchiveLoading}
            error={archiveError}
            canArchive
            forceArchived
            emptyText="Нет курсов в архиве"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseList;
