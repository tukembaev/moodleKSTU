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

const navigationItems: {
  title: string;
  url: (typeof RoutePath)[keyof typeof RoutePath];
  icon: React.ElementType;
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

const Sidebar = () => {
  const url = useLocation();

  const { state } = useSidebar();
  // const [activeCollapsible, setActiveCollapsible] = useState<string | null>(
  //   null
  // );

  // const handleCollapsibleClick = (collapsibleTitle: string) => {
  //   if (state === "collapsed") {
  //     setOpen(true);
  //     setActiveCollapsible(collapsibleTitle);
  //     setActiveCollapsible((prev) =>
  //       prev === collapsibleTitle ? null : collapsibleTitle
  //     );
  //   }
  // };
  const notificationCount = 1;
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
        {/* <PlatformNavigation
          onCollapsibleClick={handleCollapsibleClick}
          activeCollapsible={activeCollapsible}
        /> */}

        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={url.pathname.includes(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} className="relative">
                      <item.icon />
                      <span>{item.title}</span>

                      {item.title === "Уведомления" &&
                        notificationCount > 0 && (
                          <span
                            className={`
                            absolute 
                            ${
                              state === "expanded"
                                ? "right-2 top-2"
                                : "right-0 top-0"
                            }
                            flex items-center justify-center
                          `}
                          ></span>
                        )}
                    </NavLink>
                  </SidebarMenuButton>
                  {item.title === "Уведомления" && (
                    <SidebarMenuBadge>{notificationCount}</SidebarMenuBadge>
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
