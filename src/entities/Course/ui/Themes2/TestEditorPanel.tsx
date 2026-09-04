import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { TestDetails } from "entities/Test/model/types/test";
import TestResults from "entities/Test/ui/TestResults";
import { AlertCircle, BarChart3, Lock, LockOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuImage, LuX } from "react-icons/lu";
import { UseConfirmationDialog } from "shared/components";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";

interface OptionForm {
  id?: string;
  text: string;
  image?: File | null;
  imagePreview?: string;
}

interface QuestionForm {
  id?: string;
  question: string;
  questionImage?: File | null;
  questionImagePreview?: string;
  options: OptionForm[];
  correctAnswer: string | string[];
  multipleAnswers: boolean;
}

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

const emptyQuestion = (): QuestionForm => ({
  question: "",
  questionImage: null,
  questionImagePreview: undefined,
  options: [
    { text: "", image: null, imagePreview: undefined },
    { text: "", image: null, imagePreview: undefined },
  ],
  correctAnswer: "",
  multipleAnswers: false,
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

  const { fields: questionFields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchQuestions = watch("questions");

  useEffect(() => {
    setPanelTab("edit");
  }, [testId]);

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

  const handleQuestionImageChange = (
    qIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue(`questions.${qIndex}.questionImage`, file);
    setValue(`questions.${qIndex}.questionImagePreview`, URL.createObjectURL(file));
  };

  const handleOptionImageChange = (
    qIndex: number,
    oIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const currentOptions = watchQuestions[qIndex]?.options || [];
    const updatedOptions = [...currentOptions];
    updatedOptions[oIndex] = {
      ...updatedOptions[oIndex],
      image: file,
      imagePreview: URL.createObjectURL(file),
    };
    setValue(`questions.${qIndex}.options`, updatedOptions);
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

              {questionFields.map((field, qIndex) => {
                const question = watchQuestions[qIndex];
                const options = question?.options || [];
                const isMultipleMode = question?.multipleAnswers || false;
                const correctAnswers = Array.isArray(question?.correctAnswer)
                  ? question.correctAnswer
                  : question?.correctAnswer
                    ? [question.correctAnswer]
                    : [];

                return (
                  <div key={field.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Вопрос {qIndex + 1}</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`multiple-${qIndex}`}
                          checked={isMultipleMode}
                          onCheckedChange={(checked) => {
                            setValue(`questions.${qIndex}.multipleAnswers`, !!checked);
                            setValue(
                              `questions.${qIndex}.correctAnswer`,
                              checked ? [] : ""
                            );
                          }}
                        />
                        <Label
                          htmlFor={`multiple-${qIndex}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          Несколько правильных
                        </Label>
                      </div>
                    </div>

                    <Input
                      {...register(`questions.${qIndex}.question`, {
                        required: true,
                      })}
                      placeholder="Текст вопроса"
                    />

                    <div className="space-y-2">
                      {question?.questionImagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={question.questionImagePreview}
                            alt=""
                            className="max-h-40 max-w-xs rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-7 w-7"
                            onClick={() => {
                              setValue(`questions.${qIndex}.questionImage`, null);
                              setValue(
                                `questions.${qIndex}.questionImagePreview`,
                                undefined
                              );
                            }}
                          >
                            <LuX />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`question-image-${qIndex}`}
                            onChange={(e) => handleQuestionImageChange(qIndex, e)}
                          />
                          <Label htmlFor={`question-image-${qIndex}`}>
                            <Button type="button" variant="outline" size="sm" asChild>
                              <span>
                                <LuImage className="mr-2" />
                                Изображение вопроса
                              </span>
                            </Button>
                          </Label>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {options.map((option, oIndex) => (
                        <div
                          key={option.id || oIndex}
                          className="space-y-2 rounded-md border bg-muted/20 p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Input
                              {...register(
                                `questions.${qIndex}.options.${oIndex}.text`,
                                { required: true }
                              )}
                              placeholder={`Вариант ${oIndex + 1}`}
                            />
                            {options.length > 2 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => {
                                  const updated = [...options];
                                  updated.splice(oIndex, 1);
                                  setValue(`questions.${qIndex}.options`, updated);
                                }}
                              >
                                <LuX />
                              </Button>
                            )}
                          </div>
                          {option.imagePreview ? (
                            <div className="relative inline-block">
                              <img
                                src={option.imagePreview}
                                alt=""
                                className="max-h-24 rounded-md border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6"
                                onClick={() => {
                                  const updated = [...options];
                                  updated[oIndex] = {
                                    ...updated[oIndex],
                                    image: null,
                                    imagePreview: undefined,
                                  };
                                  setValue(`questions.${qIndex}.options`, updated);
                                }}
                              >
                                <LuX className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id={`option-image-${qIndex}-${oIndex}`}
                                onChange={(e) =>
                                  handleOptionImageChange(qIndex, oIndex, e)
                                }
                              />
                              <Label htmlFor={`option-image-${qIndex}-${oIndex}`}>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="w-full"
                                >
                                  <span>
                                    <LuImage className="mr-2 h-4 w-4" />
                                    Изображение
                                  </span>
                                </Button>
                              </Label>
                            </>
                          )}
                        </div>
                      ))}
                      {options.length < 6 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-full min-h-24 border-dashed text-muted-foreground"
                          onClick={() =>
                            setValue(`questions.${qIndex}.options`, [
                              ...options,
                              { text: "", image: null, imagePreview: undefined },
                            ])
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Вариант
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label>Правильный ответ</Label>
                      {isMultipleMode ? (
                        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                          {options
                            .filter((option) => option.text.trim() !== "")
                            .map((option, idx) => (
                              <label
                                key={idx}
                                className="flex items-center gap-2 rounded border px-3 py-2"
                              >
                                <Checkbox
                                  checked={correctAnswers.includes(option.text)}
                                  onCheckedChange={(checked) => {
                                    const next = checked
                                      ? [...correctAnswers, option.text]
                                      : correctAnswers.filter(
                                          (answer) => answer !== option.text
                                        );
                                    setValue(
                                      `questions.${qIndex}.correctAnswer`,
                                      next
                                    );
                                  }}
                                />
                                <span className="text-sm">{option.text}</span>
                              </label>
                            ))}
                        </div>
                      ) : (
                        <select
                          className="mt-1 w-full rounded border px-3 py-2 text-sm"
                          value={
                            typeof question?.correctAnswer === "string"
                              ? question.correctAnswer
                              : ""
                          }
                          onChange={(e) =>
                            setValue(
                              `questions.${qIndex}.correctAnswer`,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Выберите вариант</option>
                          {options
                            .filter((option) => option.text.trim() !== "")
                            .map((option, idx) => (
                              <option key={idx} value={option.text}>
                                {option.text}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>

                    {questionFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(qIndex)}
                      >
                        Удалить вопрос
                      </Button>
                    )}
                  </div>
                );
              })}

              {questionFields.length < 20 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append(emptyQuestion())}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить вопрос
                </Button>
              )}
            </div>
          </ScrollArea>

     
        </form>
      )}
    </div>
  );
};
