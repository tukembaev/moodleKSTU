import { queryOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getRemarks,
  getRemarkById,
  createRemark,
  updateRemarkStatus,
  addRemarkMessage,
  getRemarksByTheme,
  getRemarksByThemeAndStudent,
  CreateRemarkPayload,
  UpdateRemarkStatusPayload,
  AddRemarkMessagePayload,
  RemarkListType,
} from './remarkAPI';

// Query hooks для мутаций
export const useCreateRemark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRemarkPayload) => {
      const mutationPromise = createRemark(data);
      toast.promise(mutationPromise, {
        loading: "Создаем замечание...",
        success: "Замечание успешно создано!",
      });
      return mutationPromise;
    },
    onError: (error: any) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remarks'], exact: false });
      // Invalidate answer-task to update remarks count in ListOfStudentsWithAnswers
      queryClient.invalidateQueries({ queryKey: ['answer-task'], exact: false });
    },
  });
};

export const useUpdateRemarkStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRemarkStatusPayload }) => {
      const mutationPromise = updateRemarkStatus(id, data);
      toast.promise(mutationPromise, {
        loading: "Обновляем статус...",
        success: "Статус успешно обновлен!",
      });
      return mutationPromise;
    },
    onError: (error: any) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remarks'], exact: false });
    },
  });
};

export const useAddRemarkMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddRemarkMessagePayload }) => {
      const mutationPromise = addRemarkMessage(id, data);
      toast.promise(mutationPromise, {
        loading: "Отправляем сообщение...",
        success: "Сообщение успешно отправлено!",
      });
      return mutationPromise;
    },
    onError: (error: any) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remarks'], exact: false });
    },
  });
};

// Query Factory
export const remarkQueries = {
  //----------GET QUERIES------------
  allRemarks: (type: RemarkListType = "actual") =>
    queryOptions({
      queryKey: ['remarks', type],
      queryFn: () => getRemarks(type),
    }),

  remarkById: (id: string | null) =>
    queryOptions({
      queryKey: ['remarks', 'detail', id],
      queryFn: () => getRemarkById(id as string),
      enabled: !!id,
    }),

  remarksByTheme: (themeId: string | null) =>
    queryOptions({
      queryKey: ['remarks', 'theme', themeId],
      queryFn: () => getRemarksByTheme(themeId as string),
      enabled: !!themeId,
    }),

  remarksByThemeAndStudent: (themeId: string | null, studentId: number | null) =>
    queryOptions({
      queryKey: ['remarks', 'theme', themeId, 'student', studentId],
      queryFn: () => getRemarksByThemeAndStudent(themeId as string, studentId as number),
      enabled: !!themeId && !!studentId,
    }),

  //----------POST/PATCH QUERIES (mutations)------------
  create_remark: () => useCreateRemark(),
  update_status: () => useUpdateRemarkStatus(),
  add_message: () => useAddRemarkMessage(),
};
