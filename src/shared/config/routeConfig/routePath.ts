export enum AppRoutes {
  LOGIN = "login",

  TODAY = "today",
  COURSES = "courses",
  COURSE_INVITE = "course_invite",
  WORKLOAD = "workload",

  STATISTIC = "statistic",

  PROFILE = "profile",
  TEST = "test",

  QUESTION_BANK = "question_bank",
  GROUPS = "groups",
  BILLING = "billing",
  REMARKS = "remarks",

  UNIVERSITIES = "universities",
  NOT_FOUND = "not_found",
}

export enum AppSubRoutes {
  COURSE_THEMES = "course_themes",
  COURSE_INVITE = "invite",

  TEST_PASS = "pass",
  TEST_ADD_QUIZ = "add-quiz",
  TEST_EDIT = "edit",
  TEST_QUIZ = "quiz",
  TEST_QUIZ_RESULT = "quiz-result",
  QUESTION_BANK_DETAIL = "bank",
}

export const RoutePath: Record<AppRoutes | AppSubRoutes, string> = {
  [AppRoutes.LOGIN]: "/",

  [AppRoutes.TODAY]: "/today",
  [AppRoutes.COURSES]: "/courses",
  [AppRoutes.COURSE_INVITE]: "/courses/invite",
  [AppRoutes.WORKLOAD]: "/workload",
  [AppSubRoutes.COURSE_THEMES]: "/courses/course_themes/:id?",
  [AppSubRoutes.COURSE_INVITE]: "/courses/invite",

  [AppRoutes.STATISTIC]: "/statistic",

  [AppRoutes.PROFILE]: "/profile",
  [AppRoutes.TEST]: "/test",
  [AppSubRoutes.TEST_PASS]: "/test/pass/:id?",
  [AppSubRoutes.TEST_ADD_QUIZ]: "/test/add-quiz",
  [AppSubRoutes.TEST_EDIT]: "/test/edit/:id?",
  [AppSubRoutes.TEST_QUIZ]: "/test/quiz/:id?",
  [AppSubRoutes.TEST_QUIZ_RESULT]: "/test/quiz-result/:id?",

  [AppRoutes.QUESTION_BANK]: "/question-bank",
  [AppSubRoutes.QUESTION_BANK_DETAIL]: "/question-bank/bank/:id?",
  [AppRoutes.GROUPS]: "/groups",
  [AppRoutes.BILLING]: "/billing",
  [AppRoutes.REMARKS]: "/remarks",
  [AppRoutes.UNIVERSITIES]: "/universities",
  [AppRoutes.NOT_FOUND]: "*",
};
