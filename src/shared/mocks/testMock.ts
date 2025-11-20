export const quizData = {
    id: "quiz_123456789",
    title: "ХАХАХА: Вводный тест",
    description: "Проверьте свои знания по основным темам курса.",
    timeLimit: 2,
    required: true,
    opening_date: "2025-11-17T06:00:00.000Z",
    deadline: "2025-11-24T23:59:59.000Z",
    courseIds: [
      "1",
      "3",
      "5"
    ],
    questions: [
      {
        id: "q_1",
        question: "Какой из вариантов описывает жизненный цикл компонента React?",
        questionImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfCyOEc0bADQWarGB2ARkzQyYg4eGfWmx65w&s",
        multipleAnswers: false,
        options: [
          {
            id: "opt_a",
            text: "Mounting, Updating, Unmounting",
            image: null
          },
          {
            id: "opt_b",
            text: "Starting, Running, Stopping",
            image: null
          },
          {
            id: "opt_c",
            text: "Created, Attached, Detached",
            image: null
          }
        ]
      },
      {
        id: "q_2",
        question: "Какие из следующих хуков являются стандартными в React?",
        questionImage: null,
        multipleAnswers: true,
        options: [
          {
            id: "opt_d",
            text: "useState",
            image: null
          },
          {
            id: "opt_e",
            text: "useEffect",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfCyOEc0bADQWarGB2ARkzQyYg4eGfWmx65w&s"
          },
          {
            id: "opt_f",
            text: "useStore",
            image: null
          },
          {
            id: "opt_g",
            text: "useCallback",
            image: null
          }
        ]
      }
    ]
  };