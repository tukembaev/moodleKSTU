import { ReactNode, lazy, Suspense } from "react";
import { FormQuery } from "./formQuery";
export { FormQuery };

// Lazy load components from their specific paths to avoid circular dependencies via the features index
const Add_Course = lazy(() => import("features/Course/forms/add-course"));
const Add_Theme = lazy(() => import("features/Course/forms/add-theme"));
const Add_Theme_FAQ = lazy(() => import("features/Course/forms/add-theme-faq"));
const Add_Material_file = lazy(() => import("features/Course/forms/add-material-file"));
const Add_Answer_Theme = lazy(() => import("features/Course/forms/add-answer-theme"));
const End_Course = lazy(() => import("features/Course/forms/end-course"));
const Add_Test = lazy(() => import("features/Test/ui/add-test"));
const Add_Quiz = lazy(() => import("features/Course/forms/add-quiz"));

export interface FormConfig {
  query: FormQuery;
  title: string;
  form: ReactNode;
  is_student_allow: boolean;
}

export const forms: FormConfig[] = [
  {
    query: FormQuery.ADD_COURSE,
    title: "Создание курса",
    form: <Suspense fallback={null}><Add_Course /></Suspense>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME,
    title: "Создание темы",
    form: <Suspense fallback={null}><Add_Theme /></Suspense>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME_FAQ,
    title: "Создание FAQ",
    form: <Suspense fallback={null}><Add_Theme_FAQ /></Suspense>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_TEST,
    title: "Создание теста",
    form: <Suspense fallback={null}><Add_Test /></Suspense>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_MATERIAL,
    title: "Загрузка материала",
    form: <Suspense fallback={null}><Add_Material_file /></Suspense>,
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_ANSWER,
    title: "Загрузка материала",
    form: <Suspense fallback={null}><Add_Answer_Theme /></Suspense>,
    is_student_allow: true,
  },
  {
    query: FormQuery.END_COURSE,
    title: "Итоговый балл",
    form: <Suspense fallback={null}><End_Course /></Suspense>,
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_QUIZ,
    title: "Создание теста",
    form: <Suspense fallback={null}><Add_Quiz /></Suspense>,
    is_student_allow: true,
  },
];
