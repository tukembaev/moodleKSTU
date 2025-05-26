import {
  BookOpen,
  ChevronRight,
  Cpu,
  LibraryBig,
  BriefcaseBusiness,
  BadgeDollarSign,
  HeartPulse,
  Scale,
  BookHeart,
  FlaskRound,
  Bike,
  Handshake,
  BadgeInfo,
  House,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "shared/shadcn/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "shared/shadcn/ui/sidebar";

const navigation = [
  {
    title: "Платформа",
    url: "main",
    icon: BookOpen,
    isActive: true,
    items: [
      {
        title: "Главная",
        url: "main",
        icon: House,
      },
      {
        title: "О нас",
        url: "about_us",
        icon: BadgeInfo,
      },
      {
        title: "Партнерство",
        url: "collaborate",
        icon: Handshake,
      },
    ],
  },
  {
    title: "Категории",
    url: "category",
    icon: LibraryBig,
    items: [
      { title: "Технологии", url: "category?type=technology", icon: Cpu },
      {
        title: "Бизнес",
        url: "category?type=bus",
        icon: BriefcaseBusiness,
      },
      {
        title: "Финансы",
        url: "category?type=fin",
        icon: BadgeDollarSign,
      },
      {
        title: "Здоровье",
        url: "category?type=health",
        icon: HeartPulse,
      },
      { title: "Политика", url: "category?type=politic", icon: Scale },
      {
        title: "Стиль жизни",
        url: "category?type=lifestyle",
        icon: BookHeart,
      },
      {
        title: "Наука",
        url: "category?type=science",
        icon: FlaskRound,
      },
      { title: "Спорт", url: "category?type=sport", icon: Bike },
    ],
  },
];
export function PlatformNavigation({
  onCollapsibleClick,
  activeCollapsible,
}: {
  onCollapsibleClick: (collapsibleTitle: string) => void;
  activeCollapsible: string | null;
}) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Информация</SidebarGroupLabel>
      <SidebarMenu>
        {navigation.map((item) => {
          const isSectionActive =
            item.items?.some((subItem) => pathname.includes(subItem.url)) ||
            false;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isSectionActive || item.title === activeCollapsible}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isSectionActive}
                    onClick={() => onCollapsibleClick(item.title)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname.includes(subItem.url)}
                        >
                          <NavLink to={subItem.url}>
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
