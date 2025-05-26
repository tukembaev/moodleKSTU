import React, { useState } from "react";
import {
  ClipboardList,
  FolderInput,
  GraduationCap,
  University,
  Users,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { AppRoutes, RoutePath } from "shared/config";
import { useAuth } from "shared/hooks";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "shared/shadcn/ui/sidebar";
import { FooterUserMenu } from "./lib/FooterUserMenu";
import { PlatformNavigation } from "./lib/PlatformNavigationGroup";
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
  {
    title: "Регистрация",
    url: RoutePath.registration,
    icon: FolderInput,
  },
  {
    title: "Тестирование",
    url: RoutePath.test,
    icon: ClipboardList,
  },
  {
    title: "Мои группы",
    url: RoutePath.groups,
    icon: Users,
  },
  {
    title: "Университеты",
    url: RoutePath.universities,
    icon: University,
  },
];

const Sidebar = () => {
  const url = useLocation();
  const { isStudent } = useAuth();
  const { state, setOpen } = useSidebar();
  const [activeCollapsible, setActiveCollapsible] = useState<string | null>(
    null
  );
  const filteredNavigationItems = navigationItems.filter(
    (item) =>
      (isStudent && item.url !== RoutePath.groups) ||
      (!isStudent && item.url !== RoutePath.registration)
  );

  const handleCollapsibleClick = (collapsibleTitle: string) => {
    if (state === "collapsed") {
      setOpen(true);
      setActiveCollapsible(collapsibleTitle);
      setActiveCollapsible((prev) =>
        prev === collapsibleTitle ? null : collapsibleTitle
      );
    }
  };

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
        <PlatformNavigation
          onCollapsibleClick={handleCollapsibleClick}
          activeCollapsible={activeCollapsible}
        />

        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={url.pathname.includes(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
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
