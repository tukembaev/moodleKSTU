export type GuidePart = {
  id: string;
  title: string;
  src: string | null;
};

export type GuideSection = {
  id: string;
  title: string;
  parts: GuidePart[];
};

const GUIDE_VIDEO_BASE = "https://s3.kstu.kg/guide";

function video(file: string) {
  return `${GUIDE_VIDEO_BASE}/${file}`;
}

const SECTIONS: GuideSection[] = [
  {
    id: "01-start",
    title: "Начало работы",
    parts: [
      {
        id: "01-start/01-login",
        title: "Часть 1. Вход в систему",
        src: video("Start_of_work_entry.mp4"),
      },
    ],
  },
  {
    id: "02-courses",
    title: "Курсы",
    parts: [
      {
        id: "02-courses/01-create-course",
        title: "Часть 1. Создание курса",
        src: video("create_course.mp4"),
      },
      {
        id: "02-courses/02-course-page",
        title: "Часть 2. Страница курса",
        src: video("course_page.mp4"),
      },
      {
        id: "02-courses/03-add-theme",
        title: "Часть 3. Добавление темы",
        src: video("add-theme.mp4"),
      },
      {
        id: "02-courses/04-materials",
        title: "Часть 4. Учебные материалы",
        src: video("ucheb_materials.mp4"),
      },
     
      {
        id: "02-courses/05-course-settings",
        title: "Часть 5. Приглашение студентов на курс",
        src: video("Invite_course.mp4"),
      },
      {
        id: "02-courses/06-students",
        title: "Часть 6. Работа со студентами",
        src: video("work_with_Students.mp4"),
      },
      {
        id: "02-courses/07-delete-course",
        title: "Часть 7. Удаление курса",
        src: video("delete_course.mp4"),
      },
    ],
  },
  {
    id: "03-testing",
    title: "Тестирование",
    parts: [
      {
        id: "03-testing/01-create-test",
        title: "Часть 1. Создание теста",
        src: video("testing_page.mp4"),
      },
      {
        id: "03-testing/02-question-bank",
        title: "Часть 2. Коллекция вопросов",
        src: video("collection_questions.mp4"),
      },
    ],
  },
];

export function buildGuideSections(): GuideSection[] {
  return SECTIONS;
}
