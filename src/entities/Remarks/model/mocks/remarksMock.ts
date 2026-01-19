import { Remark, RemarkStatus } from "../types/remarks";

// Мок-данные для демонстрации функционала замечаний

// export const mockRemarks: Remark[] = [
//   // Замечание 1: Текстовое замечание, ожидает ответа студента
//   {
//     id: "remark-1",
//     course_id: "course-1",
//     title: "",
//     course_name: "Основы программирования",
//     theme_id: "theme-1",
//     theme_title: "Лабораторная работа №1: Введение в Python",
//     student_id: 101,
//     student_name: "Иванов Александр Петрович",
//     student_avatar: "",
//     student_group: "ИС-21-1",
//     teacher_id: 1,
//     teacher_name: "Петров Сергей Михайлович",
//     teacher_avatar: "",
//     status: RemarkStatus.PENDING,
//     messages: [
//       {
//         id: "msg-1-1",
//         remark_id: "remark-1",
//         sender_id: 1,
//         sender_name: "Петров Сергей Михайлович",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "Добрый день! Вы забыли прикрепить документацию к лабораторной работе. Без неё работа не будет проверяться. Пожалуйста, добавьте описание алгоритма и блок-схему.",
//         created_at: new Date("2024-12-20T10:30:00"),
//       },
//     ],
//     created_at: new Date("2024-12-20T10:30:00"),
//     updated_at: new Date("2024-12-20T10:30:00"),
//   },

//   // Замечание 2: К файлу, студент ответил
//   {
//     id: "remark-2",
//     title: "",
//     course_id: "course-1",
//     course_name: "Основы программирования",
//     theme_id: "theme-2",
//     theme_title: "Лабораторная работа №2: Циклы и условия",
//     student_id: 101,
//     student_name: "Иванов Александр Петрович",
//     student_avatar: "",
//     student_group: "ИС-21-1",
//     teacher_id: 1,
//     teacher_name: "Петров Сергей Михайлович",
//     teacher_avatar: "",

//     status: RemarkStatus.RESPONDED,

//     messages: [
//       {
//         id: "msg-2-1",
//         remark_id: "remark-2",
//         sender_id: 1,
//         sender_name: "Петров Сергей Михайлович",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "В файле lab2_solution.py на строке 45 обнаружена ошибка: бесконечный цикл при вводе отрицательного числа. Необходимо добавить проверку входных данных.",

//         created_at: new Date("2024-12-19T09:00:00"),
//       },
//       {
//         id: "msg-2-2",
//         remark_id: "remark-2",
//         sender_id: 101,
//         sender_name: "Иванов Александр Петрович",
//         sender_avatar: "",
//         sender_role: "student",
//         message: "Здравствуйте! Исправил ошибку, добавил валидацию входных данных. Прикрепляю исправленный файл.",

//         created_at: new Date("2024-12-19T15:30:00"),
//       },
//     ],
//     created_at: new Date("2024-12-19T09:00:00"),
//     updated_at: new Date("2024-12-19T15:30:00"),
//   },

//   // Замечание 3: Отклонённое после ответа
//   {
//     title: "",
//     id: "remark-3",
//     course_id: "course-2",
//     course_name: "Базы данных",
//     theme_id: "theme-3",
//     theme_title: "Практическая работа: SQL запросы",
//     student_id: 102,
//     student_name: "Сидорова Мария Викторовна",
//     student_avatar: "",
//     student_group: "ИС-21-2",
//     teacher_id: 1,
//     teacher_name: "Петров Сергей Михайлович",
//     teacher_avatar: "",

//     status: RemarkStatus.REJECTED,
//     messages: [
//       {
//         id: "msg-3-1",
//         remark_id: "remark-3",
//         sender_id: 1,
//         sender_name: "Петров Сергей Михайлович",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "В вашем решении отсутствует оптимизация запросов. Используйте индексы и объясните выбор структуры таблиц.",

