import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchQuiz, submitQuizResult } from './quizAPI';
import { QuizPayload, QuizResult } from '../types/quiz';
import axios from 'axios';


export const useFetchQuiz = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => fetchQuiz(quizId),
  
  });
};

export const useSubmitQuizResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuizResult) => {
      const mutationPromise = submitQuizResult(data);
      toast.promise(mutationPromise, {
        loading: 'Отправка результатов...',
        success: 'Результаты викторины успешно сохранены!',
      });
      return mutationPromise;
    },
    onError: () => {
      toast.error(`Ошибка: 'Что-то пошло не так'}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-results'] });
    },
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuizPayload) => {
      const mutationPromise = axios.post('https://utask.kstu.kg/educations/api/v1/quizzes/', data);
      toast.promise(mutationPromise, {
        loading: 'Создание викторины...',
        success: 'Викторина успешно создана!',
      });
      return mutationPromise;
    },
  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};