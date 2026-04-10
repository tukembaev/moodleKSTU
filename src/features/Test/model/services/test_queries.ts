import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TestPayload } from "../types/test_payload";
import { toast } from "sonner";
import { createTest, createTestWithFormData, attachTestToWeek, AttachTestToWeekPayload } from "entities/Test/model/services/testAPI";

export const useCreateTest = () =>{
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TestPayload) => {
        const mutationPromise = createTest(data);
        toast.promise(mutationPromise, {
          loading: "Публикуем тест...",
          success: "Публикация теста прошла успешно!",
          // error: "Ошибка при создании теста. Попробуйте снова.",
        });
        return mutationPromise;
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);

      },
      onSuccess: () => {

        queryClient.invalidateQueries({ queryKey: ['test'] });
      },
    });
    }

export const useCreateTestWithFormData = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (formData: FormData) => {
        const mutationPromise = createTestWithFormData(formData);
        toast.promise(mutationPromise, {
          loading: "Публикуем тест...",
          success: "Публикация теста прошла успешно!",
        });
        return mutationPromise;
      },
      onError: (error: any) => {
        toast.error(`Ошибка: ${error?.response?.data?.message || error?.message || "Что-то пошло не так"}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['test'] });
      },
    });
}

export const useAttachTestToWeek = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: AttachTestToWeekPayload) => {
        const mutationPromise = attachTestToWeek(data);
        toast.promise(mutationPromise, {
          loading: "Закрепляем тест на неделю...",
          success: "Тест успешно закреплен на неделю!",
        });
        return mutationPromise;
      },
      onError: (error: any) => {
        // Handle non_field_errors from backend
        const nonFieldErrors = error?.response?.data?.non_field_errors;
        const errorMessage = nonFieldErrors && nonFieldErrors.length > 0 
          ? nonFieldErrors[0] 
          : error?.response?.data?.error || error?.message || "Что-то пошло не так";
        
        toast.warning(errorMessage);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['course'] });
        queryClient.invalidateQueries({ queryKey: ['test'] });
      },
    });
}