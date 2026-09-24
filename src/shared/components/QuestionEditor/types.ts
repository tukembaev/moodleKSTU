import i18n from "shared/config/i18n/i18n";

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_answer"
  | "essay";

export const QUESTION_TYPES: QuestionType[] = [
  "single_choice",
  "multiple_choice",
  "true_false",
  "short_answer",
  "essay",
];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  get single_choice() {
    return i18n.t("Один вариант");
  },
  get multiple_choice() {
    return i18n.t("Несколько вариантов");
  },
  get true_false() {
    return i18n.t("Верно/неверно");
  },
  get short_answer() {
    return i18n.t("Короткий ответ");
  },
  get essay() {
    return i18n.t("Развёрнутый ответ");
  },
} as Record<QuestionType, string>;

export type QuestionCorrectAnswer = string | string[] | boolean | null;

export interface QuestionOptionDraft {
  id?: string;
  text: string;
  image?: File | null;
  imagePreview?: string;
}

export interface QuestionDraft {
  id?: string;
  question: string;
  questionImage?: File | null;
  questionImagePreview?: string;
  options: QuestionOptionDraft[];
  correctAnswer: QuestionCorrectAnswer;
  multipleAnswers: boolean;
  questionType: QuestionType;
}

export const emptyOptionDraft = (): QuestionOptionDraft => ({
  text: "",
  image: null,
  imagePreview: undefined,
});

export const isQuestionType = (value: unknown): value is QuestionType =>
  typeof value === "string" && QUESTION_TYPES.includes(value as QuestionType);

export const resolveQuestionType = (question?: {
  questionType?: string | null;
  multipleAnswers?: boolean;
}): QuestionType => {
  if (isQuestionType(question?.questionType)) return question.questionType;
  return question?.multipleAnswers ? "multiple_choice" : "single_choice";
};

export const isChoiceQuestionType = (type: QuestionType) =>
  type === "single_choice" || type === "multiple_choice" || type === "true_false";

export const isTextQuestionType = (type: QuestionType) =>
  type === "short_answer" || type === "essay";

export const emptyQuestionDraft = (type: QuestionType = "single_choice"): QuestionDraft => {
  if (type === "true_false") {
    return {
      question: "",
      questionImage: null,
      questionImagePreview: undefined,
      options: [],
      correctAnswer: true,
      multipleAnswers: false,
      questionType: type,
    };
  }
  if (type === "short_answer") {
    return {
      question: "",
      questionImage: null,
      questionImagePreview: undefined,
      options: [],
      correctAnswer: "",
      multipleAnswers: false,
      questionType: type,
    };
  }
  if (type === "essay") {
    return {
      question: "",
      questionImage: null,
      questionImagePreview: undefined,
      options: [],
      correctAnswer: null,
      multipleAnswers: false,
      questionType: type,
    };
  }
  return {
    question: "",
    questionImage: null,
    questionImagePreview: undefined,
    options: [emptyOptionDraft(), emptyOptionDraft()],
    correctAnswer: type === "multiple_choice" ? [] : "",
    multipleAnswers: type === "multiple_choice",
    questionType: type,
  };
};

export const applyQuestionType = (
  draft: QuestionDraft,
  nextType: QuestionType
): QuestionDraft => {
  const currentType = resolveQuestionType(draft);
  if (currentType === nextType) {
    return {
      ...draft,
      questionType: nextType,
      multipleAnswers: nextType === "multiple_choice",
    };
  }

  const base = {
    ...draft,
    questionType: nextType,
    multipleAnswers: nextType === "multiple_choice",
  };

  if (nextType === "true_false") {
    return { ...base, options: [], correctAnswer: true };
  }
  if (nextType === "short_answer") {
    return {
      ...base,
      options: [],
      correctAnswer:
        typeof draft.correctAnswer === "string" ? draft.correctAnswer : "",
    };
  }
  if (nextType === "essay") {
    return { ...base, options: [], correctAnswer: null };
  }

  const options =
    draft.options.length >= 2
      ? draft.options
      : [emptyOptionDraft(), emptyOptionDraft(), ...draft.options].slice(0, 2);

  if (nextType === "multiple_choice") {
    const answers = Array.isArray(draft.correctAnswer)
      ? draft.correctAnswer
      : typeof draft.correctAnswer === "string" && draft.correctAnswer
        ? [draft.correctAnswer]
        : [];
    return { ...base, options, correctAnswer: answers };
  }

  const single =
    typeof draft.correctAnswer === "string"
      ? draft.correctAnswer
      : Array.isArray(draft.correctAnswer)
        ? draft.correctAnswer[0] || ""
        : "";
  return { ...base, options, correctAnswer: single };
};

