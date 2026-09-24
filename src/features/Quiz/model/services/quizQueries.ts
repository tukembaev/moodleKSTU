import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import i18n from 'shared/config/i18n/i18n';
import { fetchQuiz, submitQuizResult } from './quizAPI';
import { QuizPayload, QuizResult } from '../types/quiz';
import axios from 'axios';
import { API_URL } from "shared/api/config";


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
        loading: i18n.t('Отправка результатов...'),
        success: i18n.t('Результаты викторины успешно сохранены!'),
      });
      return mutationPromise;
    },
    onError: () => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: i18n.t("Что-то пошло не так") }));
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
      const mutationPromise = axios.post(`${API_URL}v1/quizzes/`, data);
      toast.promise(mutationPromise, {
        loading: i18n.t('Создание викторины...'),
        success: i18n.t('Викторина успешно создана!'),
      });
      return mutationPromise;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};
