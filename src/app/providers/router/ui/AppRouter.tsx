import { memo, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppRoutesProps, routeConfig } from "shared/config/routeConfig/routeConfig";


const AppRouter = () => {
    return (
        <Routes>
            {Object.values(routeConfig).map((route: AppRoutesProps) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        <Suspense
                            fallback={
                                <div>
                  Loading...
                                </div>
                            }
                        >
                            {route.element}
                        </Suspense>
                    }
                />
            ))}
        </Routes>
    );
};

export default memo(AppRouter);
