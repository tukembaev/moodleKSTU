import { ReactNode } from "react";

// Импорты страниц (уже имеют встроенную ленивую загрузку через .async.tsx файлы)
import { CoursePage } from "pages/CoursePage";
import { GroupPage } from "pages/GroupPage";
import { LoginPage } from "pages/LoginPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { UniversitiesPage } from "pages/UniversitiesPage";
import UserBilling from "entities/User/ui/UserBilling";
import UserProfile from "entities/User/ui/UserProfile";

import { TestingPage } from "pages/TestingPage";
import { QuestionBankPage } from "pages/QuestionBankPage";
import { BankDetails } from "entities/QuestionBank";
import { StatisticPage } from "pages/StatisticPage";
import AddQuizPage from "features/Quiz/ui/AddQuizPage";
import EditQuizPage from "features/Quiz/ui/EditQuizPage";
import { QuizTestPage } from "pages/QuizTestPage";
import { QuizResultsPage } from "pages/QuizResultsPage";
import { RemarksPage } from "pages/RemarksPage";
import CourseDetails from "entities/Course/ui/CourseDetails";
import CourseInvitePage from "pages/CourseInvitePage/ui/CourseInvitePage";
import { WorkloadPage } from "pages/WorkloadPage";
import { TodayPage } from "pages/TodayPage";
import {
  AppRoutes,
  AppSubRoutes,
  RoutePath,
} from "./routePath";

export { AppRoutes, AppSubRoutes, RoutePath };

export interface AppRoutesProps {
  path: string;
  element: ReactNode;
  breadcrumbName: string;
  children?: AppRoutesProps[];
  aliases?: string[];
}

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.LOGIN]: {
    path: RoutePath.login,
    element: <LoginPage />,
    breadcrumbName: "Главная",
  },
  [AppRoutes.TODAY]: {
    path: RoutePath[AppRoutes.TODAY],
    element: <TodayPage />,
    breadcrumbName: "Сегодня",
  },
  [AppRoutes.COURSES]: {
    path: RoutePath[AppRoutes.COURSES],
    element: <CoursePage />,
    breadcrumbName: "Курсы",
    children: [
      {
        path: RoutePath[AppSubRoutes.COURSE_THEMES],
        element: <CourseDetails />,
        breadcrumbName: "Опр курс",
      },
      {
        path: "/courses/:courseId/announcements",
        element: <CourseDetails />,
        breadcrumbName: "Лента курса",
      },
      {
        path: "/courses/:courseId/feed",
        element: <CourseDetails />,
        breadcrumbName: "Лента курса",
      },
    ],
  },
  [AppRoutes.WORKLOAD]: {
    path: RoutePath[AppRoutes.WORKLOAD],
    element: <WorkloadPage />,
    breadcrumbName: "Нагрузка",
  },
  [AppRoutes.COURSE_INVITE]: {
    path: RoutePath[AppRoutes.COURSE_INVITE],
    element: <CourseInvitePage />,
    breadcrumbName: "Приглашение",
    aliases: [
      "/course/:courseId/:linkId/invite",
      "/courses/invite/:courseId/:linkId",
      "/courses/course_themes/:id/invite",
      "/courses/course_themes/:id/invite/:linkId",
    ],
  },
  [AppRoutes.STATISTIC]: {
    path: RoutePath.statistic,
    element: <StatisticPage />,
    breadcrumbName: "Оплата",
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
        path: RoutePath[AppSubRoutes.TEST_ADD_QUIZ],
        element: <AddQuizPage />,
        breadcrumbName: "Создание теста",
      },
      {
        path: RoutePath[AppSubRoutes.TEST_EDIT],
        element: <EditQuizPage />,
        breadcrumbName: "Редактирование теста",
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

  [AppRoutes.QUESTION_BANK]: {
    path: RoutePath[AppRoutes.QUESTION_BANK],
    element: <QuestionBankPage />,
    breadcrumbName: "Коллекция вопросов",
    children: [
      {
        path: RoutePath[AppSubRoutes.QUESTION_BANK_DETAIL],
        element: <BankDetails />,
        breadcrumbName: "Коллекция",
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
