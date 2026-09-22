import { useQuery } from "@tanstack/react-query";
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

const mapDetailsToForm = (data: TestDetails): QuizFormData => ({
  title: data.title,
  description: data.description || "",
  opening_date: data.opening_date ? new Date(data.opening_date) : new Date(),
  required: data.required,
  timeLimit: data.timeLimit,
  maxPoints: data.maxPoints,
  minPoints: getTestMinPoints(data),
  showCorrectAnswers: data.showCorrectAnswers,
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
      toastRequiredField("Добавьте хотя бы один вопрос");
      setActiveIndex(0);
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden lg:rounded-lg lg:border">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-3 lg:px-4">
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
          onSubmit={handleSubmit(onSubmit, onFormInvalid)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <ScrollArea className="min-h-0 flex-1 overflow-hidden">
            <div className="space-y-5 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel className="pb-2" required>
                    Название теста
                  </FieldLabel>
                  <Input
                    {...register("title", requiredField("Заполните название теста"))}
                    placeholder="Название теста"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-destructive">Обязательно</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <FieldLabel className="pb-2">Описание</FieldLabel>
                  <Input
                    {...register("description")}
                    placeholder="Краткое описание"
                  />
                </div>
                <div>
                  <FieldLabel className="pb-2" required>
                    Время (минуты)
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("timeLimit", {
                      ...requiredField("Укажите время теста"),
                      min: { value: 1, message: "Минимум 1 минута" },
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <FieldLabel className="pb-2" required>
                    Максимум баллов
                  </FieldLabel>
                  <Input
                    type="number"
                    step={1}
                    {...register("maxPoints", {
                      ...requiredField("Укажите максимальный балл"),
                      min: { value: 0, message: "Минимум 0 баллов" },
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <FieldLabel className="pb-2" required>
                    Минимальный балл
                  </FieldLabel>
                  <Input
                    type="number"
                    step={1}
                    {...register("minPoints", {
                      required: "Укажите минимальный балл",
                      min: { value: 0, message: "От 0 до максимума" },
                      valueAsNumber: true,
                      validate: (value) => {
                        if (!Number.isFinite(value)) {
                          return "Укажите минимальный балл";
                        }
                        return (
                          value <= (watch("maxPoints") || 0) ||
                          "Не больше максимального балла"
                        );
                      },
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
                    <p className="flex items-baseline gap-2 text-lg font-medium">
                      Вопросы
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </p>
                  </div>
                  <UseTooltip text="Вставить готовые вопросы из коллекции">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBankPickerOpen(true)}
                    >
                      <LuLibrary />
                      Из коллекции вопросов
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

