import axios from "axios";
import {
  resolveQuestionType,
  serializeCorrectAnswer,
  type QuestionCorrectAnswer,
  type QuestionDraft,
} from "shared/components/QuestionEditor";
import { dataUrlToFile } from "shared/lib/files";
import $api_edu from "shared/api/api_edu";
import i18n from "shared/config/i18n/i18n";
import type { BankQuestion, CreateBankPayload, QuestionBank } from "../types/questionBank";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const pick = <T>(raw: Record<string, unknown>, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) return raw[key] as T;
  }
  return undefined;
};

const optionalUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

function apiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }
  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  const record = asRecord(data);
  if (record) {
    const detail = record.detail ?? record.message;
    if (typeof detail === "string" && detail.trim()) return detail;
    const firstKey = Object.keys(record)[0];
    const first = firstKey ? record[firstKey] : undefined;
    if (typeof first === "string" && first.trim()) return first;
    if (Array.isArray(first) && first[0]) return String(first[0]);
  }
  if (error.response?.status === 404) return i18n.t("Коллекция вопросов не найдена");
  return error.message || fallback;
}

function unwrapList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  if (record && Array.isArray(record.results)) return record.results;
  return [];
}

function normalizeOption(raw: unknown): BankQuestion["options"][number] {
  const record = asRecord(raw) ?? {};
  return {
    id: String(pick(record, "id") ?? crypto.randomUUID()),
    text: String(pick(record, "text") ?? ""),
    imagePreview: optionalUrl(pick(record, "imagePreview", "image_preview", "image")),
  };
}

function normalizeCorrectAnswer(
  raw: unknown,
  questionType: ReturnType<typeof resolveQuestionType>
): QuestionCorrectAnswer {
  if (raw == null) return questionType === "essay" ? null : "";
  if (typeof raw === "boolean") return raw;
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    if (questionType === "true_false") {
      const trimmed = raw.trim().toLowerCase();
      if (["true", "верно", "1", "yes", "да"].includes(trimmed)) return true;
      if (["false", "неверно", "0", "no", "нет"].includes(trimmed)) return false;
    }
    if (raw.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        return raw;
      }
    }
    return raw;
  }
  return String(raw);
}

function normalizeQuestion(raw: unknown): BankQuestion {
  const record = asRecord(raw) ?? {};
  const options = Array.isArray(record.options) ? record.options.map(normalizeOption) : [];
  const multipleAnswers = Boolean(pick(record, "multipleAnswers", "multiple_answers"));
  const questionType = resolveQuestionType({
    questionType: pick<string>(record, "questionType", "question_type"),
    multipleAnswers,
  });
  return {
    id: String(pick(record, "id") ?? ""),
    question: String(pick(record, "question") ?? ""),
    questionImagePreview: optionalUrl(
      pick(record, "questionImagePreview", "question_image_preview", "questionImage")
    ),
    options,
    correctAnswer: normalizeCorrectAnswer(
      pick(record, "correctAnswer", "correct_answer"),
      questionType
    ),
    multipleAnswers,
    questionType,
  };
}

function normalizeBank(raw: unknown): QuestionBank {
  const record = asRecord(raw) ?? {};
  const questions = Array.isArray(record.questions)
    ? record.questions.map(normalizeQuestion)
    : [];
  const questionsCount = Number(
    pick(record, "questionsCount", "questions_count") ?? questions.length
  );
  return {
    id: String(pick(record, "id") ?? ""),
    name: String(pick(record, "name") ?? ""),
    description: String(pick(record, "description") ?? ""),
    createdAt: String(pick(record, "createdAt", "created_at") ?? ""),
    questions,
    questionsCount: Number.isFinite(questionsCount) ? questionsCount : questions.length,
  };
}

