import $api_base_edu from "shared/api/api_base_edu";
import { QuizResult } from "../types/quiz";

export const fetchQuiz = async (quizId: string) => {
  const response = await $api_base_edu.get(`v1/quizzes/${quizId}/`);
  return response.data;
};

export const submitQuizResult = async (data: QuizResult) => {
  const response = await $api_base_edu.post(`v1/quiz-results/`, data);
  return response.data;
};
