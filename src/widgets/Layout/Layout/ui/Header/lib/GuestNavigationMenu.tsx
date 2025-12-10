import logo from "/src/assets/logo.svg";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "shared/shadcn/ui/navigation-menu";

import * as React from "react";
import { cn } from "shared/lib/utils";

const categories: { title: string; href: string; description: string }[] = [
  {
    title: "Технологии",
    href: "category?type=tech",
    description: "Инструменты и решения из мира IT и разработки.",
  },
  {
    title: "Бизнес",
    href: "category?type=bus",
    description: "Навыки и знания для роста карьеры и запуска проектов.",
  },
  {
    title: "Финансы",
    href: "category?type=fin",
    description: "Финансовая грамотность, инвестиции и управление деньгами.",
  },
  {
    title: "Здоровье",
    href: "category?type=health",
    description: "Физическое и ментальное здоровье, продуктивность.",
  },
  {
    title: "Политика",
    href: "category?type=politic",
    description: "Современная повестка и общественные процессы.",
  },
  {
    title: "Наука",
    href: "category?type=science",
    description: "Инновации, открытия и логическое мышление.",
  },
];

export default function GuestNavigationMenu() {
  return (
    <NavigationMenu className="z-20">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Платформа</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md">
                    <img src={logo} className="h-8 w-8" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      IQ Academy
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Образовательная платформа нового поколения.
                    </p>
                  </div>
                </NavigationMenuLink>
              </li>
              <ListItem href="/main" title="Главная">
                Главная страница с подборками и трендами.
              </ListItem>
              <ListItem href="/about_us" title="О нас">
                Узнайте, как мы обучаем и поддерживаем авторов.
              </ListItem>
              <ListItem href="/collaborate" title="Сотрудничество">
                Станьте автором или партнёром платформы.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Категории</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {categories.map((category) => (
                <ListItem
                  key={category.title}
                  title={category.title}
                  href={category.href}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
