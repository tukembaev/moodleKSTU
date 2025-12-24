import {
  ClipboardList,
  // FolderInput,
  GraduationCap,
} from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppRoutes, RoutePath } from "shared/config";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "shared/shadcn/ui/sidebar";
import { FooterUserMenu } from "./lib/FooterUserMenu";

import { LuBell, LuChartArea, LuMessageCircle } from "react-icons/lu";
import logo from "/src/assets/logo.svg";
import { useAuth } from "shared/hooks";

const navigationItems: {
  title: string;
  url: (typeof RoutePath)[keyof typeof RoutePath];
  icon: React.ElementType;
  isStudent?: boolean;
}[] = [
    {
      title: "Мои курсы",
      url: AppRoutes.COURSES,
      icon: GraduationCap,
    },
    // {
    //   title: "Регистрация",
    //   url: RoutePath.registration,
    //   icon: FolderInput,
    // },
    {
      title: "Тестирование",
      url: RoutePath.test,
      icon: ClipboardList,
    },
    {
      title: "Переписка",
      url: RoutePath.chat,
      icon: LuMessageCircle,
    },
    {
      title: "Уведомления",
      url: RoutePath.notification,
      icon: LuBell,
    },

    {
      title: "Статистика работы",
      url: RoutePath.statistic,
      icon: LuChartArea,
    },
    // {
    //   title: "Мои группы",
    //   url: RoutePath.groups,
    //   icon: Users,
    // },
    // {
    //   title: "Университеты",
    //   url: RoutePath.universities,
    //   icon: University,
    // },
  ];

import { useQuery } from "@tanstack/react-query";
import { userQueries } from "entities/User";

const Sidebar = () => {
  const url = useLocation();
  const { isStudent } = useAuth();
  const { state } = useSidebar();

  const { data: notifications } = useQuery(userQueries.user_notifications());
  const unreadCount = notifications?.filter(n => !n.status).length || 0;

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader className="border-b">
        {state === "expanded" ? (
          <img src={logo} alt="kstuLogo" className="h-26 w-auto mx-auto" />
        ) : (
          <img src={logo} alt="kstuLogo" className="h-8 w-auto mx-auto" />
        )}

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems
                .filter((item) => !((item.title === "Тестирование") && isStudent))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={url.pathname.includes(item.url)}
                      tooltip={item.title}
                    >
                      <NavLink to={item.url} className="relative">
                        <item.icon />
                        <span>{item.title}</span>

                        {item.title === "Уведомления" && unreadCount > 0 && state === "collapsed" && (
                          <span className="absolute top-1 right-0.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-background" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                    {item.title === "Уведомления" && unreadCount > 0 && (
                      <SidebarMenuBadge>{unreadCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <FooterUserMenu />
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
export default Sidebar;
