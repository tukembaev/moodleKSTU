import { ReactNode } from "react";

import { CoursePage } from "pages/CoursePage";

import { GroupPage } from "pages/GroupPage";
import { LoginPage } from "pages/LoginPage";
import { MainPage } from "pages/MainPage";

import { NotFoundPage } from "pages/NotFoundPage";
import { RegistrationPage } from "pages/RegistrationPage";
import { UniversitiesPage } from "pages/UniversitiesPage";

import { UserBilling, UserProfile } from "entities/User";
import CourseThemes from "entities/Course/ui/CourseThemes";
import { TestingPage } from "pages/TestingPage";
import { TestFrame, TestResults } from "entities/Test";
import { AboutUsPage } from "pages/AboutUsPage";
import { CollaboratePage } from "pages/CollaboratePage";
import { CategoryPage } from "pages/CategoryPage";

export interface AppRoutesProps {
  path: string;
  element: ReactNode;
  children?: AppRoutesProps[];
}

export enum AppRoutes {
  LOGIN = "login",
  ABOUT_US = "about_us",
  COLLABORATE = "collaborate",

  MAIN = "main",
  COURSES = "courses",
  CATEGORY = "category",

  REGISTRATION = "registration",

  PROFILE = "profile",
  TEST = "test",

  GROUPS = "groups",
  BILLING = "billing",

  UNIVERSITIES = "universities",
  NOT_FOUND = "not_found",
}

export enum AppSubRoutes {
  COURSE_THEMES = "course_themes",

  TEST_RESULTS = "result",
  TEST_PASS = "pass",
}

export const RoutePath: Record<AppRoutes | AppSubRoutes, string> = {
  [AppRoutes.LOGIN]: "/",
  [AppRoutes.ABOUT_US]: "/about_us",
  [AppRoutes.COLLABORATE]: "/collaborate",

  [AppRoutes.MAIN]: "/main",
  [AppRoutes.COURSES]: "/courses",
  [AppSubRoutes.COURSE_THEMES]: "/courses/course_themes/:id",

  [AppRoutes.CATEGORY]: "/category",

  [AppRoutes.REGISTRATION]: "/registration",
  [AppRoutes.PROFILE]: "/profile",
  [AppRoutes.TEST]: "/test",
  [AppSubRoutes.TEST_RESULTS]: "/test/result/:id",
  [AppSubRoutes.TEST_PASS]: "/test/pass",

  [AppRoutes.GROUPS]: "/groups",
  [AppRoutes.BILLING]: "/billing",
  [AppRoutes.UNIVERSITIES]: "/universities",
  [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.LOGIN]: {
    path: RoutePath.login,
    element: <LoginPage />,
  },
  [AppRoutes.ABOUT_US]: {
    path: RoutePath.about_us,
    element: <AboutUsPage />,
  },
  [AppRoutes.COLLABORATE]: {
    path: RoutePath.collaborate,
    element: <CollaboratePage />,
  },
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
  },
  [AppRoutes.COURSES]: {
    path: RoutePath[AppRoutes.COURSES],
    element: <CoursePage />,
    children: [
      {
        path: RoutePath[AppSubRoutes.COURSE_THEMES],
        element: <CourseThemes />,
      },
    ],
  },
  [AppRoutes.CATEGORY]: {
    path: RoutePath.category,
    element: <CategoryPage />,
  },
  [AppRoutes.REGISTRATION]: {
    path: RoutePath.registration,
    element: <RegistrationPage />,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePath.profile + "/*",
    element: <UserProfile />,
    children: [
      {
        path: ":id",
        element: <UserProfile />,
      },
    ],
  },
  [AppRoutes.BILLING]: {
    path: RoutePath.billing,
    element: <UserBilling />,
  },
  [AppRoutes.TEST]: {
    path: RoutePath[AppRoutes.TEST],
    element: <TestingPage />,
    children: [
      {
        path: RoutePath[AppSubRoutes.TEST_PASS],
        element: <TestFrame />,
      },
      {
        path: RoutePath[AppSubRoutes.TEST_RESULTS],
        element: <TestResults />,
      },
    ],
  },
  [AppRoutes.GROUPS]: {
    path: RoutePath.groups,
    element: <GroupPage />,
  },
  [AppRoutes.UNIVERSITIES]: {
    path: RoutePath.universities,
    element: <UniversitiesPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.not_found,
    element: <NotFoundPage />,
  },
};
