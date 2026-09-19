import { Fragment, memo, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AppRoutesProps,
  routeConfig,
} from "shared/config/routeConfig/routeConfig";

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {Object.values(routeConfig).map(
          ({ path, element, children, aliases }: AppRoutesProps) => (
            <Fragment key={path}>
              <Route
                path={path}
                element={<Suspense fallback={<PageLoader />}>{element}</Suspense>}
              >
                {children?.map(({ path: childPath, element: childElement }) => (
                  <Route
                    key={childPath}
                    path={childPath}
                    element={
                      <Suspense fallback={<PageLoader />}>
                        {childElement}
                      </Suspense>
                    }
                  />
                ))}
              </Route>
              {aliases?.map((alias) => (
                <Route
                  key={alias}
                  path={alias}
                  element={
                    <Suspense fallback={<PageLoader />}>{element}</Suspense>
                  }
                />
              ))}
            </Fragment>
          )
        )}
      </Routes>
    </Suspense>
  );
};

export default memo(AppRouter);
