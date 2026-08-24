import axios from 'axios';
import { API_URL } from "shared/api/config";
import { QuizResult } from '../types/quiz';


export const fetchQuiz = async (quizId: string) => {
  const response = await axios.get(`${API_URL}v1/quizzes/${quizId}/`);
  return response.data;
};

export const submitQuizResult = async (data: QuizResult) => {
  const response = await axios.post(`${API_URL}v1/quiz-results/`, data);
  return response.data;
};