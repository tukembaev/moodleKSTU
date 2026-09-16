import type {
  QuestionCorrectAnswer,
  QuestionOptionDraft,
  QuestionType,
} from "shared/components/QuestionEditor";

export type BankQuestionOption = Pick<QuestionOptionDraft, "id" | "text" | "imagePreview">;

export interface BankQuestion {
  id: string;
  question: string;
  questionImagePreview?: string;
  options: BankQuestionOption[];
  correctAnswer: QuestionCorrectAnswer;
  multipleAnswers: boolean;
  questionType: QuestionType;
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  questions: BankQuestion[];
  questionsCount?: number;
}

export type CreateBankPayload = {
  name: string;
  description: string;
};

export function bankQuestionsCount(bank: Pick<QuestionBank, "questions" | "questionsCount">): number {
  if (typeof bank.questionsCount === "number") return bank.questionsCount;
  return bank.questions?.length ?? 0;
}
