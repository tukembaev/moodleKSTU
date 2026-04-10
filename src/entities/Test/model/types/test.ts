export interface Test {
  id: string;
  title: string;
  description: string;
  opening_date: string; // ISO string
  max_points: number;
  status: boolean;
  result: number | null;
}
export interface TestResult {
  id: string,
  name: string,
  group: string,
  user_id: number,
  result: number,

  avatar: string
}

// Варианты ответа
export interface TestOption {
  id: string;
  text: string;
  image: string | null;
  order: number;
}

// Вопрос теста
export interface TestQuestion {
  id: string;
  question: string;
  questionImage: string | null;
  questionAudio: string | null;
  questionVideo: string | null;
  multipleAnswers: boolean;
  options: TestOption[];
}

// Основной объект теста
export interface TestDetails {
  id: string;
  title: string;
  description: string;
  showCorrectAnswers: boolean;
  maxPoints: number;
  timeLimit: number;                    // в минутах
  required: boolean;
  opening_date: string;                 // ISO string
  courseIds: string[];
  questions: TestQuestion[];
}

// Типы для отправки ответов на тест
export interface TestAnswer {
  questionId: string;
  selectedOptions: string[];
}

export interface TestSubmissionPayload {
  answers: TestAnswer[];
  timeRemaining?: number;
  showCorrectAnswers?: boolean;
}

// Типы для ответа от API после отправки теста
export interface SelectedOption {
  id: string;
  text: string;
}

export interface CorrectOption {
  id: string;
  text: string;
}

export interface DetailedResult {
  questionId: string;
  questionText: string;
  questionImage: string | null;
  selectedOptions: SelectedOption[];
  correctOptions: CorrectOption[];
  isCorrect: boolean;
}

export interface TestSubmissionResponse {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeSpent: number;                    // в секундах
  completionDate: string;               // ISO string
  detailedResults?: DetailedResult[];   // опционально, если showCorrectAnswers = true
}

