import testVideo from "../../assets/test_video.mp4";
import questionAudio from "../../assets/question_audio.mp3";

export const quizData = {
  id: "quiz_123456789",
  title: "Мультимедийный тест",
  description: "Тест на проверку знаний с использованием текстовых, графических, аудио и видео вопросов.",
  timeLimit: 15,
  required: true,
  opening_date: "2025-11-17T06:00:00.000Z",
  deadline: "2025-11-24T23:59:59.000Z",
  courseIds: ["1", "3", "5"],
  questions: [
    {
      id: "q_1",
      question: "Какой из вариантов описывает жизненный цикл компонента React?",
      questionImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfCyOEc0bADQWarGB2ARkzQyYg4eGfWmx65w&s",
      multipleAnswers: false,
      options: [
        { id: "opt_a", text: "Mounting, Updating, Unmounting", image: null },
        { id: "opt_b", text: "Starting, Running, Stopping", image: null },
        { id: "opt_c", text: "Created, Attached, Detached", image: null }
      ]
    },
    {
      id: "q_2",
      question: "Какие из следующих хуков являются стандартными в React?",
      questionImage: null,
      multipleAnswers: true,
      options: [
        { id: "opt_d", text: "useState", image: null },
        { id: "opt_e", text: "useEffect", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfCyOEc0bADQWarGB2ARkzQyYg4eGfWmx65w&s" },
        { id: "opt_f", text: "useStore", image: null },
        { id: "opt_g", text: "useCallback", image: null }
      ]
    },
    {
      id: "q_3",
      question: "Прослушайте аудио и ответьте: О чем говорится в записи?",
      questionAudio: questionAudio,
      multipleAnswers: false,
      options: [
        { id: "opt_h", text: "О природе", image: null },
        { id: "opt_i", text: "О технологиях", image: null },
        { id: "opt_j", text: "О космосе", image: null }
      ]
    },
    {
      id: "q_4",
      question: "Посмотрите видео и определите, какой процесс демонстрируется.",
      questionVideo: testVideo,
      multipleAnswers: false,
      options: [
        { id: "opt_k", text: "Компиляция кода", image: null },
        { id: "opt_l", text: "Рендеринг 3D сцены", image: null },
        { id: "opt_m", text: "Запуск ракеты", image: null }
      ]
    },
    {
      id: "q_5",
      question: "Что выведет консоль: console.log(typeof null)?",
      multipleAnswers: false,
      options: [
        { id: "opt_n", text: "\"null\"", image: null },
        { id: "opt_o", text: "\"object\"", image: null },
        { id: "opt_p", text: "\"undefined\"", image: null }
      ]
    },
    {
      id: "q_6",
      question: "Выберите все примитивные типы данных в JavaScript.",
      multipleAnswers: true,
      options: [
        { id: "opt_q", text: "String", image: null },
        { id: "opt_r", text: "Number", image: null },
        { id: "opt_s", text: "Object", image: null },
        { id: "opt_t", text: "Boolean", image: null }
      ]
    },
    {
      id: "q_7",
      question: "Какой метод используется для добавления элемента в конец массива?",
      multipleAnswers: false,
      options: [
        { id: "opt_u", text: "push()", image: null },
        { id: "opt_v", text: "pop()", image: null },
        { id: "opt_w", text: "shift()", image: null }
      ]
    },
    {
      id: "q_8",
      question: "Что такое Virtual DOM?",
      multipleAnswers: false,
      options: [
        { id: "opt_x", text: "Виртуальная машина для запуска JS", image: null },
        { id: "opt_y", text: "Легковесная копия реального DOM", image: null },
        { id: "opt_z", text: "Браузерный API", image: null }
      ]
    },
    {
      id: "q_9",
      question: "Выберите правильный способ объявления переменной в ES6.",
      multipleAnswers: true,
      options: [
        { id: "opt_aa", text: "var", image: null },
        { id: "opt_ab", text: "let", image: null },
        { id: "opt_ac", text: "const", image: null }
      ]
    },
    {
      id: "q_10",
      question: "Какое значение вернет Boolean(\"\")?",
      multipleAnswers: false,
      options: [
        { id: "opt_ad", text: "true", image: null },
        { id: "opt_ae", text: "false", image: null },
        { id: "opt_af", text: "undefined", image: null }
      ]
    }
  ]
};