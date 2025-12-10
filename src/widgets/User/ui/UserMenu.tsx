import { LogOut, Settings, User } from "lucide-react";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

const UserMenu = () => {
  const auth_data = useAuth();

  const onExit = () => {
    localStorage.removeItem("auth_data");
    localStorage.removeItem("google_auth");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  return (
    <div className="px-2 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex gap-2 items-center text-sm ">
          <Avatar className="w-7 h-7">
            <AvatarImage
              src={auth_data?.avatar}
              alt="@shadcn"
              className="w-7 h-7 object-cover"
            />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          {auth_data?.last_name} {auth_data?.first_name}
          {/* <LuChevronsDown className="size-4" /> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-41">
          <DropdownMenuItem>
            <NavLink to={`/profile`} className={"flex items-center gap-2"}>
              <User className="h-4 w-4" /> Профиль
            </NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <NavLink to={`/profile`} className={"flex items-center gap-2"}>
              <LuBriefcaseBusiness className="h-4 w-4" /> Личный кабинет{" "}
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <NavLink to={`/settings`} className={"flex items-center gap-2"}>
              <Settings className="h-4 w-4" /> Настройки
            </NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onClick={onExit}
          >
            <LogOut className="h-4 w-4" /> Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
