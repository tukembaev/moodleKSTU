import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { PickQuestionsDialog } from "entities/QuestionBank";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { getTestMinPoints, isFilledTestQuestion, TestDetails } from "entities/Test/model/types/test";
import TestResults from "entities/Test/ui/TestResults";
import { AlertCircle, BarChart3, ChevronLeft, ChevronRight, Lock, LockOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LuLibrary } from "react-icons/lu";
import { UseConfirmationDialog, UseTooltip } from "shared/components";
import {
  emptyOptionDraft,
  emptyQuestionDraft,
  isQuestionDraftStarted,
  QuestionEditorCard,
  resolveQuestionType,
  toApiQuestionPayload,
  validateQuestionDraft,
  type QuestionDraft,
} from "shared/components/QuestionEditor";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import { Input } from "shared/shadcn/ui/input";
import { FieldLabel } from "shared/components/FieldLabel";
import { onFormInvalid, requiredField, toastRequiredField } from "shared/lib/onFormInvalid";
import { Label } from "shared/shadcn/ui/label";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { Separator } from "shared/shadcn/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";

type QuestionForm = QuestionDraft;

interface QuizFormData {
  title: string;
  description: string;
  opening_date: Date;
  required: boolean;
  timeLimit: number;
  maxPoints: number;
  minPoints: number;
  questionsPerAttempt: number;
  showCorrectAnswers: boolean;
  questions: QuestionForm[];
}

const emptyQuestion = (): QuestionForm => emptyQuestionDraft();

const toFormQuestion = (question: QuestionDraft): QuestionForm => ({
  ...emptyQuestionDraft(resolveQuestionType(question)),
  question: question.question,
  questionImage: question.questionImage ?? null,
  questionImagePreview: question.questionImagePreview,
  options: question.options.map((option) => ({
    text: option.text,
    image: option.image ?? null,
    imagePreview: option.imagePreview,
  })),
  correctAnswer: question.correctAnswer,
  multipleAnswers: resolveQuestionType(question) === "multiple_choice",
  questionType: resolveQuestionType(question),
});

const mapDetailsToForm = (data: TestDetails): QuizFormData => withAttemptSize({
  title: data.title,
  description: data.description || "",
  opening_date: data.opening_date ? new Date(data.opening_date) : new Date(),
  required: data.required,
  timeLimit: data.timeLimit,
  maxPoints: data.maxPoints,
  minPoints: getTestMinPoints(data),
  showCorrectAnswers: data.showCorrectAnswers,
  questionsPerAttempt: data.questionsPerAttempt ?? 0,
  questions: (() => {
    const mapped = data.questions.filter(isFilledTestQuestion).map((question) => {
      const type = resolveQuestionType(question);
      const correctTexts = question.options
        .filter((option) => option.is_correct)
        .map((option) => option.text);
      let correctAnswer: QuestionDraft["correctAnswer"] = question.correctAnswer ?? "";
      if (type === "true_false") {
        if (typeof question.correctAnswer === "boolean") {
          correctAnswer = question.correctAnswer;
        } else {
          const correctOption = question.options.find((option) => option.is_correct);
          const text = (correctOption?.text || "").trim().toLowerCase();
          correctAnswer = ["верно", "true", "1", "yes", "да"].includes(text);
        }
      } else if (type === "essay") {
        correctAnswer = null;
      } else if (type === "short_answer") {
        correctAnswer =
          typeof question.correctAnswer === "string" ? question.correctAnswer : "";
      } else if (correctAnswer === undefined || correctAnswer === "") {
        correctAnswer = type === "multiple_choice" ? correctTexts : correctTexts[0] || "";
      }
      return {
        id: question.id,
        question: question.question,
        questionImage: null,
        questionImagePreview: question.questionImage || undefined,
        multipleAnswers: type === "multiple_choice",
        questionType: type,
        correctAnswer,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          image: null,
          imagePreview: option.image || undefined,
        })),
      };
    });
    return mapped.length ? mapped : [emptyQuestion()];
  })(),
});

