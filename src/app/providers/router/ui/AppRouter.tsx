import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AppRoutesProps,
  routeConfig,
} from "shared/config/routeConfig/routeConfig";

const AppRouter = () => {
  return (
    <Routes>
      {Object.values(routeConfig).map(
        ({ path, element, children }: AppRoutesProps) => (
          <Route key={path} path={path} element={element}>
            {children?.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        )
      )}
    </Routes>
  );
};

export default memo(AppRouter);
