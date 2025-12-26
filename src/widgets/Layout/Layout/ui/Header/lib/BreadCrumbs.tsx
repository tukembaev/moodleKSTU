import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { routeConfig } from "shared/config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "shared/shadcn/ui/breadcrumb";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Функция для получения имени крошки
  const getBreadcrumbName = (path: string): string => {
    const route = Object.values(routeConfig).find(
      (r) => r.path === `/${path}` || r.path === path
    );
    return (
      route?.breadcrumbName || path.charAt(0).toUpperCase() + path.slice(1)
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const breadcrumbName = getBreadcrumbName(value);

          return (
            <div key={to} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground">
                    {breadcrumbName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{breadcrumbName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default memo(Breadcrumbs);