//         created_at: new Date("2024-12-15T11:00:00"),
//       },
//       {
//         id: "msg-3-2",
//         remark_id: "remark-3",
//         sender_id: 102,
//         sender_name: "Сидорова Мария Викторовна",
//         sender_avatar: "",
//         sender_role: "student",
//         message: "Добавила комментарии к коду с объяснением выбора структуры.",

//         created_at: new Date("2024-12-16T10:00:00"),
//       },
//       {
//         id: "msg-3-3",
//         remark_id: "remark-3",
//         sender_id: 1,
//         sender_name: "Петров Сергей Михайлович",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "К сожалению, ответ недостаточно полный. Необходимо также продемонстрировать работу с индексами на практике. Добавьте примеры EXPLAIN для ваших запросов.",

//         created_at: new Date("2024-12-16T14:00:00"),
//       },
//     ],
//     created_at: new Date("2024-12-15T11:00:00"),
//     updated_at: new Date("2024-12-16T14:00:00"),
//   },

//   // Замечание 4: Новое текстовое замечание
//   {
//     title: "",
//     id: "remark-4",
//     course_id: "course-1",
//     course_name: "Основы программирования",
//     theme_id: "theme-4",
//     theme_title: "СРС: Рекурсия",
//     student_id: 103,
//     student_name: "Козлов Дмитрий Андреевич",
//     student_avatar: "",
//     student_group: "ИС-21-1",
//     teacher_id: 1,
//     teacher_name: "Петров Сергей Михайлович",
//     teacher_avatar: "",

//     status: RemarkStatus.PENDING,
//     messages: [
//       {
//         id: "msg-4-1",
//         remark_id: "remark-4",
//         sender_id: 1,
//         sender_name: "Петров Сергей Михайлович",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "Работа не соответствует требованиям: отсутствует рекурсивное решение задачи о Ханойских башнях. Выполните это задание и прикрепите решение.",

//         created_at: new Date("2024-12-24T08:00:00"),
//       },
//     ],
//     created_at: new Date("2024-12-24T08:00:00"),
//     updated_at: new Date("2024-12-24T08:00:00"),
//   },

//   // Замечание 5: К файлу, ожидает ответа
//   {
//     title: "",
//     id: "remark-5",
//     course_id: "course-3",
//     course_name: "Веб-разработка",
//     theme_id: "theme-5",
//     theme_title: "Лабораторная работа: React Components",
//     student_id: 101,
//     student_name: "Иванов Александр Петрович",
//     student_avatar: "",
//     student_group: "ИС-21-1",
//     teacher_id: 2,
//     teacher_name: "Кузнецова Анна Игоревна",
//     teacher_avatar: "",

//     status: RemarkStatus.PENDING,

//     messages: [
//       {
//         id: "msg-5-1",
//         remark_id: "remark-5",
//         sender_id: 2,
//         sender_name: "Кузнецова Анна Игоревна",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "В компоненте App.tsx обнаружены проблемы с производительностью: отсутствует мемоизация, компоненты перерисовываются без необходимости. Используйте useMemo и useCallback для оптимизации.",

//         created_at: new Date("2024-12-23T09:00:00"),
//       },
//     ],
//     created_at: new Date("2024-12-23T09:00:00"),
//     updated_at: new Date("2024-12-23T09:00:00"),
//   },
// ];

// // Архивные замечания
// export const mockArchivedRemarks: Remark[] = [
//   {
//     title: "",
//     id: "remark-archived-1",
//     course_id: "course-1",
//     course_name: "Основы программирования",
//     theme_id: "theme-0",
//     theme_title: "Введение в курс",
//     student_id: 101,
//     student_name: "Иванов Александр Петрович",
//     student_avatar: "",
//     student_group: "ИС-21-1",
//     teacher_id: 1,
//     teacher_name: "Петров Сергей Михайлович",
//     teacher_avatar: "",

