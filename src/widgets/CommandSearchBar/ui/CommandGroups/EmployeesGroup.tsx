import { CommandSeparator } from "cmdk";
import { UserGroupList } from "entities/User";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "shared/config";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { CommandGroup, CommandItem } from "shared/shadcn/ui/command";

const EmployeesGroup = ({ data }: { data: UserGroupList[] }) => {
  const navigate = useNavigate();
  if (data.length === 0) return null;

  return (
    <CommandGroup heading="Пользователи">
      {data.map((item) => (
        <CommandItem
          key={item.user_id}
          value={`${item.last_name} ${item.first_name} ${item.middle_name}`}
          onSelect={() =>
            navigate("/" + AppRoutes.PROFILE + "/" + item.user_id)
          }
        >
          <Avatar>
            <AvatarImage src={item.avatar} />
          </Avatar>
          <span>{`${item.last_name} ${item.first_name} ${item.middle_name}`}</span>
        </CommandItem>
      ))}
      <CommandSeparator />
    </CommandGroup>
  );
};

export default EmployeesGroup;