function questionFormData(draft: QuestionDraft): FormData {
  const questionType = resolveQuestionType(draft);
  const formData = new FormData();
  formData.append("question", draft.question);
  formData.append("questionType", questionType);
  formData.append("multipleAnswers", questionType === "multiple_choice" ? "true" : "false");
  if (questionType !== "essay") {
    formData.append("correctAnswer", serializeCorrectAnswer(draft.correctAnswer));
  }
  if (questionType === "single_choice" || questionType === "multiple_choice") {
    formData.append(
      "options",
      JSON.stringify(
        draft.options.map((option) =>
          option.id ? { id: option.id, text: option.text } : { text: option.text }
        )
      )
    );
  }
  if (draft.questionImage instanceof File) {
    formData.append("questionImage", draft.questionImage);
  }
  if (questionType === "single_choice" || questionType === "multiple_choice") {
    draft.options.forEach((option, index) => {
      if (option.image instanceof File) {
        formData.append(`optionImage_${index}`, option.image);
      }
    });
  }
  return formData;
}

async function fileFromPreview(url: string | undefined, filename: string): Promise<File | null> {
  if (!url) return null;
  try {
    return await dataUrlToFile(url, filename);
  } catch {
    return null;
  }
}

export function bankQuestionToDraft(question: BankQuestion): QuestionDraft {
  const questionType = resolveQuestionType(question);
  return {
    id: question.id,
    question: question.question,
    questionImage: null,
    questionImagePreview: question.questionImagePreview,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
      image: null,
      imagePreview: option.imagePreview,
    })),
    correctAnswer: question.correctAnswer,
    multipleAnswers: questionType === "multiple_choice",
    questionType,
  };
}

export async function bankQuestionToInsertDraft(
  question: BankQuestion
): Promise<QuestionDraft> {
  const draft = bankQuestionToDraft(question);
  const questionImage = await fileFromPreview(
    question.questionImagePreview,
    `question-${question.id}`
  );
  const options = await Promise.all(
    question.options.map(async (option) => ({
      text: option.text,
      image: await fileFromPreview(
        option.imagePreview,
        `option-${option.id || crypto.randomUUID()}`
      ),
      imagePreview: option.imagePreview,
    }))
  );
  return {
    ...draft,
    id: undefined,
    questionImage,
    options,
  };
}

export async function getBanks(): Promise<QuestionBank[]> {
  try {
    const response = await $api_edu.get("question-banks/");
    return unwrapList(response.data).map(normalizeBank);
  } catch (error) {
    throw new Error(apiErrorMessage(error, i18n.t("Не удалось загрузить коллекции")));
  }
}

export async function getBank(id: string): Promise<QuestionBank> {
  try {
    const response = await $api_edu.get(`question-banks/${id}/`);
    return normalizeBank(response.data);
  } catch (error) {
    throw new Error(apiErrorMessage(error, i18n.t("Коллекция вопросов не найдена")));
  }
}

export async function createBank(payload: CreateBankPayload): Promise<QuestionBank> {
  try {
    const response = await $api_edu.post("question-banks/", {
      name: payload.name.trim(),
      description: payload.description.trim(),
    });
    return normalizeBank(response.data);
  } catch (error) {
    throw new Error(apiErrorMessage(error, i18n.t("Не удалось создать коллекцию")));
  }
}

export async function deleteBank(id: string): Promise<void> {
  try {
    await $api_edu.delete(`question-banks/${id}/`);
  } catch (error) {
    throw new Error(apiErrorMessage(error, i18n.t("Не удалось удалить коллекцию")));
  }
}

export async function addQuestion(
  bankId: string,
  draft: QuestionDraft
): Promise<BankQuestion> {
  try {
    const response = await $api_edu.post(
      `question-banks/${bankId}/questions/`,
      questionFormData(draft),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return normalizeQuestion(response.data);
  } catch (error) {
    throw new Error(apiErrorMessage(error, i18n.t("Не удалось сохранить вопрос")));
  }
}

export async function updateQuestion(
  bankId: string,
  questionId: string,
  draft: QuestionDraft
): Promise<BankQuestion> {
  try {
    const response = await $api_edu.put(
      `question-banks/${bankId}/questions/${questionId}/`,
      questionFormData(draft),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return normalizeQuestion(response.data);
  } catch (error) {
    throw new Error(apiErrorMessage(error, i18n.t("Не удалось обновить вопрос")));
  }
}

export async function deleteQuestion(
  bankId: string,
  questionId: string
): Promise<void> {
  try {
    await $api_edu.delete(`question-banks/${bankId}/questions/${questionId}/`);
  } catch (error) {
    throw new Error(apiErrorMessage(error, i18n.t("Не удалось удалить вопрос")));
  }
}
