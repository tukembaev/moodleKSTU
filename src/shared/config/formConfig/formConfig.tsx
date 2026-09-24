import { lazy, ReactNode, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { FormQuery } from "./formQuery";

export { FormQuery };

const Add_Answer_Theme = lazy(
  () => import("features/Course/forms/add-answer-theme")
);
const Add_Course = lazy(() => import("features/Course/forms/add-course"));
const Add_Material_file = lazy(
  () => import("features/Course/forms/add-material-file")
);
const Add_Theme = lazy(() => import("features/Course/forms/add-theme"));
const Add_Theme_FAQ = lazy(
  () => import("features/Course/forms/add-theme-faq")
);
const End_Course = lazy(() => import("features/Course/forms/end-course"));
const Add_Quiz = lazy(() => import("features/Course/forms/add-quiz"));
const Add_Bank = lazy(() => import("features/QuestionBank/forms/add-bank"));
const Add_Test = lazy(() => import("features/Test/ui/add-test"));

export interface FormConfig {
  query: FormQuery;
  title: string;
  form: ReactNode;
  is_student_allow: boolean;
}

function FormLoadingFallback() {
  const { t } = useTranslation();
  return (
    <p className="py-6 text-sm text-muted-foreground">{t("Загрузка формы...")}</p>
  );
}

function formNode(node: ReactNode) {
  return (
    <Suspense fallback={<FormLoadingFallback />}>
      {node}
    </Suspense>
  );
}

export const forms: FormConfig[] = [
  {
    query: FormQuery.ADD_COURSE,
    title: "Создание курса",
    form: formNode(<Add_Course />),
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_BANK,
    title: "Новая коллекция вопросов",
    form: formNode(<Add_Bank />),
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME,
    title: "Создание темы",
    form: formNode(<Add_Theme />),
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_THEME_FAQ,
    title: "Создание FAQ",
    form: formNode(<Add_Theme_FAQ />),
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_TEST,
    title: "Создание теста",
    form: formNode(<Add_Test />),
    is_student_allow: false,
  },
  {
    query: FormQuery.ADD_MATERIAL,
    title: "Загрузка материала",
    form: formNode(<Add_Material_file />),
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_ANSWER,
    title: "Загрузка материала",
    form: formNode(<Add_Answer_Theme />),
    is_student_allow: true,
  },
  {
    query: FormQuery.END_COURSE,
    title: "Итоговый балл",
    form: formNode(<End_Course />),
    is_student_allow: true,
  },
  {
    query: FormQuery.ADD_QUIZ,
    title: "Создание теста",
    form: formNode(<Add_Quiz />),
    is_student_allow: true,
  },
];
