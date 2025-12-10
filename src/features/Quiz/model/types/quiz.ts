export interface QuizQuestion {
  id: string;
  question: string;

  options: string[];
  correctAnswer: string;
}

export interface QuizPayload {
  quizId: string;
  questions: QuizQuestion[];
  title: string;
  timeLimit?: number; // Время на вопрос в секундах (опционально)
}

export interface QuizResult {
  quizId: string;
  userId: number;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}