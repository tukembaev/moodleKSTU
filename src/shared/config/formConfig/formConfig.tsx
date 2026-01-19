import { ReactNode } from "react";
import { lazy, Suspense } from "react";

// Ленивые импорты для избежания циклических зависимостей
const Add_Course = lazy(() => import("features/Course").then(module => ({ default: module.Add_Course })));
const Add_Theme = lazy(() => import("features/Course").then(module => ({ default: module.Add_Theme })));
const Add_Theme_FAQ = lazy(() => import("features/Course").then(module => ({ default: module.Add_Theme_FAQ })));
const Add_Material_file = lazy(() => import("features/Course").then(module => ({ default: module.Add_Material_file })));
const Add_Answer_Theme = lazy(() => import("features/Course").then(module => ({ default: module.Add_Answer_Theme })));
const End_Course = lazy(() => import("features/Course").then(module => ({ default: module.End_Course })));
const Add_Quiz = lazy(() => import("features/Course/forms/add-quiz").then(module => ({ default: module.default })));
const Add_Test = lazy(() => import("features/Test").then(module => ({ default: module.Add_Test })));

// Компонент-обертка для Suspense
const LazyWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div>Loading...</div>}>
    {children}
  </Suspense>
);

export enum FormQuery {
  //course
  ADD_COURSE = "add-course",
  ADD_THEME = "add-theme",
  ADD_THEME_FAQ = "add-faq",
  ADD_MATERIAL = "add_material",
  ADD_ANSWER = "add_answer",
  END_COURSE = "end_course",
  ADD_QUIZ = "add_quiz",
  GOOGLE_AUTH = "google-auth",
  //testing
  ADD_TEST = "add-test",
  CHOOSE_TEST = "choose-test",
}

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
    form: <LazyWrapper><Add_Course /></LazyWrapper>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME,
    title: "Создание темы",
    form: <LazyWrapper><Add_Theme /></LazyWrapper>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME_FAQ,
    title: "Создание FAQ",
    form: <LazyWrapper><Add_Theme_FAQ /></LazyWrapper>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_TEST,
    title: "Создание теста",
    form: <LazyWrapper><Add_Test /></LazyWrapper>,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_MATERIAL,
    title: "Загрузка материала",
    form: <LazyWrapper><Add_Material_file /></LazyWrapper>,
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_ANSWER,
    title: "Загрузка материала",
    form: <LazyWrapper><Add_Answer_Theme /></LazyWrapper>,
    is_student_allow: true,
  },
  {
    query: FormQuery.END_COURSE,
    title: "Итоговый балл",
    form: <LazyWrapper><End_Course /></LazyWrapper>,
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_QUIZ,
    title: "Создание теста",
    form: <LazyWrapper><Add_Quiz /></LazyWrapper>,
    is_student_allow: true,
  },
  // {
  //   query: FormQuery.CHOOSE_TEST,
  //   title: "Создание Теста фыфы",
  //   form: <Choose_test />,
  //   is_student_allow: true,
  // },
  // {
  //   query: FormQuery.GOOGLE_AUTH,
  //   title: "Авторизация Google",
  //   form: <GoogleAuthForm />,
  //   is_student_allow: true,
  // },
];
