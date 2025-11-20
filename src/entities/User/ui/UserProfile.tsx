import { Separator } from "shared/shadcn/ui/separator";
import UserCard from "./components/UserCard";

import { useQuery } from "@tanstack/react-query";
import { LuAward, LuFileBox, LuUsersRound } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { UseTabs } from "shared/components";
import { useAuth } from "shared/hooks";
import { userQueries } from "../model/userQueryFactory";
import UserCompletedCourses from "./components/UserCompletedCourses";
import AchievementTab from "./components/userTabs/AchievementTab";
import FileTab from "./components/userTabs/FileTab";
import TeamTab from "./components/userTabs/TeamTab";

const UserProfile = () => {
  const { id: visit_user } = useParams();
  const { id: user_id } = useAuth();
  const { data, isLoading } = useQuery(
    userQueries.user(visit_user ? Number(visit_user) : user_id)
  );
  //IMPORTANT сказать бексу чтобы он добавил в my_student_friends bio number tg mail
  const { data: my_student_friends } = useQuery(
    userQueries.user_team(data?.group || "")
  );
  const {
    data: user_files,
    isLoading: isLoadingFiles,
    error: errorFiles,
  } = useQuery(userQueries.user_file(user_id));

  const tabs = [
    {
      name: "Файлы",
      value: "files",
      content: (
        <FileTab
          user_files={user_files || []}
          isLoading={isLoadingFiles}
          error={errorFiles}
        />
      ),
      count: user_files?.length,
      icon: <LuFileBox />,
    },

    {
      name: "Коллеги",
      value: "group",
      content: <TeamTab data={my_student_friends || []} />,
      count: my_student_friends?.length,
      icon: <LuUsersRound />,
    },
    // {
    //   name: "Достижения",
    //   value: "achivements",
    //   content: <AchievementTab />,
    //   count: 9,
    //   icon: <LuAward />,
    // },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-screen-xl mx-auto">
      <UserCard data={data} isLoading={isLoading} />
      <Separator />
      {/* <UserBudget />
      <Separator /> */}
      <UserCompletedCourses />
      <Separator />
      {!visit_user && <UseTabs tabs={tabs} />}
    </div>
  );
};

export default UserProfile;
