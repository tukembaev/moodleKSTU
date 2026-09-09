import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LogOutIcon, UserCircleIcon } from "lucide-react";
import { userQueries } from "entities/User";
import { useAuth } from "shared/hooks";
import { mergeProfileIntoSession, performLogout } from "shared/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { Skeleton } from "shared/shadcn/ui/skeleton";
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
  const { data: me, isLoading } = useQuery({
    ...userQueries.me(),
    enabled: auth_data.isAuthenticated,
  });

  useEffect(() => {
    if (!me) return;
    mergeProfileIntoSession({
      first_name: me.first_name,
      last_name: me.last_name,
      email: me.email,
      avatar: me.avatar_url,
      username: me.username,
    });
  }, [me]);

  const onExit = () => {
    void performLogout({ redirect: true });
  };

  const firstName = me?.first_name || auth_data?.first_name || "";
  const lastName = me?.last_name || auth_data?.last_name || "";
  const email = me?.email || auth_data?.email || "";
  const avatar = me?.avatar_url || auth_data?.avatar || "";
  const initials =
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";
  const displayName = `${firstName} ${lastName}`.trim() || me?.username || "Профиль";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {isLoading && !me ? (
            <Skeleton className="h-8 w-8 rounded-lg" />
          ) : (
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={avatar}
                alt={firstName}
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
          )}
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
                src={avatar}
                alt={firstName}
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              {isLoading && !me ? (
                <>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-1 h-3 w-36" />
                </>
              ) : (
                <>
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </>
              )}
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
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
