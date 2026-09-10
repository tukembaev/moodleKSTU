import { useQuery } from "@tanstack/react-query";

import { Building2, ChevronRight } from "lucide-react";
import { LuBookCheck, LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  FadeInList,
  SpringPopupList,
  UseTooltip,
} from "shared/components";
import { FormQuery } from "shared/config";
import { AppRoutes } from "shared/config/routeConfig/routeConfig";
import { useAuth, useForm } from "shared/hooks";
import { openCourse } from "shared/lib/navigation/hidden-ids";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import CourseCardSkeleton from "../lib/skeletons/CourseCardSkeleton";
import { Course } from "../model/types/course";
import { courseQueries } from "../model/services/courseQueryFactory";

const ownerInitials = (name?: string) =>
  (name || "П")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const owner = course.course_owner?.[0];
  const courseInitial = (course.discipline_name || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

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
            {course.is_end && (
              <UseTooltip text={`Сдано на ${course.course_points}`}>
                <LuBookCheck className="mt-1 size-5 shrink-0 text-green-500 dark:text-green-400" />
              </UseTooltip>
            )}
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
              navigate("/" + AppRoutes.PROFILE + "/" + owner.user_id)
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

        <Button
          className="shrink-0 shadow-none"
          variant="outline"
          onClick={() => openCourse(navigate, course.id)}
        >
          Подробнее <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

const CourseList = () => {
  const openForm = useForm();
  const { isStudent } = useAuth();
  const { data, isLoading, error } = useQuery(courseQueries.allCourses());

  return (
    <div className="min-h-screen flex py-3 ">
      <div className="w-full">
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
              {data?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {!isStudent && (
                <div
                  className="group flex min-w-1/3 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => openForm(FormQuery.ADD_COURSE)}
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
              )}
            </FadeInList>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
