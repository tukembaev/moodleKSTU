import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "shared/hooks";
import { AppRoutes, RoutePath } from "shared/config";
import { Button } from "shared/shadcn/ui/button";
import { CommandSearchBar } from "widgets/CommandSearchBar";
import { cn } from "shared/lib/utils";
import GuestNavigationMenu from "./lib/GuestNavigationMenu";
import { HeaderNotifications } from "./lib/HeaderNotifications";
import { HeaderSearch } from "./lib/HeaderSearch";
import { HeaderUserMenu } from "./lib/HeaderUserMenu";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isStudent = auth.isStudent;
  const isAuthed = auth.isAuthenticated;

  return (
    <header className="py-4 px-4 border-b w-full sticky top-0 z-30 bg-background">
      <div className="flex justify-between items-center mx-auto">
        {!isAuthed ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <GuestNavigationMenu />
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-1">
              <NavLink
                to={RoutePath[AppRoutes.COURSES]}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )
                }
              >
                <span className="hidden sm:inline">Мои курсы</span>
                <span className="sm:hidden">Курсы</span>
              </NavLink>
              {!isStudent && (
                <NavLink
                  to={RoutePath[AppRoutes.TEST]}
                  className={() =>
                    cn(
                      "rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                      location.pathname.includes(RoutePath[AppRoutes.TEST])
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )
                  }
                >
                  <span className="hidden sm:inline">Тестирование</span>
                  <span className="sm:hidden">Тесты</span>
                </NavLink>
              )}
            </nav>
          </div>
        )}

        <div className="flex items-center gap-1">
          {!isAuthed && !isLoginPage && (
            <div className="max-h-[35px] flex">
              <CommandSearchBar />
            </div>
          )}

          {isAuthed ? (
            <>
              <HeaderSearch />
              <HeaderNotifications />
              <HeaderUserMenu />
            </>
          ) : !isLoginPage ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden sm:inline-flex rounded-md"
                onClick={() => navigate("/")}
              >
                Войти
              </Button>
              <Button className="rounded-md">Регистрация</Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
