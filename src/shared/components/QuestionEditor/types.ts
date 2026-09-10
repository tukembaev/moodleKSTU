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
  correctAnswer: string | string[];
  multipleAnswers: boolean;
}

export const emptyOptionDraft = (): QuestionOptionDraft => ({
  text: "",
  image: null,
  imagePreview: undefined,
});

export const emptyQuestionDraft = (): QuestionDraft => ({
  question: "",
  questionImage: null,
  questionImagePreview: undefined,
  options: [emptyOptionDraft(), emptyOptionDraft()],
  correctAnswer: "",
  multipleAnswers: false,
});
