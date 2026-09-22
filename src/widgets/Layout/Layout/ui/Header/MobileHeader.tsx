import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routePath";
import { runMobileBackHandler } from "shared/lib/navigation/mobile-back";
import { Button } from "shared/shadcn/ui/button";

const FOCUSED_ROUTES = ["/test/pass"];

function isRootPath(pathname: string) {
  return (
    pathname === RoutePath[AppRoutes.TODAY] ||
    pathname === `${RoutePath[AppRoutes.TODAY]}/`
  );
}

/**
 * Компактная верхняя панель на мобильных: бренд по центру,
 * назад слева — только если есть куда выйти.
 */
export function MobileHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFocusedRoute = FOCUSED_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isFocusedRoute) return null;

  const canGoBack = !isRootPath(location.pathname);

  const goBack = () => {
    if (runMobileBackHandler()) return;
    if (location.key !== "default") {
      navigate(-1);
      return;
    }
    navigate(RoutePath[AppRoutes.TODAY]);
  };

  return (
    <header className="relative flex h-12 shrink-0 items-center border-b bg-background/95 px-2 backdrop-blur-md md:hidden">
      {canGoBack ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Назад"
          onClick={goBack}
          className="relative z-10 size-9 shrink-0"
        >
          <ChevronLeft className="size-5" />
        </Button>
      ) : (
        <span className="size-9 shrink-0" aria-hidden />
      )}
      <h1 className="pointer-events-none absolute inset-x-12 truncate text-center text-[15px] font-semibold tracking-tight">
        Unet LMS
      </h1>
      <span className="ml-auto size-9 shrink-0" aria-hidden />
    </header>
  );
}
