import { FeedItem } from "entities/Course/model/types/course";
import { QuizPayload } from "features/Quiz/model/types/quiz";

export const mockData: FeedItem[] = [
  {
    id: "1",
    user: { user_id: 47095, name: "Бекс Нурбеков", avatar: "https://diabetoved.ru/upload/resize_cache/iblock/fa0/940_387_1/7ldzs3rbp7w2ynlo85kgesarwqwa15fy.jpg" },
    text: "Эта тема очень хорошо организованна",
    theme: 'asddsad',
    created_at: new Date("2025-04-24T12:41:10.131Z"),
    likes: 2,
    replies: [
      {
        id: "1-1",
        user: { user_id: 1, name: "Мади Сахарок", avatar: "https://diabetoved.ru/upload/resize_cache/iblock/fa0/940_387_1/7ldzs3rbp7w2ynlo85kgesarwqwa15fy.jpg" },
        text: "Согласен с тобой!",
        theme: 'asddsad',
        created_at: new Date("2025-04-24T12:41:10.131Z"),
        likes: 1,
        replies: [
          {
            id: "1-2",
            user: { user_id: 28449, name: "Арслан Жумалиев", avatar: "https://mangabuff.ru/img/manga/posters/vetrolom-2013.jpg?1700349144" },
            text: "Согласен с тобой!",
            theme: 'asddsad',
            created_at: new Date("2025-04-24T12:41:10.131Z"),
            likes: 1,
          },
        ],
      },
      {
        id: "1-1-1",
        user: { user_id: 1, name: "Мади Сахарок", avatar: "https://diabetoved.ru/upload/resize_cache/iblock/fa0/940_387_1/7ldzs3rbp7w2ynlo85kgesarwqwa15fy.jpg" },
        text: "Согласен с тобой!",
        theme: 'asddsad',
        created_at: new Date("2025-04-24T12:41:10.131Z"),
        likes: 1,
      },
    ],
  },
  {
    id: "2",
    user: { user_id: 31, name: "Иосиф Тен", avatar: "https://kstu.kg/fileadmin/user_upload/ten_i.g..jpg" },
    text: "А вот я не согласен.",
    theme: 'asddsad',
    created_at: new Date("2025-04-24T12:41:10.131Z"),
    likes: 0,
    replies: [],
  },
];

export const mockQuizData: QuizPayload[] = [
  {
    quizId: "quiz_1",
    title: "Тест по основам программирования",
   
    questions: [
      {
        id: "q1",
        question: "Что такое переменная в программировании?",
        options: [
          "Функция для выполнения кода",
          "Контейнер для хранения данных",
          "Тип данных",
          "Цикл для повторения операций",
        ],
        correctAnswer: "Контейнер для хранения данных",
      },
      {
        id: "q2",
        question: "Какой из этих языков является объектно-ориентированным?",
        options: ["C", "Python", "HTML", "CSS"],
        correctAnswer: "Python",
      },
      {
        id: "q3",
        question: "Что делает оператор `if`?",
        options: [
          "Повторяет код несколько раз",
          "Проверяет условие и выполняет код, если оно истинно",
          "Определяет функцию",
          "Создает новую переменную",
        ],
        correctAnswer: "Проверяет условие и выполняет код, если оно истинно",
      },
    ],
  },
];