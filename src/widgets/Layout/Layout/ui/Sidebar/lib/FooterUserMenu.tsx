import {
  BellIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "shared/hooks";

import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "shared/shadcn/ui/sidebar";

export function FooterUserMenu() {
  const { isMobile } = useSidebar();
  const auth_data = useAuth();

  const onExit = () => {
    localStorage.removeItem("auth_data");
    localStorage.removeItem("google_auth");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={auth_data.avatar}
                  alt={auth_data.avatar}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {auth_data.first_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {auth_data.email || ""}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={auth_data.avatar}
                    alt={auth_data.first_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {auth_data.first_name} {auth_data.last_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {auth_data.email || ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <NavLink to={`/profile`} className={"flex items-center gap-2"}>
                  <UserCircleIcon />
                  Профиль
                </NavLink>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <NavLink to={`/billing`} className={"flex items-center gap-2"}>
                  <CreditCardIcon className="h-4 w-4" /> Баланс
                </NavLink>
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <NavLink to={`/settings`} className={"flex items-center gap-2"}>
                  <BellIcon className="h-4 w-4" /> Уведомления
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
