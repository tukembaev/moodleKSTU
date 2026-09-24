import type {
  QuestionCorrectAnswer,
  QuestionType,
} from "shared/components/QuestionEditor";
import { resolveQuestionType } from "shared/components/QuestionEditor";
import { hasActiveLocalAttempt } from "../lib/attemptDraftCache";

export interface Test {
  id: string;
  title: string;
  description: string;
  opening_date: string; // ISO string
  max_points: number;
  min_points?: number;
  minPoints?: number;
  status: boolean;
  result: number | null;
  comment?: string | null;
  passed?: boolean | null;
  needsReview?: boolean | null;
  is_open: boolean | null;
}

export interface TestAttemptAnswer {
  questionId: string;
  questionType?: QuestionType | string;
  questionText?: string;
  textAnswer?: string;
  selectedOptions?: Array<string | { id: string; text: string }>;
  correctOptions?: Array<string | { id: string; text: string }>;
  isCorrect?: boolean | null;
  isSkipped?: boolean;
  needsReview?: boolean;
  comment?: string | null;
  points?: number | null;
}

export interface TestResult {
  id?: number | string;
  name: string;
  group: string;
  group_by?: string[];
  user_id?: number;
  student_id?: number;
  result: number | null;
  result_id?: string | null;
  comment?: string | null;
  passed?: boolean | null;
  needsReview?: boolean | null;
  avatar: string;
  answers?: TestAttemptAnswer[];
}

export interface TestOption {
  id: string;
  text: string;
  image: string | null;
  order: number;
  is_correct?: boolean;
}

export interface TestQuestion {
  id: string;
  question: string;
  questionImage: string | null;
  questionAudio: string | null;
  questionVideo: string | null;
  multipleAnswers: boolean;
  questionType?: QuestionType;
  correctAnswer?: QuestionCorrectAnswer;
  options: TestOption[];
}

export interface TestDetails {
  id: string;
  title: string;
  description: string;
  showCorrectAnswers: boolean;
  maxPoints: number;
  minPoints?: number;
  min_points?: number;
  timeLimit: number;
  /** How many questions from the bank a student receives. Omit or 0 = all. */
  questionsPerAttempt?: number;
  /** Server-drawn question ids for the current student attempt, in display order. */
  attemptQuestionIds?: string[];
  required: boolean;
  opening_date: string;
  courseIds: string[];
  questions: TestQuestion[];
}

export interface TestAnswer {
  questionId: string;
  selectedOptions?: string[];
  textAnswer?: string;
}

export interface TestSubmissionPayload {
  answers: TestAnswer[];
  timeRemaining?: number;
  showCorrectAnswers?: boolean;
  /** Question ids actually shown in this attempt. Backend scores only these. */
  servedQuestionIds?: string[];
}

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
  questionType?: QuestionType | string;
  questionImage: string | null;
  selectedOptions: SelectedOption[];
  correctOptions: CorrectOption[];
  textAnswer?: string;
  isCorrect: boolean | null;
  needsReview?: boolean;
  comment?: string | null;
}

export interface TestSubmissionResponse {
  score?: number;
  maxPoints?: number;
  minPoints?: number;
  min_points?: number;
  passed?: boolean;
  needsReview?: boolean;
  pendingReview?: number;
  resultId?: string;
  totalQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  timeSpent?: number;
  completionDate?: string;
  detailedResults?: DetailedResult[];
}

export interface SavedAttemptAnswer {
  questionId: string;
  selectedOptions?: string[];
  textAnswer?: string;
}

export const isFilledTestQuestion = (question: TestQuestion) => {
  if (question.question?.trim()) return true;
  if (question.questionImage || question.questionAudio || question.questionVideo) {
    return true;
  }
  const type = resolveQuestionType(question);
  if (type === "short_answer" || type === "essay" || type === "true_false") {
    return Boolean(question.question?.trim());
  }
  return (
    question.options?.some(
      (option) => Boolean(option.text?.trim()) || Boolean(option.image)
    ) ?? false
  );
};

export const getTestMinPoints = (source?: {
  minPoints?: number | null;
  min_points?: number | null;
} | null): number => {
  const value = source?.minPoints ?? source?.min_points;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
};

export const resolveTestPassed = (input: {
  result?: number | null;
  minPoints?: number | null;
  passed?: boolean | null;
  needsReview?: boolean | null;
}): boolean | null => {
  if (input.needsReview) return null;
  if (input.result === null || input.result === undefined) {
    return input.passed ?? null;
  }
  return input.result >= (input.minPoints ?? 0);
};

export const normalizeListedTest = (test: Test): Test => {
  const min_points = getTestMinPoints(test);
  return {
    ...test,
    min_points,
    passed: resolveTestPassed({
      result: test.result,
      minPoints: min_points,
      passed: test.passed,
      needsReview: test.needsReview,
    }),
  };
};

export const studentCanTakeTest = (test: {
  passed?: boolean | null;
  is_open?: boolean | null;
  needsReview?: boolean | null;
}) => test.passed == null && test.needsReview !== true && test.is_open === true;

export const studentCanContinueTest = (test: {
  id: string;
  is_open?: boolean | null;
}) => test.is_open === true && hasActiveLocalAttempt(test.id);

export const getTestStudentId = (student: TestResult): number => {
  if (typeof student.student_id === "number") return student.student_id;
  if (typeof student.id === "number") return student.id;
  return student.user_id ?? 0;
};

export const studentNeedsReview = (student: TestResult) =>
  student.needsReview === true ||
  Boolean(student.answers?.some((answer) => answer.needsReview));
