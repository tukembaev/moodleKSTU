import { memo, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AppRoutesProps,
  routeConfig,
} from "shared/config/routeConfig/routeConfig";

// Fallback компонент для загрузки
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
          ({ path, element, children }: AppRoutesProps) => (
            <Route 
              key={path} 
              path={path} 
              element={
                <Suspense fallback={<PageLoader />}>
                  {element}
                </Suspense>
              }
            >
              {children?.map(({ path, element }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      {element}
                    </Suspense>
                  } 
                />
              ))}
            </Route>
          )
        )}
      </Routes>
    </Suspense>
  );
};

export default memo(AppRouter);
