import { NavLink } from "react-router-dom";
import { LogOutIcon, UserCircleIcon } from "lucide-react";
import { useAuth } from "shared/hooks";
import { performLogout } from "shared/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

export function HeaderUserMenu() {
  const auth_data = useAuth();

  const onExit = () => {
    void performLogout({ redirect: true });
  };

  const initials =
    `${auth_data?.first_name?.[0] || ""}${auth_data?.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={auth_data?.avatar}
              alt={auth_data?.first_name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={auth_data?.avatar}
                alt={auth_data?.first_name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {auth_data?.first_name} {auth_data?.last_name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {auth_data?.email || ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <NavLink to="/profile" className="flex items-center gap-2">
              <UserCircleIcon />
              Профиль
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExit}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
