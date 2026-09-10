import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { PickQuestionsDialog } from "entities/QuestionBank";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { TestDetails } from "entities/Test/model/types/test";
import TestResults from "entities/Test/ui/TestResults";
import { AlertCircle, BarChart3, ChevronLeft, ChevronRight, Lock, LockOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LuLibrary } from "react-icons/lu";
import { UseConfirmationDialog, UseTooltip } from "shared/components";
import {
  emptyOptionDraft,
  emptyQuestionDraft,
  QuestionEditorCard,
  type QuestionDraft,
} from "shared/components/QuestionEditor";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import { Input } from "shared/shadcn/ui/input";
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
  showCorrectAnswers: boolean;
  questions: QuestionForm[];
}

const emptyQuestion = (): QuestionForm => emptyQuestionDraft();

const isQuestionStarted = (question?: QuestionForm) => {
  if (!question) return false;
  if (question.question.trim()) return true;
  if (question.questionImage || question.questionImagePreview) return true;
  const hasCorrect = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.length > 0
    : Boolean(question.correctAnswer);
  if (hasCorrect) return true;
  return question.options.some(
    (option) => option.text.trim() || option.image || option.imagePreview
  );
};

const toFormQuestion = (question: QuestionDraft): QuestionForm => ({
  ...emptyQuestionDraft(),
  question: question.question,
  questionImage: question.questionImage ?? null,
  questionImagePreview: question.questionImagePreview,
  options: question.options.map((option) => ({
    text: option.text,
    image: option.image ?? null,
    imagePreview: option.imagePreview,
  })),
  correctAnswer: question.correctAnswer,
  multipleAnswers: question.multipleAnswers,
});

const mapDetailsToForm = (data: TestDetails): QuizFormData => ({
  title: data.title,
  description: data.description || "",
  opening_date: data.opening_date ? new Date(data.opening_date) : new Date(),
  required: data.required,
  timeLimit: data.timeLimit,
  maxPoints: data.maxPoints,
  minPoints: data.minPoints ?? 0,
  showCorrectAnswers: data.showCorrectAnswers,
  questions: data.questions.map((question) => {
    const correctTexts = question.options
      .filter((option) => option.is_correct)
      .map((option) => option.text);
    return {
      id: question.id,
      question: question.question,
      questionImage: null,
      questionImagePreview: question.questionImage || undefined,
      multipleAnswers: question.multipleAnswers,
      correctAnswer: question.multipleAnswers ? correctTexts : correctTexts[0] || "",
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        image: null,
        imagePreview: option.image || undefined,
      })),
    };
  }),
});

