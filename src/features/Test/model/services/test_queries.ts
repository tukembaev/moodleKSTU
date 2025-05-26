import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TestPayload } from "../types/test_payload";
import { toast } from "sonner";
import { createTest } from "entities/Test/model/services/testAPI";

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