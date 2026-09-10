import type { QuestionOptionDraft } from "shared/components/QuestionEditor";

export type BankQuestionOption = Pick<QuestionOptionDraft, "id" | "text" | "imagePreview">;

export interface BankQuestion {
  id: string;
  question: string;
  questionImagePreview?: string;
  options: BankQuestionOption[];
  correctAnswer: string | string[];
  multipleAnswers: boolean;
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  questions: BankQuestion[];
}

export type CreateBankPayload = {
  name: string;
  description: string;
};