const isOwnerEditorPayload = (data?: TestDetails) =>
  Boolean(
    data &&
      (data.questions.length === 0 ||
        data.questions.some((question) =>
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
  const isBankDisabled = isQuestionStarted(watchedQuestions?.[activeIndex]);

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
    const start = isQuestionStarted(current[activeIndex])
      ? activeIndex + 1
      : activeIndex;
    const before = current.slice(0, start);
    const after = current.slice(start).filter(isQuestionStarted);
    const next = [
      ...before,
      ...questions.map(toFormQuestion),
      ...after,
      emptyQuestionDraft(),
    ];
    replace(next);
    setActiveIndex(before.length + questions.length);
  };

  const validateQuestion = (question?: QuestionForm) => {
    if (!question?.question?.trim()) return "Введите текст вопроса";
    if (question.options.some((option) => !option.text.trim())) {
      return "Заполните все варианты ответов";
    }
    if (question.multipleAnswers) {
      if (
        !Array.isArray(question.correctAnswer) ||
        question.correctAnswer.length === 0
      ) {
        return "Выберите правильный ответ";
      }
    } else if (!question.correctAnswer) {
      return "Выберите правильный ответ";
    }
    return true;
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
    const payload = {
      title: formData.title,
      description: formData.description || "",
      opening_date: formData.opening_date.toISOString(),
      required: formData.required || false,
      timeLimit: Number(formData.timeLimit),
      maxPoints: Number(formData.maxPoints) || 0,
      minPoints: Number(formData.minPoints) || 0,
      showCorrectAnswers: formData.showCorrectAnswers || false,
      questions: formData.questions.map((question) => {
        const correctAnswers = Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : question.correctAnswer
            ? [question.correctAnswer]
            : [];
        return {
          ...(question.id ? { id: question.id } : {}),
          question: question.question,
          multipleAnswers: question.multipleAnswers || false,
          options: question.options
            .filter((option) => option.text.trim() !== "")
            .map((option) => ({
              ...(option.id ? { id: option.id } : {}),
              text: option.text,
              is_correct: correctAnswers.includes(option.text),
            })),
        };
      }),
    };

    const hasNewFiles = formData.questions.some(
      (question) =>
        question.questionImage instanceof File ||
        question.options.some((option) => option.image instanceof File)
    );

    if (hasNewFiles) {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(payload));
      formData.questions.forEach((question, qIndex) => {
        if (question.questionImage instanceof File) {
          formDataToSend.append(
            `questions[${qIndex}][questionImage]`,
            question.questionImage
          );
        }
        question.options.forEach((option, oIndex) => {
          if (option.image instanceof File) {
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
        <p className="text-sm text-muted-foreground">Загрузка теста...</p>
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
            <EmptyTitle>Не удалось открыть тест</EmptyTitle>
            <EmptyDescription>
              Проверьте права доступа или обновите страницу.
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-semibold">
              {testDetails.title}
            </h2>
            {isCourseContext && (
              <Badge variant={isOpen ? "default" : "outline"}>
                {isOpen ? "Открыт" : "Закрыт"}
              </Badge>
            )}
          </div>
          {isCourseContext && (
            <p className="text-xs text-muted-foreground">
              {isOpen
                ? "Студенты видят тест и могут его сдавать"
                : "Студенты не видят этот тест и не могут сдавать"}
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
                Открыть тест
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAvailability(false)}
                disabled={!isOpen || isAvailabilityPending}
              >
                <Lock className="h-4 w-4" />
                Закрыть тест
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
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          )}
          {canEdit && (
            <UseConfirmationDialog
              title="Удалить тест?"
              description="Тест, вопросы, прикрепления и все результаты студентов будут удалены без возможности восстановления."
              onConfirm={handleDelete}
              trigger={
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
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
                Редактирование
              </TabsTrigger>
              <TabsTrigger value="results" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Результаты
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
              <EmptyTitle>Редактирование недоступно</EmptyTitle>
              <EmptyDescription>
                Вопросы может менять только автор теста. Вы можете открывать и
                закрывать его для студентов этого курса.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <form
          id="test-editor-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <ScrollArea className="min-h-0 flex-1 overflow-hidden">
            <div className="space-y-5 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label className="pb-2">Название теста</Label>
                  <Input
                    {...register("title", { required: true })}
                    placeholder="Название теста"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-destructive">Обязательно</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label className="pb-2">Описание</Label>
                  <Input
                    {...register("description")}
                    placeholder="Краткое описание"
                  />
                </div>
                <div>
                  <Label className="pb-2">Время (минуты)</Label>
                  <Input
                    type="number"
                    {...register("timeLimit", {
                      required: true,
                      min: 1,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <Label className="pb-2">Максимум баллов</Label>
                  <Input
                    type="number"
                    step={1}
                    {...register("maxPoints", {
                      required: true,
                      min: 0,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <Label className="pb-2">Минимальный балл</Label>
                  <Input
                    type="number"
                    step={1}
                    {...register("minPoints", {
                      required: true,
                      min: 0,
                      valueAsNumber: true,
                      validate: (value) =>
                        value <= (watch("maxPoints") || 0) ||
                        "Не больше максимального балла",
                    })}
                  />
                  {errors.minPoints && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.minPoints.message || "Целое число от 0 до максимума"}
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
                    Показывать правильные ответы после сдачи
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="required"
                    checked={watch("required")}
                    onCheckedChange={(checked) => setValue("required", !!checked)}
                  />
                  <Label htmlFor="required" className="cursor-pointer font-normal">
                    Обязательный тест
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-medium">Вопросы</p>
                  </div>
                  <UseTooltip
                    text={
                      isBankDisabled
                        ? "Недоступно, пока вы заполняете этот вопрос"
                        : "Вставить готовые вопросы из коллекции"
                    }
                  >
                    <span className={cn(isBankDisabled && "cursor-not-allowed")}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isBankDisabled}
                        onClick={() => setBankPickerOpen(true)}
                      >
                        <LuLibrary />
                        Из коллекции вопросов
                      </Button>
                    </span>
                  </UseTooltip>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {questionFields.map((field, stepIndex) => (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => setActiveIndex(stepIndex)}
                      aria-current={stepIndex === activeIndex ? "step" : undefined}
                      aria-label={`Перейти к вопросу ${stepIndex + 1}`}
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
                    aria-label="Добавить вопрос"
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
                    rules={{ validate: validateQuestion }}
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
                    Назад
                  </Button>
                  {activeIndex >= totalQuestions - 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppendQuestion}
                    >
                      <Plus />
                      Добавить вопрос
                    </Button>
                  ) : (
                    <Button type="button" onClick={goNext}>
                      Далее
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