//     status: RemarkStatus.APPROVED,
//     messages: [
//       {
//         id: "msg-arch-1-1",
//         remark_id: "remark-archived-1",
//         sender_id: 1,
//         sender_name: "Петров Сергей Михайлович",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "Необходимо добавить ссылки на использованные источники.",

//         created_at: new Date("2024-12-01T10:00:00"),
//       },
//       {
//         id: "msg-arch-1-2",
//         remark_id: "remark-archived-1",
//         sender_id: 101,
//         sender_name: "Иванов Александр Петрович",
//         sender_avatar: "",
//         sender_role: "student",
//         message: "Добавил список литературы в конец работы.",

//         created_at: new Date("2024-12-02T14:00:00"),
//       },
//     ],
//     created_at: new Date("2024-12-01T10:00:00"),
//     updated_at: new Date("2024-12-02T14:00:00"),
//     archived_at: new Date("2024-12-03T09:00:00"),
//   },
//   {
//     title: "",
//     id: "remark-archived-2",
//     course_id: "course-2",
//     course_name: "Базы данных",
//     theme_id: "theme-db-1",
//     theme_title: "ER-диаграммы",
//     student_id: 102,
//     student_name: "Сидорова Мария Викторовна",
//     student_avatar: "",
//     student_group: "ИС-21-2",
//     teacher_id: 1,
//     teacher_name: "Петров Сергей Михайлович",
//     teacher_avatar: "",

//     status: RemarkStatus.APPROVED,

//     messages: [
//       {
//         id: "msg-arch-2-1",
//         remark_id: "remark-archived-2",
//         sender_id: 1,
//         sender_name: "Петров Сергей Михайлович",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "В ER-диаграмме неправильно обозначены связи many-to-many. Исправьте на промежуточные таблицы.",

//         created_at: new Date("2024-11-26T10:00:00"),
//       },
//       {
//         id: "msg-arch-2-2",
//         remark_id: "remark-archived-2",
//         sender_id: 102,
//         sender_name: "Сидорова Мария Викторовна",
//         sender_avatar: "",
//         sender_role: "student",
//         message: "Исправила диаграмму, добавила промежуточные таблицы для связей many-to-many.",

//         created_at: new Date("2024-11-27T15:00:00"),
//       },
//     ],
//     created_at: new Date("2024-11-26T10:00:00"),
//     updated_at: new Date("2024-11-27T15:00:00"),
//     archived_at: new Date("2024-11-28T09:00:00"),
//   },
//   {
//     title: "",
//     id: "remark-archived-3",
//     course_id: "course-3",
//     course_name: "Веб-разработка",
//     theme_id: "theme-web-1",
//     theme_title: "HTML и CSS основы",
//     student_id: 101,
//     student_name: "Иванов Александр Петрович",
//     student_avatar: "",
//     student_group: "ИС-21-1",
//     teacher_id: 2,
//     teacher_name: "Кузнецова Анна Игоревна",
//     teacher_avatar: "",

//     status: RemarkStatus.APPROVED,
//     messages: [
//       {
//         id: "msg-arch-3-1",
//         remark_id: "remark-archived-3",
//         sender_id: 2,
//         sender_name: "Кузнецова Анна Игоревна",
//         sender_avatar: "",
//         sender_role: "teacher",
//         message: "Страница не адаптивна. Добавьте медиа-запросы для мобильных устройств.",

//         created_at: new Date("2024-11-20T11:00:00"),
//       },
//       {
//         id: "msg-arch-3-2",
//         remark_id: "remark-archived-3",
//         sender_id: 101,
//         sender_name: "Иванов Александр Петрович",
//         sender_avatar: "",
//         sender_role: "student",
//         message: "Добавил адаптивную вёрстку с использованием Flexbox и Grid.",

//         created_at: new Date("2024-11-21T16:00:00"),
//       },
//     ],
//     created_at: new Date("2024-11-20T11:00:00"),
//     updated_at: new Date("2024-11-21T16:00:00"),
//     archived_at: new Date("2024-11-22T10:00:00"),
//   },
// ];
