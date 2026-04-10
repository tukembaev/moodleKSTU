import { useQuery } from "@tanstack/react-query";
import { CourseCardSkeleton } from "entities/Course";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";

import { userQueries } from "entities/User";
import { FadeInList, SpringPopupList } from "shared/components";

const RegistrationList = () => {
  const { data, isLoading, error } = useQuery(
    userQueries.availableRegistrations()
  );
  const { mutate: registrate } = userQueries.registrate();

  return (
    <div className="min-h-screen flex py-3 ">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-left">
              Регистрация на курсы
            </h2>
            <p className="mt-1.5 text-lg text-muted-foreground">
              Выберите курс, на который хотите зарегистрироваться
            </p>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto ">
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
                <div
                  key={course.id}
                  className="flex flex-col border rounded-xl py-6 px-5 justify-between min-w-1/3"
                >
                  <div>
                    {/* <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                  <feature.icon className="h-6 w-6" />
                </div> */}
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-xs text-muted-foreground">
                        Кредитов : {course.credit}
                      </span>
                    </div>
                    <span className="text-lg font-semibold">
                      {course.discipline_name}
                    </span>

                    <p className="mt-1 text-foreground/80 text-[15px]">
                      Форма контроля : {course.control_form}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between align-middle">
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
                      onClick={() => registrate(course.id)}
                    >
                      Зарегистрироваться <ChevronRight />
                    </Button>
                  </div>
                </div>
              ))}
            </FadeInList>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationList;
