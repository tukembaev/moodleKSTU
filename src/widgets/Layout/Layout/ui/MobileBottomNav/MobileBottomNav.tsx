import { Bell, BookOpen, CalendarDays, Search, UserRound } from "lucide-react";
import { ComponentType, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routePath";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { useIsMobile } from "shared/shadcn/hooks/use-mobile";
import { useNotifications } from "widgets/Notification";
import { MobileNotificationsSheet } from "./MobileNotificationsSheet";
import { MobileProfileSheet } from "./MobileProfileSheet";
import { MobileSearchSheet } from "./MobileSearchSheet";

type SheetKey = "search" | "notifications" | "profile";

/** Прохождение теста — навигация прячется, чтобы случайный тап не прервал попытку. */
const FOCUSED_ROUTES = ["/test/pass"];

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [activeSheet, setActiveSheet] = useState<SheetKey | null>(null);

  // любой переход закрывает открытый шит (тап по результату поиска, по уведомлению и т.д.)
  useEffect(() => {
    setActiveSheet(null);
  }, [location.pathname, location.search]);

  const isFocusedRoute = FOCUSED_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  if (!isMobile || !isAuthenticated || isFocusedRoute) return null;

  const isTodayActive =
    location.pathname === RoutePath[AppRoutes.TODAY] ||
    location.pathname.startsWith(`${RoutePath[AppRoutes.TODAY]}/`);
  const isCoursesActive = location.pathname.startsWith(
    RoutePath[AppRoutes.COURSES]
  );
  const isProfileActive = location.pathname.startsWith(
    RoutePath[AppRoutes.PROFILE]
  );
  const toggleSheet = (key: SheetKey) =>
    setActiveSheet((prev) => (prev === key ? null : key));

  return (
    <>
      <nav
        aria-label={t("Основная навигация")}
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="flex items-stretch">
          <NavItem
            icon={CalendarDays}
            label={t("Сегодня")}
            active={isTodayActive && !activeSheet}
            onClick={() => {
              setActiveSheet(null);
              navigate(RoutePath[AppRoutes.TODAY]);
            }}
          />
          <NavItem
            icon={BookOpen}
            label={t("Курсы")}
            active={isCoursesActive && !activeSheet}
            onClick={() => {
              setActiveSheet(null);
              navigate(RoutePath[AppRoutes.COURSES]);
            }}
          />
          <NavItem
            icon={Search}
            label={t("Поиск")}
            active={activeSheet === "search"}
            onClick={() => toggleSheet("search")}
          />
          <NavItem
            icon={Bell}
            label={t("Уведомления")}
            badge={unreadCount}
            active={activeSheet === "notifications"}
            onClick={() => toggleSheet("notifications")}
          />
          <NavItem
            icon={UserRound}
            label={t("Профиль")}
            active={activeSheet === "profile" || (isProfileActive && !activeSheet)}
            onClick={() => toggleSheet("profile")}
          />
        </ul>
      </nav>

      <MobileSearchSheet
        open={activeSheet === "search"}
        onOpenChange={(open) => setActiveSheet(open ? "search" : null)}
      />
      <MobileNotificationsSheet
        open={activeSheet === "notifications"}
        onOpenChange={(open) => setActiveSheet(open ? "notifications" : null)}
      />
      <MobileProfileSheet
        open={activeSheet === "profile"}
        onOpenChange={(open) => setActiveSheet(open ? "profile" : null)}
      />
    </>
  );
};

interface NavItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active, badge = 0, onClick }: NavItemProps) {
  return (
    <li className="flex-1">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        className={cn(
          "flex h-14 w-full flex-col items-center justify-center gap-1 px-1 transition-colors active:bg-accent/60",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "relative flex h-6 w-10 items-center justify-center rounded-full transition-colors",
            active && "bg-primary/10"
          )}
        >
          <Icon className="size-5" />
          {badge > 0 && (
            <span className="absolute -top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </span>
        <span
          className={cn(
            "max-w-full truncate text-[10px] leading-none",
            active && "font-semibold"
          )}
        >
          {label}
        </span>
      </button>
    </li>
  );
}

export default MobileBottomNav;
