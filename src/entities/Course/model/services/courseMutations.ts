import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnswer } from './courseAPI';
import { toast } from 'sonner';

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      const mutationPromise = createAnswer(data);
      toast.promise(mutationPromise, {
        loading: "Загружаем вашу работу...",
        success: "Загрузка работы прошла успешно!",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-answer-task'] });
    },
  });
};