export const isQuestionDraftStarted = (question?: QuestionDraft) => {
  if (!question) return false;
  if (question.question.trim()) return true;
  if (question.questionImage || question.questionImagePreview) return true;
  const type = resolveQuestionType(question);
  if (type === "short_answer") {
    return typeof question.correctAnswer === "string" && Boolean(question.correctAnswer.trim());
  }
  if (type === "true_false" || type === "essay") {
    return false;
  }
  const hasCorrect = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.length > 0
    : typeof question.correctAnswer === "string"
      ? Boolean(question.correctAnswer)
      : false;
  if (hasCorrect) return true;
  return question.options.some(
    (option) => option.text.trim() || option.image || option.imagePreview
  );
};

export const validateQuestionDraft = (question?: QuestionDraft): true | string => {
  if (!question?.question?.trim()) return i18n.t("Введите текст вопроса");
  const type = resolveQuestionType(question);
  if (type === "essay") return true;
  if (type === "short_answer") {
    const text =
      typeof question.correctAnswer === "string" ? question.correctAnswer.trim() : "";
    if (!text) return i18n.t("Укажите эталонный текст ответа");
    return true;
  }
  if (type === "true_false") {
    if (typeof question.correctAnswer !== "boolean") {
      return i18n.t("Выберите правильный ответ");
    }
    return true;
  }
  if (question.options.some((option) => !option.text.trim())) {
    return i18n.t("Заполните все варианты ответов");
  }
  if (type === "multiple_choice") {
    if (
      !Array.isArray(question.correctAnswer) ||
      question.correctAnswer.length === 0
    ) {
      return i18n.t("Выберите правильный ответ");
    }
    return true;
  }
  if (!question.correctAnswer) return i18n.t("Выберите правильный ответ");
  return true;
};

export const serializeCorrectAnswer = (value: QuestionCorrectAnswer) => {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value == null) return "";
  return String(value);
};

export type ApiQuestionPayload = {
  id?: string;
  question: string;
  questionType: QuestionType;
  multipleAnswers: boolean;
  correctAnswer?: QuestionCorrectAnswer;
  options?: Array<{ id?: string; text: string; is_correct?: boolean }>;
};

export const toApiQuestionPayload = (question: QuestionDraft): ApiQuestionPayload => {
  const type = resolveQuestionType(question);
  const payload: ApiQuestionPayload = {
    ...(question.id ? { id: question.id } : {}),
    question: question.question,
    questionType: type,
    multipleAnswers: type === "multiple_choice",
  };

  if (type === "true_false") {
    payload.correctAnswer = Boolean(question.correctAnswer);
    return payload;
  }
  if (type === "short_answer") {
    payload.correctAnswer =
      typeof question.correctAnswer === "string" ? question.correctAnswer : "";
    return payload;
  }
  if (type === "essay") {
    return payload;
  }

  const correctAnswers = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : typeof question.correctAnswer === "string" && question.correctAnswer
      ? [question.correctAnswer]
      : [];

  payload.correctAnswer =
    type === "multiple_choice" ? correctAnswers : correctAnswers[0] || "";
  payload.options = question.options
    .filter((option) => option.text.trim() !== "")
    .map((option) => ({
      ...(option.id ? { id: option.id } : {}),
      text: option.text,
      is_correct: correctAnswers.includes(option.text),
    }));
  return payload;
};
