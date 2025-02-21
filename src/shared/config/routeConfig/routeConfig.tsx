
import { LoginPage } from "pages/LoginPage"
import { MainPage } from "pages/MainPage"
import { NotFoundPage } from "pages/NotFoundPage"
import { RouteProps } from "react-router-dom"


export type AppRoutesProps = RouteProps & {
    authOnly?: boolean
}

export enum AppRoutes {
    //add new route
    LOGIN = 'login',
    MAIN = 'main',
    
    NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.MAIN]: '/main',
   
   
    // последний
    [AppRoutes.NOT_FOUND]: '*',
}

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.LOGIN]: {
        path: RoutePath.login,
        element: <LoginPage />,
    }, [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <MainPage />,
    },
    // last
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
    },
}
