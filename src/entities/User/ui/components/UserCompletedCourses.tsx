import { useNavigate } from "react-router-dom";
import { AppRoutes } from "shared/config";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "shared/shadcn/ui/card";
import brilliants from "/src/assets/diamond.svg";

const courses = [
  {
    title: "Методы оптимизации",
    excelent: 4,
    good: 4,
    bad: 4,
    course_owner: [
      {
        user_id: "1",
        owner_name: "Александр Петров",
        avatar:
          "https://uadmin.kstu.kg/educations/media/2025-02-13_21_Srmdo8Z.49.39.jpg",
        author_fill:
          "https://a.storyblok.com/f/191576/1176x882/0707bde47c/make_signature_hero_after.webp",
      },
    ],

    date_completed: "12 апреля 2025",
  },
];
const UserCompletedCourses = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight italic pb-8">
        Завершенные курсы
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {courses.map((item) => (
          <Card className="min-h-68 flex flex-col justify-between">
            <div>
              <CardHeader className="text-lg font-semibold w-full break-all">
                {item.title}
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-4">
                <div>
                  <h1 className="font-medium text-gray-500">Оценка</h1>
                  <div className="flex gap-2 items-center ">
                    <img src={brilliants} className="w-16" alt="" />
                    <div className="flex flex-col items-center align-start">
                      <h4 className="text-md "> Отлично</h4>
                      <span className="text-md">Баллы : {item.excelent}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="font-medium text-gray-500">Дата сдачи</h1>
                  <div className="flex gap-2 items-center ">
                    <h4 className="text-md "> {item.date_completed}</h4>
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="flex justify-between items-center">
              <Button
                variant={"ghost"}
                className="flex items-center gap-2"
                onClick={() =>
                  navigate(
                    "/" + AppRoutes.PROFILE + "/" + item.course_owner[0].user_id
                  )
                }
              >
                <Avatar>
                  <AvatarImage src={item.course_owner[0].avatar} />
                </Avatar>

                <span className="text-muted-foreground font-semibold flex flex-col text-md py-2 text-left">
                  {item.course_owner[0].owner_name}
                  <span className="font-medium text-xs text-muted-foreground">
                    Преподаватель
                  </span>
                </span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserCompletedCourses;
{
  /* <div className="flex gap-1">
                    <img src={emerald} className="w-5" alt="" />
                    <span>{item.good}</span>
                  </div>
                  <div className="flex gap-1">
                    <img src={iron} className="w-5" alt="" />
                    <span>{item.bad}</span>
                  </div> */
}
