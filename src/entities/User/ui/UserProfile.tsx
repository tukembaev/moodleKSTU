import { Separator } from "shared/shadcn/ui/separator";
import UserCard from "./components/UserCard";

import { useQuery } from "@tanstack/react-query";
import { LuFileBox } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { UseTabs } from "shared/components";
import { useAuth } from "shared/hooks";
import { mapUsersMeToProfile } from "../lib/mapUsersMe";
import { userQueries } from "../model/userQueryFactory";
import FileTab from "./components/userTabs/FileTab";

const UserProfile = () => {
  const { id: visit_user } = useParams();
  const { id: user_id } = useAuth();
  const isOwnProfile = !visit_user;

  const { data: visitedProfile, isLoading: isVisitedLoading } = useQuery({
    ...userQueries.userService(visit_user ?? ""),
    enabled: Boolean(visit_user),
  });
  const { data: lmsUser } = useQuery({
    ...userQueries.user(user_id),
    enabled: isOwnProfile && Boolean(user_id),
  });
  const { data: me, isLoading: isMeLoading } = useQuery({
    ...userQueries.me(),
    enabled: isOwnProfile,
  });

  const data = visit_user
    ? visitedProfile
    : me
      ? mapUsersMeToProfile(me, lmsUser)
      : lmsUser;
  const isLoading = visit_user
    ? isVisitedLoading
    : isMeLoading && !me;
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
  ];

  return (
    <div className="flex flex-col gap-8 max-w-screen-xl mx-auto">
      <UserCard data={data} isLoading={isLoading} />
      {!visit_user && (
        <>
          <Separator />
          <UseTabs tabs={tabs} />
        </>
      )}
    </div>
  );
};

export default UserProfile;
