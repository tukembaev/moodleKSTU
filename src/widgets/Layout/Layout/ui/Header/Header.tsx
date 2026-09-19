import { DEPARTMENT_PERMISSION } from "entities/User/lib/permissions";
import { useHasPermission } from "entities/User/model/useHasPermission";
import { useAuth } from "shared/hooks";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routePath";
import { cn } from "shared/lib/utils";
import { HeaderNotifications } from "./lib/HeaderNotifications";
import { HeaderSearch } from "./lib/HeaderSearch";
import { HeaderUserMenu } from "./lib/HeaderUserMenu";
import { NavLink, useLocation } from "react-router-dom";

const navLinkClass = (isActive: boolean) =>
  cn(
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
  );

const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const isStudent = auth.isStudent;
  const { hasAccess: canSeeWorkload } = useHasPermission(DEPARTMENT_PERMISSION);

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    // на мобильных вся навигация живёт в MobileBottomNav, поэтому header скрыт
    <header className="hidden md:block py-4 px-4 border-b w-full sticky top-0 z-30 bg-background">
      <div className="flex justify-between items-center mx-auto">
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            <NavLink
              to={RoutePath[AppRoutes.COURSES]}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              Мои курсы
            </NavLink>
            {!isStudent && (
              <>
                <NavLink
                  to={RoutePath[AppRoutes.TEST]}
                  className={navLinkClass(
                    location.pathname.includes(RoutePath[AppRoutes.TEST])
                  )}
                >
                  Тестирование
                </NavLink>
                <NavLink
                  to={RoutePath[AppRoutes.QUESTION_BANK]}
                  className={navLinkClass(
                    location.pathname.includes(
                      RoutePath[AppRoutes.QUESTION_BANK]
                    )
                  )}
                >
                  Коллекция вопросов
                </NavLink>
                {canSeeWorkload && (
                  <NavLink
                    to={RoutePath[AppRoutes.WORKLOAD]}
                    className={navLinkClass(
                      location.pathname.startsWith(RoutePath[AppRoutes.WORKLOAD])
                    )}
                  >
                    Нагрузка
                  </NavLink>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <HeaderSearch />
          <HeaderNotifications />
          <HeaderUserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
