import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TestPayload } from "../types/test_payload";
import { toast } from "sonner";
import i18n from "shared/config/i18n/i18n";
import {
  createTest,
  createTestWithFormData,
  attachTestToCourse,
  AttachTestToCoursePayload,
  updateTest,
  updateTestWithFormData,
  setTestAvailability,
  SetTestAvailabilityPayload,
  deleteTest,
  resetTestResult,
  ResetTestResultPayload,
} from "entities/Test/model/services/testAPI";

const getMutationErrorMessage = (error: unknown, fallback = i18n.t("Что-то пошло не так")) => {
  const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
  const nonFieldErrors = data?.non_field_errors;
  if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
    return String(nonFieldErrors[0]);
  }
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TestPayload) => {
      const mutationPromise = createTest(data);
      toast.promise(mutationPromise, {
        loading: i18n.t("Публикуем тест..."),
        success: i18n.t("Публикация теста прошла успешно!"),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: getMutationErrorMessage(error) }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test"] });
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
    },
  });
};

export const useCreateTestWithFormData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      const mutationPromise = createTestWithFormData(formData);
      toast.promise(mutationPromise, {
        loading: i18n.t("Публикуем тест..."),
        success: i18n.t("Публикация теста прошла успешно!"),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: getMutationErrorMessage(error) }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test"] });
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
    },
  });
};

export const useAttachTestToCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AttachTestToCoursePayload) => {
      const mutationPromise = attachTestToCourse(data);
      toast.promise(mutationPromise, {
        loading: i18n.t("Прикрепляем тест к курсу..."),
        success: i18n.t("Тест прикреплён к курсу. Откройте его, чтобы студенты могли пройти."),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.warning(getMutationErrorMessage(error));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
    },
  });
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => {
      const mutationPromise = updateTest(id, data);
      toast.promise(mutationPromise, {
        loading: i18n.t("Сохраняем тест..."),
        success: i18n.t("Тест обновлён"),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: getMutationErrorMessage(error) }));
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["test"] });
      queryClient.invalidateQueries({ queryKey: ["test", "questions", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
    },
  });
};

export const useUpdateTestWithFormData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      const mutationPromise = updateTestWithFormData(id, formData);
      toast.promise(mutationPromise, {
        loading: i18n.t("Сохраняем тест..."),
        success: i18n.t("Тест обновлён"),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: getMutationErrorMessage(error) }));
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["test"] });
      queryClient.invalidateQueries({ queryKey: ["test", "questions", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
    },
  });
};

export const useSetTestAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetTestAvailabilityPayload) => {
      const mutationPromise = setTestAvailability(data);
      toast.promise(mutationPromise, {
        loading: data.is_open ? i18n.t("Открываем тест...") : i18n.t("Закрываем тест..."),
        success: data.is_open
          ? i18n.t("Тест открыт для прохождения")
          : i18n.t("Тест закрыт для студентов"),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: getMutationErrorMessage(error) }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
  });
};

export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testId: string) => {
      const mutationPromise = deleteTest(testId);
      toast.promise(mutationPromise, {
        loading: i18n.t("Удаляем тест..."),
        success: i18n.t("Тест удалён"),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: getMutationErrorMessage(error) }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test"] });
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
    },
  });
};

export const useResetTestResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResetTestResultPayload) => {
      const mutationPromise = resetTestResult(data);
      toast.promise(mutationPromise, {
        loading: i18n.t("Обнуляем результат..."),
        success: i18n.t("Результат студента обнулён. Можно пройти тест заново."),
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(i18n.t("Ошибка: {{message}}", { message: getMutationErrorMessage(error) }));
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["test", "result", variables.test_id, variables.course_id],
      });
      queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
  });
};
