import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  emptyQuestionDraft,
  QUESTION_TYPE_LABELS,
  QuestionEditorCard,
  resolveQuestionType,
  validateQuestionDraft,
  type QuestionDraft,
} from "shared/components/QuestionEditor";
import { UseConfirmationDialog } from "shared/components";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routePath";
import { cn } from "shared/lib/utils";
import { toastRequiredField } from "shared/lib/onFormInvalid";
import { useBankId } from "shared/lib/navigation/hidden-ids";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { bankQuestionToDraft } from "../model/services/questionBankAPI";
import { questionBankQueries } from "../model/services/questionBankQueryFactory";
import type { BankQuestion } from "../model/types/questionBank";

const isDraftValid = (draft: QuestionDraft) => {
  const result = validateQuestionDraft(draft);
  return result === true ? null : result;
};

const correctSet = (question: BankQuestion) => {
  const answers = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : typeof question.correctAnswer === "string" && question.correctAnswer
      ? [question.correctAnswer]
      : [];
  return new Set(answers);
};

const trueFalseLabel = (value: BankQuestion["correctAnswer"]) =>
  value === true || value === "Верно" ? "Верно" : "Неверно";

const BankDetails = () => {
  const navigate = useNavigate();
  const bankId = useBankId();
  const { data: bank, isLoading, error } = useQuery(
    questionBankQueries.bank(bankId || null)
  );
  const { mutate: addQuestion, isPending: isAdding } =
    questionBankQueries.add_question();
  const { mutate: updateQuestion, isPending: isUpdating } =
    questionBankQueries.update_question();
  const { mutate: removeQuestion, isPending: isDeleting } =
    questionBankQueries.delete_question();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuestionDraft>(emptyQuestionDraft());
  const [draftError, setDraftError] = useState<string>();

  const isSaving = isAdding || isUpdating;

  const startCreate = () => {
    setEditingId(null);
    setDraft(emptyQuestionDraft());
    setDraftError(undefined);
    setEditorOpen(true);
  };

  const startEdit = (question: BankQuestion) => {
    setEditingId(question.id);
    setDraft(bankQuestionToDraft(question));
    setDraftError(undefined);
    setEditorOpen(true);
  };

  const cancelEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setDraft(emptyQuestionDraft());
    setDraftError(undefined);
  };

  const saveQuestion = () => {
    const message = isDraftValid(draft);
    if (message) {
      setDraftError(message);
      toastRequiredField(message);
      return;
    }
    if (!bankId) return;
    if (editingId) {
      updateQuestion(
        { bankId, questionId: editingId, question: draft },
        { onSuccess: cancelEditor }
      );
      return;
    }
    addQuestion({ bankId, question: draft }, { onSuccess: cancelEditor });
  };

  const title = useMemo(() => bank?.name || "Коллекция вопросов", [bank?.name]);

  if (!bankId) {
    return (
      <p className="text-muted-foreground">Коллекция вопросов не выбран.</p>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Загрузка коллекции...</p>;
  }

  if (error || !bank) {
    return (
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(RoutePath[AppRoutes.QUESTION_BANK])}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          К списку Коллекцияов
        </Button>
        <p className="text-muted-foreground">Коллекция вопросов не найден.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
     
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          {bank.description && (
            <p className="mt-1 text-muted-foreground">{bank.description}</p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {bank.questions.length} {bank.questions.length === 1 ? "вопрос" : "вопросов"} в коллекции
          </p>
        </div>
        <Button type="button" onClick={startCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить вопрос
        </Button>
      </div>

      {editorOpen && (
        <div className="space-y-3">
          <QuestionEditorCard
            value={draft}
            onChange={(next) => {
              setDraft(next);
              setDraftError(undefined);
            }}
            index={0}
            error={draftError}
          />
          <div className="flex gap-2">
            <Button type="button" onClick={saveQuestion} disabled={isSaving}>
              {isSaving ? "Сохранение..." : "Сохранить вопрос"}
            </Button>
            <Button type="button" variant="outline" onClick={cancelEditor}>
              Отмена
            </Button>
          </div>
        </div>
      )}

      <div>
        {bank.questions.length === 0 && !editorOpen ? (
          <p className="text-muted-foreground">
            В этом Коллекции пока нет вопросов. Добавьте первый.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {bank.questions.map((question, index) => {
              const type = resolveQuestionType(question);
              const answers = correctSet(question);
              return (
                <div
                  key={question.id}
                  className="flex h-full flex-col gap-3 rounded-xl border p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-pretty text-base leading-snug font-medium">
                        {question.question}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary" className="font-normal">
                          {QUESTION_TYPE_LABELS[type]}
                        </Badge>
                        {(type === "single_choice" || type === "multiple_choice") && (
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {question.options.length} вариантов
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Редактировать вопрос"
                        onClick={() => startEdit(question)}
                      >
                        <Pencil />
                      </Button>
                      <UseConfirmationDialog
                        title="Удалить вопрос?"
                        description="Вопрос будет удалён из коллекции без возможности восстановления."
                        onConfirm={() =>
                          removeQuestion({
                            bankId: bank.id,
                            questionId: question.id,
                          })
                        }
                        trigger={
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Удалить вопрос"
                            disabled={isDeleting}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        }
                      />
                    </div>
                  </div>

                  {question.questionImagePreview && (
                    <img
                      src={question.questionImagePreview}
                      alt=""
                      className="max-h-32 w-fit rounded-lg border object-contain"
                    />
                  )}

                  {type === "true_false" && (
                    <p className="text-sm">
                      Правильный ответ:{" "}
                      <span className="font-medium">{trueFalseLabel(question.correctAnswer)}</span>
                    </p>
                  )}

                  {type === "short_answer" && (
                    <p className="text-sm">
                      Эталон:{" "}
                      <span className="font-medium">
                        {typeof question.correctAnswer === "string"
                          ? question.correctAnswer
                          : "—"}
                      </span>
                    </p>
                  )}

                  {type === "essay" && (
                    <p className="text-sm text-muted-foreground">
                      Требует ручной проверки преподавателем
                    </p>
                  )}

                  {(type === "single_choice" || type === "multiple_choice") && (
                  <ul
                    className={cn(
                      "mt-auto grid min-w-0 auto-rows-fr gap-2",
                      question.options.length > 1 ? "grid-cols-2" : "grid-cols-1"
                    )}
                  >
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = answers.has(option.text);
                      const letter = String.fromCharCode(65 + optionIndex);
                      return (
                        <li
                          key={option.id || option.text}
                          data-checked={isCorrect}
                          className={cn(
                            "relative flex min-h-11 min-w-0 items-start gap-2.5 rounded-lg border border-input bg-transparent px-3 py-2.5 text-start text-sm",
                            isCorrect &&
                              "border-primary/40 bg-muted dark:bg-muted"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "relative mt-0.5 flex size-5 shrink-0 items-center justify-center border text-[10px] font-medium",
                              type === "multiple_choice"
                                ? "rounded-[4px]"
                                : "rounded-full",
                              isCorrect
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input text-muted-foreground"
                            )}
                          >
                            {isCorrect ? (
                              type === "multiple_choice" ? (
                                <Check className="size-3.5" />
                              ) : (
                                <span className="size-2 rounded-full bg-primary-foreground" />
                              )
                            ) : (
                              letter
                            )}
                          </span>
                          <div className="flex min-w-0 flex-1 flex-col gap-1 leading-snug">
                            <span className="break-words font-medium">
                              {option.text}
                            </span>
                            {option.imagePreview && (
                              <img
                                src={option.imagePreview}
                                alt=""
                                className="mt-1 max-h-24 w-full rounded-md border object-contain"
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankDetails;
