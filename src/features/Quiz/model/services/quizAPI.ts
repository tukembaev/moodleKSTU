import axios from 'axios';
import { QuizResult } from '../types/quiz';


export const fetchQuiz = async (quizId: string) => {
  const response = await axios.get(`https://utask.kstu.kg/educations/api/v1/quizzes/${quizId}/`);
  return response.data;
};

export const submitQuizResult = async (data: QuizResult) => {
  const response = await axios.post('https://utask.kstu.kg/educations/api/v1/quiz-results/', data);
  return response.data;
};