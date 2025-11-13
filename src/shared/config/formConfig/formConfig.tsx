import { ReactNode } from "react";

import {
  Add_Answer_Theme,
  Add_Course,
  Add_Material_file,
  Add_Theme,
  Add_Theme_FAQ,
  End_Course,
} from "features/Course";
import { Add_Test, Choose_test } from "features/Test";
import Add_Quiz from "features/Course/forms/add-quiz";

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
    form: <Add_Course />,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME,
    title: "Создание темы",
    form: <Add_Theme />,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME_FAQ,
    title: "Создание FAQ",
    form: <Add_Theme_FAQ />,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_TEST,
    title: "Создание теста",
    form: <Add_Test />,
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_MATERIAL,
    title: "Загрузка материала",
    form: <Add_Material_file />,
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_ANSWER,
    title: "Загрузка материала",
    form: <Add_Answer_Theme />,
    is_student_allow: true,
  },
  {
    query: FormQuery.END_COURSE,
    title: "Итоговый балл",
    form: <End_Course />,
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_QUIZ,
    title: "Создание теста по усвоению материала",
    form: <Add_Quiz />,
    is_student_allow: true,
  },
  {
    query: FormQuery.CHOOSE_TEST,
    title: "Создание Теста",
    form: <Choose_test />,
    is_student_allow: true,
  },
  // {
  //   query: FormQuery.GOOGLE_AUTH,
  //   title: "Авторизация Google",
  //   form: <GoogleAuthForm />,
  //   is_student_allow: true,
  // },
];