const withAttemptSize = (form: QuizFormData): QuizFormData => ({
  ...form,
  questionsPerAttempt:
    form.questionsPerAttempt > 0
      ? form.questionsPerAttempt
      : form.questions.filter(isQuestionDraftStarted).length || 1,
});

const isOwnerEditorPayload = (data?: TestDetails) =>
  Boolean(
    data &&
      (data.questions.length === 0 ||
        data.questions.some(
          (question) =>
            question.correctAnswer !== undefined ||
            question.options?.some((option) => typeof option.is_correct === "boolean")
        ))
  );

interface TestEditorPanelProps {
  testId: string;
  courseId?: string;
  onDeleted?: () => void;
}

export const TestEditorPanel: FC<TestEditorPanelProps> = ({
  testId,
  courseId,
  onDeleted,
}) => {
  const { t } = useTranslation();
  const [panelTab, setPanelTab] = useState<"edit" | "results">("edit");
  const { data: courseTests } = useQuery(courseQueries.courseTests(courseId ?? null));
  const {
    data: testDetails,
    isLoading,
    isError,
  } = useQuery(testQueries.TestQuestions(testId));
  const { mutate: setAvailability, isPending: isAvailabilityPending } =
    testQueries.set_availability();
  const { mutate: updateTest, isPending: isUpdatingJson } =
    testQueries.update_test();
  const { mutate: updateTestForm, isPending: isUpdatingForm } =
    testQueries.update_test_with_formdata();
  const { mutate: deleteTest, isPending: isDeleting } = testQueries.delete_test();

  const isOpen = courseTests?.find((test) => test.id === testId)?.is_open ?? false;
  const canEdit = isOwnerEditorPayload(testDetails);
  const isSaving = isUpdatingJson || isUpdatingForm;
  const isCourseContext = Boolean(courseId);
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuizFormData>({
    defaultValues: {
      title: "",
      description: "",
      opening_date: new Date(),
      required: false,
      timeLimit: 60,
      maxPoints: 100,
      minPoints: 0,
      questionsPerAttempt: 1,
      showCorrectAnswers: false,
      questions: [emptyQuestion()],
    },
  });

  const {
    fields: questionFields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");
  const totalQuestions = questionFields.length;
  const activeField = questionFields[activeIndex];
  const canRemoveQuestion = totalQuestions > 1;

  useEffect(() => {
    setPanelTab("edit");
    setActiveIndex(0);
  }, [testId]);

  useEffect(() => {
    setActiveIndex((prev) => {
      if (totalQuestions === 0) return 0;
      return Math.max(0, Math.min(prev, totalQuestions - 1));
    });
  }, [totalQuestions]);

  const handleAppendQuestion = () => {
    append(emptyQuestion());
    setActiveIndex(totalQuestions);
  };

  const handleRemoveActive = () => {
    if (!canRemoveQuestion) return;
    remove(activeIndex);
    setActiveIndex((prev) => Math.max(0, Math.min(prev, totalQuestions - 2)));
  };

  const goPrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
  const goNext = () =>
    setActiveIndex((prev) => Math.min(totalQuestions - 1, prev + 1));

  const handleInsertFromBank = (questions: QuestionDraft[]) => {
    if (!questions.length) return;
    const current = watchedQuestions ?? [];
    const start = isQuestionDraftStarted(current[activeIndex])
      ? activeIndex + 1
      : activeIndex;
    const before = current.slice(0, start);
    const after = current.slice(start).filter(isQuestionDraftStarted);
    const next = [
      ...before,
      ...questions.map(toFormQuestion),
      ...after,
      emptyQuestionDraft(),
    ];
    replace(next);
    setActiveIndex(before.length + questions.length);
  };

  const validateFilledQuestion = (question?: QuestionForm) =>
    validateQuestionDraft(question);

  const validateQuestionField = (question?: QuestionForm) => {
    if (!isQuestionDraftStarted(question)) return true;
    return validateFilledQuestion(question);
  };

  useEffect(() => {
    if (testDetails && canEdit) {
      reset(mapDetailsToForm(testDetails));
    }
  }, [testDetails, canEdit, reset]);

  const handleDelete = () => {
    deleteTest(testId, {
      onSuccess: () => onDeleted?.(),
    });
  };

  const handleAvailability = (nextOpen: boolean) => {
    if (!courseId) return;
    setAvailability({
      test_id: testId,
      course_id: courseId,
      is_open: nextOpen,
    });
  };

  const onSubmit = (formData: QuizFormData) => {
    const filledQuestions = formData.questions.filter(isQuestionDraftStarted);

    if (filledQuestions.length === 0) {
      toastRequiredField(t("Добавьте хотя бы один вопрос"));
      setActiveIndex(0);
      return;
    }

    if (
      !formData.questionsPerAttempt ||
      formData.questionsPerAttempt > filledQuestions.length
    ) {
      toastRequiredField(
        t("Не больше числа вопросов в тесте ({{count}})", {
          count: filledQuestions.length,
        })
      );
      return;
    }

    for (let index = 0; index < formData.questions.length; index++) {
      const question = formData.questions[index];
      if (!isQuestionDraftStarted(question)) continue;
      const result = validateFilledQuestion(question);
      if (result !== true) {
        setActiveIndex(index);
        toastRequiredField(result);
        return;
      }
    }

    const payload = {
      title: formData.title,
      description: formData.description || "",
      opening_date: formData.opening_date.toISOString(),
      required: formData.required || false,
      timeLimit: Number(formData.timeLimit),
      maxPoints: Number(formData.maxPoints) || 0,
      minPoints: Number(formData.minPoints) || 0,
      questionsPerAttempt: Number(formData.questionsPerAttempt),
      showCorrectAnswers: formData.showCorrectAnswers || false,
      questions: filledQuestions.map((question) => toApiQuestionPayload(question)),
    };

    const hasNewFiles = filledQuestions.some(
      (question) =>
        question.questionImage instanceof File ||
        ((resolveQuestionType(question) === "single_choice" ||
          resolveQuestionType(question) === "multiple_choice") &&
          question.options.some((option) => option.image instanceof File))
    );

    if (hasNewFiles) {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(payload));
      filledQuestions.forEach((question, qIndex) => {
        if (question.questionImage instanceof File) {
          formDataToSend.append(
            `questions[${qIndex}][questionImage]`,
            question.questionImage
          );
        }
        question.options.forEach((option, oIndex) => {
          if (
            option.image instanceof File &&
            (resolveQuestionType(question) === "single_choice" ||
              resolveQuestionType(question) === "multiple_choice")
          ) {
            formDataToSend.append(
              `questions[${qIndex}][options][${oIndex}][image]`,
              option.image
            );
          }
        });
      });
      updateTestForm({ id: testId, formData: formDataToSend });
      return;
    }

    updateTest({ id: testId, data: payload });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">{t("Загрузка теста...")}</p>
      </div>
    );
  }

  if (isError || !testDetails) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border">
        <Empty>
          <EmptyContent>
            <EmptyMedia variant="icon">
              <AlertCircle size={24} />
            </EmptyMedia>
            <EmptyTitle>{t("Не удалось открыть тест")}</EmptyTitle>
            <EmptyDescription>
              {t("Проверьте права доступа или обновите страницу.")}
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden lg:rounded-lg lg:border">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-3 lg:px-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-semibold">
              {testDetails.title}
            </h2>
            {isCourseContext && (
              <Badge variant={isOpen ? "default" : "outline"}>
                {isOpen ? t("Открыт") : t("Закрыт")}
              </Badge>
            )}
          </div>
          {isCourseContext && (
            <p className="text-xs text-muted-foreground">
              {isOpen
                ? t("Студенты видят тест и могут его сдавать")
                : t("Студенты не видят этот тест и не могут сдавать")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isCourseContext && (
            <>
              <Button
                type="button"
                size="sm"
                onClick={() => handleAvailability(true)}
                disabled={isOpen || isAvailabilityPending}
              >
                <LockOpen className="h-4 w-4" />
                {t("Открыть тест")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAvailability(false)}
                disabled={!isOpen || isAvailabilityPending}
              >
                <Lock className="h-4 w-4" />
                {t("Закрыть тест")}
              </Button>
            </>
          )}
          {canEdit && (
            <Button
              type="submit"
              form="test-editor-form"
              size="sm"
              disabled={isSaving}
            >
              {isSaving ? t("Сохранение...") : t("Сохранить")}
            </Button>
          )}
          {canEdit && (
            <UseConfirmationDialog
              title={t("Удалить тест?")}
              description={t("Тест, вопросы, прикрепления и все результаты студентов будут удалены без возможности восстановления.")}
              onConfirm={handleDelete}
              trigger={
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  {t("Удалить")}
                </Button>
              }
            />
          )}
        </div>
      </div>

      {isCourseContext && (
        <div className="shrink-0 border-b px-4 py-2">
          <Tabs
            value={panelTab}
            onValueChange={(value) => setPanelTab(value as "edit" | "results")}
          >
            <TabsList className="h-9">
              <TabsTrigger value="edit" className="gap-1.5">
                <Pencil className="h-4 w-4" />
                {t("Редактирование")}
              </TabsTrigger>
              <TabsTrigger value="results" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                {t("Результаты")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {panelTab === "results" && isCourseContext && courseId ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <TestResults testId={testId} courseId={courseId} compact />
        </div>
      ) : !canEdit ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty>
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Lock size={24} />
              </EmptyMedia>
              <EmptyTitle>{t("Редактирование недоступно")}</EmptyTitle>
              <EmptyDescription>
                {t("Вопросы может менять только автор теста. Вы можете открывать и закрывать его для студентов этого курса.")}
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <form
          id="test-editor-form"
          onSubmit={handleSubmit(onSubmit, onFormInvalid)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <ScrollArea className="min-h-0 flex-1 overflow-hidden">
            <div className="space-y-5 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel className="pb-2" required>
                    {t("Название теста")}
                  </FieldLabel>
                  <Input
                    {...register("title", requiredField(t("Заполните название теста")))}
                    placeholder={t("Название теста")} />
                  {errors.title && (
                    <p className="mt-1 text-xs text-destructive">{t("Обязательно")}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <FieldLabel className="pb-2">{t("Описание")}</FieldLabel>
                  <Input
                    {...register("description")}
                    placeholder={t("Краткое описание")} />
                </div>
                <div>
                  <FieldLabel className="pb-2" required>
                    {t("Время (минуты)")}
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("timeLimit", {
                      ...requiredField(t("Укажите время теста")),
                      min: { value: 1, message: t("Минимум 1 минута") },
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <FieldLabel className="pb-2" required>
                    {t("Максимум баллов")}
                  </FieldLabel>
                  <Input
                    type="number"
                    step={1}
                    {...register("maxPoints", {
                      ...requiredField(t("Укажите максимальный балл")),
                      min: { value: 0, message: t("Минимум 0 баллов") },
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <FieldLabel className="pb-2" required>
                    {t("Минимальный балл")}
                  </FieldLabel>
                  <Input
                    type="number"
                    step={1}
                    {...register("minPoints", {
                      required: t("Укажите минимальный балл"),
                      min: { value: 0, message: t("От 0 до максимума") },
                      valueAsNumber: true,
                      validate: (value) => {
                        if (!Number.isFinite(value)) {
                          return t("Укажите минимальный балл");
                        }
                        return (
                          value <= (watch("maxPoints") || 0) ||
                          t("Не больше максимального балла")
                        );
                      },
                    })}
                  />
                  {errors.minPoints && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.minPoints.message || t("Целое число от 0 до максимума")}
                    </p>
                  )}
                </div>
                <div>
                  <FieldLabel className="pb-2" required>
                    {t("Вопросов студенту")}
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    {...register("questionsPerAttempt", {
                      ...requiredField(t("Укажите, сколько вопросов получит студент")),
                      min: { value: 1, message: t("Минимум 1 вопрос") },
                      valueAsNumber: true,
                    })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("Случайно из пула. Сейчас вопросов: {{count}}", {
                      count: (watchedQuestions ?? []).filter(isQuestionDraftStarted).length,
                    })}
                  </p>
                  {errors.questionsPerAttempt && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.questionsPerAttempt.message || t("Минимум 1 вопрос")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="showCorrectAnswers"
                    checked={watch("showCorrectAnswers")}
                    onCheckedChange={(checked) =>
                      setValue("showCorrectAnswers", !!checked)
                    }
                  />
                  <Label htmlFor="showCorrectAnswers" className="cursor-pointer font-normal">
                    {t("Показывать правильные ответы после сдачи")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="required"
                    checked={watch("required")}
                    onCheckedChange={(checked) => setValue("required", !!checked)}
                  />
                  <Label htmlFor="required" className="cursor-pointer font-normal">
                    {t("Обязательный тест")}
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-baseline gap-2 text-lg font-medium">
                      {t("Вопросы")}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </p>
                  </div>
                  <UseTooltip text={t("Вставить готовые вопросы из коллекции")}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBankPickerOpen(true)}
                    >
                      <LuLibrary />
                      {t("Из коллекции вопросов")}
                    </Button>
                  </UseTooltip>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {questionFields.map((field, stepIndex) => (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => setActiveIndex(stepIndex)}
                      aria-current={stepIndex === activeIndex ? "step" : undefined}
                      aria-label={t("Перейти к вопросу {{n}}", { n: stepIndex + 1 })}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                        stepIndex === activeIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      {stepIndex + 1}
                    </button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={handleAppendQuestion}
                    aria-label={t("Добавить вопрос")}
                    className="rounded-full"
                  >
                    <Plus />
                  </Button>
                </div>

                {activeField && (
                  <Controller
                    key={activeField.id}
                    name={`questions.${activeIndex}`}
                    control={control}
                    rules={{ validate: validateQuestionField }}
                    render={({ field: questionField, fieldState }) => (
                      <QuestionEditorCard
                        value={questionField.value || emptyQuestion()}
                        onChange={questionField.onChange}
                        index={activeIndex}
                        error={
                          typeof fieldState.error?.message === "string"
                            ? fieldState.error.message
                            : undefined
                        }
                        canRemove={canRemoveQuestion}
                        onRemove={handleRemoveActive}
                        onAddOption={() => {
                          const current =
                            questionField.value || emptyQuestion();
                          questionField.onChange({
                            ...current,
                            options: [...current.options, emptyOptionDraft()],
                          });
                        }}
                      />
                    )}
                  />
                )}

                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goPrev}
                    disabled={activeIndex <= 0}
                  >
                    <ChevronLeft />
                    {t("Назад")}
                  </Button>
                  {activeIndex >= totalQuestions - 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppendQuestion}
                    >
                      <Plus />
                      {t("Добавить вопрос")}
                    </Button>
                  ) : (
                    <Button type="button" onClick={goNext}>
                      {t("Далее")}
                      <ChevronRight />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </form>
      )}
      <PickQuestionsDialog
        open={bankPickerOpen}
        onOpenChange={setBankPickerOpen}
        onInsert={handleInsertFromBank}
      />
    </div>
  );
};

