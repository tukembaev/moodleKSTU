import { ReactNode } from "react";

// Импорты страниц (уже имеют встроенную ленивую загрузку через .async.tsx файлы)
import { CoursePage } from "pages/CoursePage";
import { GroupPage } from "pages/GroupPage";
import { LoginPage } from "pages/LoginPage";
import { MainPage } from "pages/MainPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { UniversitiesPage } from "pages/UniversitiesPage";
import { UserBilling, UserProfile } from "entities/User";

import { TestingPage } from "pages/TestingPage";
import { TestResults } from "entities/Test";
import { AboutUsPage } from "pages/AboutUsPage";
import { CollaboratePage } from "pages/CollaboratePage";
import { CategoryPage } from "pages/CategoryPage";
import { NotificationPage } from "pages/NotificationPage";
import { StatisticPage } from "pages/StatisticPage";
import { ChatPage } from "pages/ChatPage";
import AddQuizPage from "features/Quiz/ui/AddQuizPage";
import { QuizTestPage } from "pages/QuizTestPage";
import { QuizResultsPage } from "pages/QuizResultsPage";
import { RemarksPage } from "pages/RemarksPage";
import CourseDetails from "entities/Course/ui/CourseDetails";

export interface AppRoutesProps {
  path: string;
  element: ReactNode;
  breadcrumbName: string;
  children?: AppRoutesProps[];
}

export enum AppRoutes {
  LOGIN = "login",
  ABOUT_US = "about_us",
  COLLABORATE = "collaborate",

  MAIN = "main",
  COURSES = "courses",
  CATEGORY = "category",
  CHAT = "chat",

  STATISTIC = "statistic",

  // REGISTRATION = "registration",
  NOTIFICATION = "notification",
  PROFILE = "profile",
  TEST = "test",

  GROUPS = "groups",
  BILLING = "billing",
  REMARKS = "remarks",

  UNIVERSITIES = "universities",
  NOT_FOUND = "not_found",
}

export enum AppSubRoutes {
  COURSE_THEMES = "course_themes",

  TEST_RESULTS = "result",
  TEST_PASS = "pass",
  TEST_ADD_QUIZ = "add-quiz",
  TEST_QUIZ = "quiz",
  TEST_QUIZ_RESULT = "quiz-result",
}

export const RoutePath: Record<AppRoutes | AppSubRoutes, string> = {
  [AppRoutes.LOGIN]: "/",
  [AppRoutes.ABOUT_US]: "/about_us",
  [AppRoutes.COLLABORATE]: "/collaborate",

  [AppRoutes.MAIN]: "/main",
  [AppRoutes.COURSES]: "/courses",
  [AppSubRoutes.COURSE_THEMES]: "/courses/course_themes/:id",


  [AppRoutes.CATEGORY]: "/category",

  [AppRoutes.STATISTIC]: "/statistic",
  [AppRoutes.CHAT]: "/chat",

  // [AppRoutes.REGISTRATION]: "/registration",
  [AppRoutes.NOTIFICATION]: "/notification",

  [AppRoutes.PROFILE]: "/profile",
  [AppRoutes.TEST]: "/test",
  [AppSubRoutes.TEST_RESULTS]: "/test/result",
  [AppSubRoutes.TEST_PASS]: "/test/pass/:id",
  [AppSubRoutes.TEST_ADD_QUIZ]: "/test/add-quiz",
  [AppSubRoutes.TEST_QUIZ]: "/test/quiz/:id",
  [AppSubRoutes.TEST_QUIZ_RESULT]: "/test/quiz-result/:id",

  [AppRoutes.GROUPS]: "/groups",
  [AppRoutes.BILLING]: "/billing",
  [AppRoutes.REMARKS]: "/remarks",
  [AppRoutes.UNIVERSITIES]: "/universities",
  [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.LOGIN]: {
    path: RoutePath.login,
    element: <LoginPage />,
    breadcrumbName: "Главная",
  },
  [AppRoutes.ABOUT_US]: {
    path: RoutePath.about_us,
    element: <AboutUsPage />,
    breadcrumbName: "О нас",
  },
  [AppRoutes.COLLABORATE]: {
    path: RoutePath.collaborate,
    element: <CollaboratePage />,
    breadcrumbName: "Связаться с нами",
  },
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
    breadcrumbName: "Главная",
  },
  [AppRoutes.COURSES]: {
    path: RoutePath[AppRoutes.COURSES],
    element: <CoursePage />,
    breadcrumbName: "Курсы",
    children: [
      {
        path: RoutePath[AppSubRoutes.COURSE_THEMES],
        element: <div className="min-h-screen flex py-3">
          <div className="w-full flex flex-col gap-4">
            <CourseDetails />
          </div>
        </div>,
        breadcrumbName: "Опр курс",
      },
    ],
  },
  [AppRoutes.CATEGORY]: {
    path: RoutePath.category,
    element: <CategoryPage />,
    breadcrumbName: "Категории",
  },
  // [AppRoutes.REGISTRATION]: {
  //   path: RoutePath.registration,
  //   element: <RegistrationPage />,
  // },
  [AppRoutes.NOTIFICATION]: {
    path: RoutePath.notification + "/*",
    element: <NotificationPage />,
    breadcrumbName: "Уведомления",

    children: [
      {
        path: ":id",
        element: <NotificationPage />,
        breadcrumbName: "Уведомления 2",
      },
    ],
  },
  [AppRoutes.STATISTIC]: {
    path: RoutePath.statistic,
    element: <StatisticPage />,
    breadcrumbName: "Оплата",
  },
  [AppRoutes.CHAT]: {
    path: RoutePath.chat,
    element: <ChatPage />,
    breadcrumbName: "Чат",
  },
  [AppRoutes.PROFILE]: {
    path: RoutePath.profile + "/*",
    element: <UserProfile />,
    breadcrumbName: "Профиль",

    children: [
      {
        path: ":id",
        element: <UserProfile />,
        breadcrumbName: "Чей то профиль",
      },
    ],
  },
  [AppRoutes.BILLING]: {
    path: RoutePath.billing,
    element: <UserBilling />,
    breadcrumbName: "Оплата",
  },
  [AppRoutes.TEST]: {
    path: RoutePath[AppRoutes.TEST],
    element: <TestingPage />,
    breadcrumbName: "Тесты",

    children: [
      {
        path: RoutePath[AppSubRoutes.TEST_RESULTS],
        element: <TestResults />,
        breadcrumbName: "Результаты теста",
      },
      {
        path: RoutePath[AppSubRoutes.TEST_ADD_QUIZ],
        element: <AddQuizPage />,
        breadcrumbName: "Создание теста",
      },
      {
        path: RoutePath[AppSubRoutes.TEST_PASS],
        element: <QuizTestPage />,
        breadcrumbName: "Тест",
      },
      {
        path: RoutePath[AppSubRoutes.TEST_QUIZ_RESULT],
        element: <QuizResultsPage />,
        breadcrumbName: "Результаты теста",
      },
    ],
  },

  [AppRoutes.GROUPS]: {
    path: RoutePath.groups,
    element: <GroupPage />,
    breadcrumbName: "Группы",
  },
  [AppRoutes.REMARKS]: {
    path: RoutePath.remarks,
    element: <RemarksPage />,
    breadcrumbName: "Замечания",
  },
  [AppRoutes.UNIVERSITIES]: {
    path: RoutePath.universities,
    element: <UniversitiesPage />,
    breadcrumbName: "Университеты",
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.not_found,
    element: <NotFoundPage />,
    breadcrumbName: "Не найдено",
  },
};
