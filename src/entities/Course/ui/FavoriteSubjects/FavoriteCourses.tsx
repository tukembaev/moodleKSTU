import { Course, CourseCardSkeleton } from "entities/Course";
import { userQueries } from "entities/User";
import { ChevronRight } from "lucide-react";
import { LuBookmark } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  CategoryBar,
  CourseStatisticTooltip,
  FadeInList,
  HoverScale,
  SpringPopupList,
  UseTooltip,
} from "shared/components";
import { AppSubRoutes } from "shared/config";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";

const FavoriteCourses = ({
  data,
  isLoading,
}: {
  data: Course[];
  isLoading: boolean;
}) => {
  const { mutate: delete_favorite } = userQueries.delete_favorite();

  const navigate = useNavigate();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <SpringPopupList>
          {Array.from({ length: 5 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </SpringPopupList>
      ) : (
        <FadeInList>
          {data?.map((course) => (
            <div
              key={course.id}
              className="flex flex-col border rounded-xl py-4 px-5 justify-between min-w-1/3"
            >
              <div>
                <div className="flex justify-between">
                  <span className="text-lg font-semibold flex gap-4 items-center">
                    {course.discipline_name}
                    <CourseStatisticTooltip
                      progress={course.progress}
                      count_lb_pr={course.count_lb_pr}
                      count_stud={course.count_stud}
                    />
                  </span>

                  <HoverScale>
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
                  </HoverScale>
                </div>

                <p className="mt-1 text-foreground/80 text-[15px]">
                  Количество часов : {course.count_hours}
                </p>
                <p className="mt-1 text-foreground/80 text-[15px]">
                  Кредитов : {course.credit}
                </p>
                <p className="mt-1 text-foreground/80 text-[15px]">
                  Форма контроля : {course.control_form}
                </p>
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
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={course.course_owner[0].avatar} />
                  </Avatar>

                  <span className="text-muted-foreground font-semibold flex flex-col text-md">
                    {course.course_owner[0].owner_name}
                    <span className="font-medium text-xs text-muted-foreground">
                      Преподователь
                    </span>
                  </span>
                </div>

                <Button
                  className="shadow-none"
                  variant={"outline"}
                  onClick={() =>
                    navigate(
                      "/courses/" + AppSubRoutes.COURSE_THEMES + "/" + course.id
                    )
                  }
                >
                  Подробнее <ChevronRight />
                </Button>
              </div>
            </div>
          ))}
        </FadeInList>
      )}
    </div>
  );
};

export default FavoriteCourses;
