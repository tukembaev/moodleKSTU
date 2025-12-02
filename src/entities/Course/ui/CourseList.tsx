import { useQuery } from "@tanstack/react-query";
import { userQueries } from "entities/User/model/userQueryFactory";
import { ChevronRight } from "lucide-react";
import {
  LuBookCheck,
  LuBookmark,
  LuFlaskConical,
  LuHammer,
  LuPlus
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  CategoryBar,
  CourseStatisticTooltip,
  FadeIn,
  FadeInList,
  HoverLift,
  HoverScale,
  SpringPopupList,
  UseTooltip,
} from "shared/components";
import { FormQuery } from "shared/config/formConfig/formConfig";
import { AppRoutes, AppSubRoutes } from "shared/config/routeConfig/routeConfig";
import { useAuth, useForm } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import CourseCardSkeleton from "../lib/skeletons/CourseCardSkeleton";
import { courseQueries } from "../model/services/courseQueryFactory";

const CourseList = () => {
  const { isStudent } = useAuth();
  const navigate = useNavigate();
  const openForm = useForm();
  const { data, isLoading, error } = useQuery(courseQueries.allCourses());
  const { mutate: make_favorite } = userQueries.make_favorite();
  const { mutate: delete_favorite } = userQueries.delete_favorite();

  return (
    <div className="min-h-screen flex py-3 ">
      <div className="w-full">
        {/* <div className="flex justify-between items-center">
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Мои курсы</SelectItem>
              <SelectItem value="popular">Все курсы</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        {/* {id && <UserFavorites />} */}

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
              {data?.map((course) => {
                const progressThemes = [
                  {
                    name: "Лабораторные",
                    done: course?.count_lb_pr?.lb_done,
                    left: course?.count_lb_pr?.lb_left,
                    icon: (
                      <LuFlaskConical className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                    ),
                  },
                  {
                    name: "Практики",
                    done: course?.count_lb_pr?.pr_done,
                    left: course?.count_lb_pr?.pr_left,
                    icon: (
                      <LuHammer className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                    ),
                  },
                ];
                return (
                  <div
                    key={course.id}
                    className="flex flex-col border rounded-xl py-4 px-5 justify-between min-w-1/3 hover:shadow-xl  transition-all duration-300 backdrop-blur-xl hover:shadow-zinc-200/20 dark:hover:shadow-zinc-900/20,
                  hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
                  >
                    <div>
                      <div className="flex justify-end items-end">
                        {/* <div className="flex gap-2 items-center pb-2">
                          <Badge
                            variant={"outline"}
                            className="max-h-6 flex gap-2 pr-3"
                          >
                            <img
                              src={course.category_icon}
                              className="w-4"я
                              alt=""
                            />
                            {course.category}
                          </Badge>
                         
                        </div> */}
  
                        <HoverScale>
                          {course.is_favorite ? (
                            <UseTooltip text="Убрать из избранного">
                              <LuBookmark
                                size={24}
                                className="fill-primary hover:fill-none"
                                onClick={() =>
                                  delete_favorite({
                                    id: course.id,
                                    type: "course",
                                  })
                                }
                              />
                            </UseTooltip>
                          ) : (
                            <UseTooltip text="Добавить в избранное">
                              <LuBookmark
                                size={24}
                                className=" hover:fill-primary "
                                onClick={() =>
                                  make_favorite({ course: course.id })
                                }
                              />
                            </UseTooltip>
                          )}
                        </HoverScale>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <span className="text-lg font-semibold flex gap-2 items-center ">
                            {course.discipline_name}
                            {course.is_end && (
                              <UseTooltip
                                text={`Сдано на ${course.course_points}`}
                              >
                                <LuBookCheck className="text-green-500 dark:text-green-400" />
                              </UseTooltip>
                            )}
                          </span>
                          <CourseStatisticTooltip
                            progress={course.progress}
                            count_lb_pr={course.count_lb_pr}
                            count_stud={course.count_stud}
                          />
                        </div>
                      </div>
                 
                      <p className="mt-1 text-foreground/80 text-[15px]">
                        Кредитов : {course.credit}
                      </p>
                      <p className="mt-1 text-foreground/80 text-[15px]">
                        Форма контроля : {course.control_form}
                      </p>
                      {course.count_lb_pr && (
                        <div className="py-2">
                          <div className="space-y-2.5">
                            {progressThemes?.map((theme) => (
                              <div
                                key={theme.name}
                                className={cn(
                                  "flex items-center gap-3",
                                  "p-2 rounded-xl",

                                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                  "transition-colors duration-200"
                                )}
                              >
                                {theme.icon}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                                      {theme.name}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    {[...Array(theme.done + theme.left)].map(
                                      (_, i) => (
                                        <div
                                          key={i}
                                          className={cn(
                                            "h-1 rounded-full flex-1",
                                            i < theme.done
                                              ? "bg-zinc-900 dark:bg-zinc-100"
                                              : "bg-zinc-200 dark:bg-zinc-700"
                                          )}
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {course.progress && (
                        <CategoryBar
                          values={[74, 13, 14]}
                          marker={{
                            value: course.course_points,
                            tooltip: `${course.course_points}`,
                            showAnimation: true,
                          }}
                          colors={["red", "amber", "lime"]}
                          className="pt-4"
                          showLabels={false}
                        />
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between align-middle">
                      <Button
                        variant={"ghost"}
                        className="flex items-center gap-2 "
                        onClick={() =>
                          navigate(
                            "/" +
                              AppRoutes.PROFILE +
                              "/" +
                              course.course_owner[0].user_id
                          )
                        }
                      >
                        <Avatar>
                          <AvatarImage src={course.course_owner[0].avatar} className="object-cover"/>
                        </Avatar>

                        <span className="text-muted-foreground font-semibold flex flex-col text-md py-2">
                          {course.course_owner[0].owner_name}
                          <span className="font-medium text-xs text-muted-foreground">
                            Преподаватель
                          </span>
                        </span>
                      </Button>

                      {/* <MemberListPreview /> */}

                      <Button
                        className="shadow-none"
                        variant={"outline"}
                        onClick={() =>
                          navigate(AppSubRoutes.COURSE_THEMES + "/" + course.id)
                        }
                      >
                        Подробнее <ChevronRight />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </FadeInList>
          )}
          {data && !isStudent && (
            <FadeIn className="flex border rounded-xl py-4 px-5 min-w-1/3 justify-center items-center min-h-52">
              <HoverLift>
                <UseTooltip text="Создать новый курс">
                  <button onClick={() => openForm(FormQuery.ADD_COURSE)}>
                    <LuPlus size={28} className="text-muted-foreground w-24" />
                  </button>
                </UseTooltip>
              </HoverLift>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
