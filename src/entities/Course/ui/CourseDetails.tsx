import {
  LuBookA,
  LuHandCoins,
  LuHandshake,
  LuInfo,
  LuMessageCircle,
  LuTarget,
} from "react-icons/lu";
import { UseTabs, UseTooltip } from "shared/components";
import { CourseThemes } from "../model/types/course";
import AboutCourse from "./Details/AboutCourse";

import CourseInvolvement from "./Details/OwnerDetails/CourseInvolvement";
import CourseResultTable from "./Details/OwnerDetails/CourseResultTable";
import { ChatContainer } from "features/Chat";
import { useAuth } from "shared/hooks";

const CourseDetails = ({ data }: { data: CourseThemes | undefined }) => {
  const {isStudent} = useAuth();
  const tabs = [
    {
      name: "О курсе",
      value: "about_course",
      content: (
        <AboutCourse
          requirements={data?.requirements}
          description={data?.description}
          audience={data?.audience}
          course_owner={data?.course_owner[0]}
        />
      ),
      icon: <LuInfo />,
    },
    ...(!isStudent ? [{
        name: "Успеваемость студентов",
        value: "students_progress",
        content: <CourseResultTable />,
        icon: <LuBookA />,
    }] : []),
    {
      name: isStudent ? "Чат с преподователем" : "Чаты с студентами",
      value: "chats",
      content: <ChatContainer />,
      icon: <LuMessageCircle />,
    },
    // {
    //   name: "Графики",
    //   value: "charts",
    //   content: <CourseStatistic />,
    //   icon: <LuChartBar />,
    // },
    ...(!isStudent ? [{
      name: "Вовлеченность",
      value: "attendance",
      content: <CourseInvolvement />,
      icon: <LuHandshake />,
    }] : []),

    // {
    //   name: "Отзывы",
    //   value: "rules",
    //   content: <TestimonialSection />,
    //   icon: <LuSpeech />,
    // },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <span className="text-lg sm:text-xl tracking-tight">
          {data?.course_owner[0].owner_name}
        </span>
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight pb-2">
          {data?.discipline_name}
        </span>

        <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-md text-foreground/80 pl-0 sm:pl-2">
          {/* <UseTooltip text="Количество часов на изучение">
            <div className="flex items-center gap-2">
              <LuClock className="h-4 w-4" />
              <span>{data?.count_hours}</span>
            </div>
          </UseTooltip> */}

          <UseTooltip text="Кредитов за курс">
            <div className="flex items-center gap-2">
              <LuHandCoins className="h-4 w-4" />
              <span>{data?.credit}</span>
            </div>
          </UseTooltip>

          <UseTooltip text={"Форма контроля"}>
            <div className="flex items-center gap-2">
              <LuTarget className="h-4 w-4" />
              <span>{data?.control_form}</span>
            </div>
          </UseTooltip>
        </div>
        {/* <p className="mt-1.5 text-lg text-muted-foreground w-2/4">
          {" "}
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error optio,
          perferendis provident laudantium magnam numquam aut harum consequatur.
          Obcaecati necessitatibus maiores dolor veniam tempora impedit error
          commodi sapiente sit aut.
        </p> */}
      </div>
      <UseTabs tabs={tabs}></UseTabs>
    </div>
  );
};

export default CourseDetails;
