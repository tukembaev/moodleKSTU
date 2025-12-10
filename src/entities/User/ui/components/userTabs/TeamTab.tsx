import { UserGroupList } from "entities/User/types/user";
import { LuDribbble, LuMessageCircle, LuTwitch } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { HoverLift } from "shared/components";

//TODO В будущем бекс сделает и для преподов и я буду за место my-team/group отправлять my-team/otdel и будут выходить сотрудники моего отдела
const TeamTab = ({ data }: { data: UserGroupList[] }) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-12 pt-4">
      {data?.map((member) => (
        <div
          key={member.id}
          className="flex flex-col items-center text-center bg-accent py-8 px-6 rounded-lg"
        >
          <img
            src={member.avatar}
            alt={member.first_name}
            className="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover bg-accent"
            width={120}
            height={120}
          />
          <h3 className="mt-5 text-lg font-semibold">
            {member.first_name} {member.last_name}
          </h3>
          <p className="text-muted-foreground text-sm">{member.position}</p>
          <p className="mt-2 mb-6">Крутое описание крутого меня !</p>
          <div className="mt-auto flex items-center gap-4">
            <HoverLift>
              <NavLink to="#" target="_blank">
                <LuMessageCircle className="stroke-muted-foreground h-5 w-5" />
              </NavLink>
            </HoverLift>
            <HoverLift>
              <NavLink to="#" target="_blank">
                <LuDribbble className="stroke-muted-foreground h-5 w-5" />
              </NavLink>
            </HoverLift>
            <HoverLift>
              <NavLink to="#" target="_blank">
                <LuTwitch className="stroke-muted-foreground h-5 w-5" />
              </NavLink>
            </HoverLift>
          </div>
        </div>
      ))}
    </div>
  );
};
export default TeamTab;
