import type { QuestionDraft } from "shared/components/QuestionEditor";
import { dataUrlToFile, fileToDataUrl } from "shared/lib/files";
import type { BankQuestion, CreateBankPayload, QuestionBank } from "../types/questionBank";

const STORAGE_KEY = "qbank:banks";

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 40));

function readBanks(): QuestionBank[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuestionBank[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeBanks(banks: QuestionBank[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(banks));
}

async function persistDraft(draft: QuestionDraft, id?: string): Promise<BankQuestion> {
  const questionImagePreview = draft.questionImage
    ? await fileToDataUrl(draft.questionImage)
    : draft.questionImagePreview;

  const options = await Promise.all(
    draft.options.map(async (option) => ({
      id: option.id || crypto.randomUUID(),
      text: option.text,
      imagePreview: option.image
        ? await fileToDataUrl(option.image)
        : option.imagePreview,
    }))
  );

  return {
    id: id || draft.id || crypto.randomUUID(),
    question: draft.question,
    questionImagePreview,
    options,
    correctAnswer: draft.correctAnswer,
    multipleAnswers: draft.multipleAnswers,
  };
}

export async function bankQuestionToDraft(
  question: BankQuestion
): Promise<QuestionDraft> {
  const questionImage = question.questionImagePreview
    ? await dataUrlToFile(question.questionImagePreview, `question-${question.id}`)
    : null;

  const options = await Promise.all(
    question.options.map(async (option) => ({
      id: option.id,
      text: option.text,
      image: option.imagePreview
        ? await dataUrlToFile(option.imagePreview, `option-${option.id || crypto.randomUUID()}`)
        : null,
      imagePreview: option.imagePreview,
    }))
  );

  return {
    question: question.question,
    questionImage,
    questionImagePreview: question.questionImagePreview,
    options,
    correctAnswer: question.correctAnswer,
    multipleAnswers: question.multipleAnswers,
  };
}

export async function getBanks(): Promise<QuestionBank[]> {
  return delay(readBanks());
}

export async function getBank(id: string): Promise<QuestionBank | null> {
  const banks = await getBanks();
  return banks.find((bank) => bank.id === id) ?? null;
}

export async function createBank(payload: CreateBankPayload): Promise<QuestionBank> {
  const banks = readBanks();
  const bank: QuestionBank = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    description: payload.description.trim(),
    createdAt: new Date().toISOString(),
    questions: [],
  };
  writeBanks([bank, ...banks]);
  return delay(bank);
}

export async function deleteBank(id: string): Promise<void> {
  writeBanks(readBanks().filter((bank) => bank.id !== id));
  return delay(undefined);
}

export async function addQuestion(
  bankId: string,
  draft: QuestionDraft
): Promise<BankQuestion> {
  const banks = readBanks();
  const index = banks.findIndex((bank) => bank.id === bankId);
  if (index === -1) throw new Error("Коллекция вопросов не найден");
  const question = await persistDraft(draft);
  banks[index] = {
    ...banks[index],
    questions: [...banks[index].questions, question],
  };
  writeBanks(banks);
  return delay(question);
}

export async function updateQuestion(
  bankId: string,
  questionId: string,
  draft: QuestionDraft
): Promise<BankQuestion> {
  const banks = readBanks();
  const bankIndex = banks.findIndex((bank) => bank.id === bankId);
  if (bankIndex === -1) throw new Error("Коллекция вопросов не найден");
  const question = await persistDraft(draft, questionId);
  banks[bankIndex] = {
    ...banks[bankIndex],
    questions: banks[bankIndex].questions.map((item) =>
      item.id === questionId ? question : item
    ),
  };
  writeBanks(banks);
  return delay(question);
}

export async function deleteQuestion(
  bankId: string,
  questionId: string
): Promise<void> {
  const banks = readBanks();
  const bankIndex = banks.findIndex((bank) => bank.id === bankId);
  if (bankIndex === -1) throw new Error("Коллекция вопросов не найден");
  banks[bankIndex] = {
    ...banks[bankIndex],
    questions: banks[bankIndex].questions.filter((item) => item.id !== questionId),
  };
  writeBanks(banks);
  return delay(undefined);
}
