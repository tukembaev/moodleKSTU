import testVideo from "../../assets/test_video.mp4";
import questionAudio from "../../assets/question_audio.mp3";

export const quizData2 = {
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

export const quizData = {
  id: "quiz_econ_001",
  title: "Итоговый тест по Экономике и организации предприятия",
  description: "Проверка ключевых знаний: структура предприятия, издержки, менеджмент, финансы, маркетинг и антикризисные действия.",
  timeLimit: 20,
  required: true,
  opening_date: "2025-11-17T06:00:00.000Z",
  deadline: "2025-11-24T23:59:59.000Z",
  courseIds: ["econ_1", "econ_2"],

  questions: [

    {
      id: "q_1",
      question: "Какой тип организационной структуры предполагает единоначалие и строгую вертикаль?",
      questionImage: "https://static.tildacdn.com/tild6235-3664-4363-a137-396231303436/photo.jpg",
      multipleAnswers: false,
      options: [
        { id: "opt_a", text: "Линейная структура", image: null },
        { id: "opt_b", text: "Матричная структура", image: null },
        { id: "opt_c", text: "Дивизиональная структура", image: null }
      ]
    }
    ,
    {
      id: "q_2",
      question: "Какие затраты относятся к прямым издержкам?",
      questionImage: null,
      multipleAnswers: true,
      options: [
        { id: "opt_d", text: "Сырьё и материалы", image: null },
        { id: "opt_e", text: "Аренда офиса", image: null },
        { id: "opt_f", text: "Заработная плата производственных рабочих", image: null },
        { id: "opt_g", text: "Реклама", image: null }
      ]
    },
    {
      id: "q_3",
      question: "Прослушайте аудио и ответьте: О чем говорится в записи?",
      questionAudio: questionAudio,
      multipleAnswers: false,
      options: [
        { id: "opt_h", text: "Модель экономичного размера заказа", image: null },
        { id: "opt_i", text: "Метод ABC", image: null },
        { id: "opt_j", text: "Метод FIFO", image: null }
      ]
    }
    ,

    {
      id: "q_4",
      question: "Какие элементы входят в бизнес-план мини-предприятия?",
      multipleAnswers: true,
      options: [
        { id: "opt_k", text: "Описание продукта", image: null },
        { id: "opt_l", text: "План продаж", image: null },
        { id: "opt_m", text: "Рабочие инструкции по технике безопасности", image: null },
        { id: "opt_n", text: "Финансовые расчёты", image: null }
      ]
    },

    {
      id: "q_5",
      question: "Что является целью переговоров с поставщиком?",
      multipleAnswers: false,
      options: [
        { id: "opt_o", text: "Получить наиболее выгодные условия сотрудничества", image: null },
        { id: "opt_p", text: "Уменьшить количество сотрудников", image: null },
        { id: "opt_q", text: "Избежать планирования закупок", image: null }
      ]
    },

    {
      id: "q_6",
      question: "Какие показатели используют для оценки эффективности инвестиционного проекта?",
      multipleAnswers: true,
      options: [
        { id: "opt_r", text: "NPV", image: null },
        { id: "opt_s", text: "IRR", image: null },
        { id: "opt_t", text: "SEO", image: null },
        { id: "opt_u", text: "ROI", image: null }
      ]
    },

    {
      id: "q_7",
      question: "Что относится к функциям менеджмента?",
      multipleAnswers: true,
      options: [
        { id: "opt_v", text: "Планирование", image: null },
        { id: "opt_w", text: "Контроль", image: null },
        { id: "opt_x", text: "Упаковка продукции", image: null },
        { id: "opt_y", text: "Организация", image: null }
      ]
    },

    {
      id: "q_8",
      question: "Какой инструмент помогает анализировать конкурентов?",
      multipleAnswers: false,
      options: [
        { id: "opt_z", text: "SWOT-анализ", image: null },
        { id: "opt_aa", text: "Только финансовая отчётность", image: null },
        { id: "opt_ab", text: "Случайный опрос сотрудников", image: null }
      ]
    },

    {
      id: "q_9",
      question: "Что является признаком кризисной ситуации на предприятии?",
      multipleAnswers: false,
      options: [
        { id: "opt_ac", text: "Падение продаж и рост расходов", image: null },
        { id: "opt_ad", text: "Плановое увеличение ассортимента", image: null },
        { id: "opt_ae", text: "Рост клиентской базы", image: null }
      ]
    },

    {
      id: "q_10",
      question: "Какой элемент входит в систему мотивации персонала?",
      multipleAnswers: true,
      options: [
        { id: "opt_af", text: "KPI", image: null },
        { id: "opt_ag", text: "Гибкий график", image: null },
        { id: "opt_ah", text: "Повышение арендной платы", image: null },
        { id: "opt_ai", text: "Премии и бонусы", image: null }
      ]
    }
  ]
};
