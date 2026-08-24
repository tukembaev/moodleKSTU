export interface Test {
  id: string;
  title: string;
  description: string;
  opening_date: string; // ISO string
  max_points: number;
  min_points?: number;
  status: boolean;
  result: number | null;
  passed?: boolean | null;
  is_open: boolean | null;
}
export interface TestResult {
  id: number | string;
  name: string;
  group: string;
  user_id: number;
  student_id?: number;
  result: number | null;
  passed: boolean | null;
  avatar: string;
}

// Варианты ответа
export interface TestOption {
  id: string;
  text: string;
  image: string | null;
  order: number;
  is_correct?: boolean;
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
  minPoints?: number;
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
  score?: number;
  maxPoints?: number;
  minPoints?: number;
  passed?: boolean;
  totalQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  timeSpent?: number;                    // в секундах
  completionDate?: string;               // ISO string
  detailedResults?: DetailedResult[];   // опционально, если showCorrectAnswers = true
}

export const studentCanTakeTest = (test: {
  passed?: boolean | null;
  is_open?: boolean | null;
}) => test.passed == null && test.is_open === true;

export const getTestStudentId = (student: TestResult): number => {
  if (typeof student.student_id === "number") return student.student_id;
  if (typeof student.id === "number") return student.id;
  return student.user_id;
};

