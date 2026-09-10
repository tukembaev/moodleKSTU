import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QuestionDraft } from "shared/components/QuestionEditor";
import {
  addQuestion,
  createBank,
  deleteBank,
  deleteQuestion,
  getBank,
  getBanks,
  updateQuestion,
} from "./questionBankAPI";
import type { CreateBankPayload } from "../types/questionBank";

const LIST_KEY = ["question-bank"] as const;

export const questionBankQueries = {
  allBanks: () =>
    queryOptions({
      queryKey: LIST_KEY,
      queryFn: () => getBanks(),
    }),
  bank: (id: string | null) =>
    queryOptions({
      queryKey: [...LIST_KEY, id],
      queryFn: () => getBank(id as string),
      enabled: !!id,
    }),
  create_bank: () => useCreateBank(),
  delete_bank: () => useDeleteBank(),
  add_question: () => useAddQuestion(),
  update_question: () => useUpdateQuestion(),
  delete_question: () => useDeleteQuestion(),
};

const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBankPayload) => {
      const mutationPromise = createBank(data);
      toast.promise(mutationPromise, {
        loading: "Создаём Коллекция вопросов...",
        success: "Коллекция вопросов создан",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось создать Коллекция"}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
    },
  });
};

const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const mutationPromise = deleteBank(id);
      toast.promise(mutationPromise, {
        loading: "Удаляем Коллекция...",
        success: "Коллекция удалён",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось удалить Коллекция"}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
    },
  });
};

const useAddQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bankId, question }: { bankId: string; question: QuestionDraft }) => {
      const mutationPromise = addQuestion(bankId, question);
      toast.promise(mutationPromise, {
        loading: "Сохраняем вопрос...",
        success: "Вопрос добавлен в Коллекция",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось сохранить вопрос"}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
      queryClient.invalidateQueries({ queryKey: [...LIST_KEY, variables.bankId] });
    },
  });
};

const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bankId,
      questionId,
      question,
    }: {
      bankId: string;
      questionId: string;
      question: QuestionDraft;
    }) => {
      const mutationPromise = updateQuestion(bankId, questionId, question);
      toast.promise(mutationPromise, {
        loading: "Обновляем вопрос...",
        success: "Вопрос обновлён",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось обновить вопрос"}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
      queryClient.invalidateQueries({ queryKey: [...LIST_KEY, variables.bankId] });
    },
  });
};

const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bankId, questionId }: { bankId: string; questionId: string }) => {
      const mutationPromise = deleteQuestion(bankId, questionId);
      toast.promise(mutationPromise, {
        loading: "Удаляем вопрос...",
        success: "Вопрос удалён",
      });
      return mutationPromise;
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error?.message || "Не удалось удалить вопрос"}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
      queryClient.invalidateQueries({ queryKey: [...LIST_KEY, variables.bankId] });
    },
  });
};
