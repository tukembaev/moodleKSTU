import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AddRemarkMessagePayload,
  CreateRemarkPayload,
  RemarksListType,
  RemarkStatus,
  UpdateRemarkStatusPayload,
} from "../types/remarks";
import {
  addRemarkMessage,
  createRemark,
  getRemarkById,
  getRemarks,
  getRemarksByTheme,
  getRemarksByThemeAndStudent,
  updateRemarkStatus,
} from "./remarksAPI";

const invalidateRemarkRelatedQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["remarks"] });
  queryClient.invalidateQueries({ queryKey: ["student-answer-task"] });
  queryClient.invalidateQueries({ queryKey: ["answer-task"] });
};

// ---- Мутации ----

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
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
    },
    onSuccess: () => {
      invalidateRemarkRelatedQueries(queryClient);
    },
  });
};

export const useAddRemarkMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AddRemarkMessagePayload;
    }) => {
      const mutationPromise = addRemarkMessage(id, data);
      toast.promise(mutationPromise, {
        loading: "Отправляем сообщение...",
        success: "Сообщение отправлено!",
      });
      return mutationPromise;
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
    },
    onSuccess: () => {
      invalidateRemarkRelatedQueries(queryClient);
    },
  });
};

export const useUpdateRemarkStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      silent,
    }: {
      id: string;
      data: UpdateRemarkStatusPayload;
      silent?: boolean;
    }) => {
      const mutationPromise = updateRemarkStatus(id, data);
      if (!silent) {
        const loading =
          data.status === RemarkStatus.APPROVED
            ? "Одобряем замечание..."
            : data.status === RemarkStatus.REJECTED
            ? "Отклоняем работу..."
            : "Обновляем статус...";
        const success =
          data.status === RemarkStatus.APPROVED
            ? "Замечание одобрено!"
            : data.status === RemarkStatus.REJECTED
            ? "Работа отклонена!"
            : "Статус обновлен!";
        toast.promise(mutationPromise, { loading, success });
      }
      return mutationPromise;
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error?.message || "Что-то пошло не так"}`);
    },
    onSuccess: () => {
      invalidateRemarkRelatedQueries(queryClient);
    },
  });
};

// ---- QueryOptions / фабрика ----

export const remarksQueries = {
  // ----------GET QUERIES------------
  list: (type: RemarksListType = "actual") =>
    queryOptions({
      queryKey: ["remarks", "list", type],
      queryFn: () => getRemarks(type),
    }),
  detail: (id: string | null) =>
    queryOptions({
      queryKey: ["remarks", "detail", id],
      queryFn: () => getRemarkById(id as string),
      enabled: !!id,
    }),
  byTheme: (theme_id: string | null) =>
    queryOptions({
      queryKey: ["remarks", "theme", theme_id],
      queryFn: () => getRemarksByTheme(theme_id as string),
      enabled: !!theme_id,
    }),
  byThemeAndStudent: (
    theme_id: string | null,
    student_id: number | null
  ) =>
    queryOptions({
      queryKey: ["remarks", "theme", theme_id, "student", student_id],
      queryFn: () =>
        getRemarksByThemeAndStudent(theme_id as string, student_id as number),
      enabled: !!theme_id && student_id !== null && student_id !== undefined,
    }),

  // ----------MUTATIONS------------
  create_remark: () => useCreateRemark(),
  add_message: () => useAddRemarkMessage(),
  update_status: () => useUpdateRemarkStatus(),
};
