import { PickQuestionsDialog } from "entities/QuestionBank";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LuBookDashed, LuEye, LuLibrary } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UseTooltip } from "shared/components";
import CheckboxCard from "shared/components/CheckboxCard";
import {
  emptyOptionDraft,
  emptyQuestionDraft,
  isQuestionDraftStarted,
  resolveQuestionType,
  toApiQuestionPayload,
  validateQuestionDraft,
  type QuestionDraft,
} from "shared/components/QuestionEditor";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { FieldLabel } from "shared/components/FieldLabel";
import { onFormInvalid, requiredField, toastRequiredField } from "shared/lib/onFormInvalid";
import { Separator } from "shared/shadcn/ui/separator";
import { Textarea } from "shared/shadcn/ui/textarea";
import QuizQuestionCard from "./quiz-question-card";

type QuestionForm = QuestionDraft;

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

interface QuizFormData {
  title: string;
  description: string;
  opening_date: Date;
  deadline: Date;
  required: boolean;
  timeLimit: number;
  maxPoints: number;
  minPoints: number;
  showCorrectAnswers: boolean;
  theme_id?: string;
  questions: QuestionForm[];
}

const Add_Quiz = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    defaultValues: {
      maxPoints: 100,
      minPoints: 0,
      showCorrectAnswers: false,
      questions: [emptyQuestionDraft()],
    },
  });

  const [searchParams] = useSearchParams();
  const formParam = searchParams.get("form");

  const { mutate: createTest, isPending } = testQueries.create_test_with_formdata();
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const options = [
    {
      label: "Обязательный",
      description: "Для выставления балла студенту требуется пройти этот тест",
      value: "required",
      icon: LuBookDashed,
    },
    {
      label: "Показывать ответы",
      description: "После сдачи теста студент увидит правильные ответы",
      value: "showCorrectAnswers",
      icon: LuEye,
    },
  ];

  const selectedValues = [
    ...(watch("required") ? ["required"] : []),
    ...(watch("showCorrectAnswers") ? ["showCorrectAnswers"] : []),
  ];

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (value === "required") {
      setValue("required", checked);
      return;
    }
    if (value === "showCorrectAnswers") {
      setValue("showCorrectAnswers", checked);
    }
  };

  const [date] = useState<Date | undefined>(new Date());
  const [opening_date] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setValue("deadline", date!);
  }, [date, setValue]);

  useEffect(() => {
    setValue("opening_date", opening_date!);
  }, [opening_date, setValue]);

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
    setActiveIndex((prev) => {
      if (totalQuestions === 0) return 0;
      return Math.max(0, Math.min(prev, totalQuestions - 1));
    });
  }, [totalQuestions]);

  const handleAppendQuestion = () => {
    append(emptyQuestionDraft());
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

    const testData = {
      title: formData.title,
      description: formData.description || "",
      opening_date: formData.opening_date.toISOString(),
      required: formData.required || false,
      timeLimit: formData.timeLimit,
      maxPoints: formData.maxPoints || 0,
      minPoints: formData.minPoints || 0,
      showCorrectAnswers: formData.showCorrectAnswers || false,
      questions: filledQuestions.map((question) => toApiQuestionPayload(question)),
    };

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(testData));

    filledQuestions.forEach((question, qIndex) => {
      if (question.questionImage) {
        formDataToSend.append(`questions[${qIndex}][questionImage]`, question.questionImage);
      }

      if (
        resolveQuestionType(question) === "single_choice" ||
        resolveQuestionType(question) === "multiple_choice"
      ) {
        question.options.forEach((option, oIndex) => {
          if (option.image) {
            formDataToSend.append(`questions[${qIndex}][options][${oIndex}][image]`, option.image);
          }
        });
      }
    });

    createTest(formDataToSend, {
      onSuccess: () => navigate(-1),
    });
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit(onSubmit, onFormInvalid)} className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Новый тест</CardTitle>
          <CardDescription>
            Заполните параметры и добавьте вопросы. Тип вопроса выбирается
            в карточке: варианты, верно/неверно, короткий или развёрнутый ответ.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-1.5">
              <FieldLabel htmlFor="quiz-title" required>
                Название теста
              </FieldLabel>
              <Input
                id="quiz-title"
                {...register("title", requiredField("Заполните название теста"))}
                placeholder="Например, Проверка знаний по теме 1"
              />
              {errors.title && (
                <p className="text-xs text-destructive">Обязательно</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <FieldLabel htmlFor="quiz-description" required>
                Описание
              </FieldLabel>
              <Textarea
                id="quiz-description"
                rows={2}
                placeholder="Кратко опишите, что проверяет тест"
                {...register("description", requiredField("Заполните описание теста"))}
              />
              {errors.description && (
                <span className="text-xs text-destructive">
                  Описание обязательно
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex w-full flex-col gap-1.5">
                <FieldLabel htmlFor="quiz-timelimit" required>
                  Время, мин
                </FieldLabel>
                <Input
                  id="quiz-timelimit"
                  type="number"
                  {...register("timeLimit", {
                    ...requiredField("Укажите время теста"),
                    min: { value: 1, message: "Минимум 1 минута" },
                    valueAsNumber: true,
                  })}
                  placeholder="60"
                />
                {errors.timeLimit && (
                  <p className="text-xs text-destructive">Минимум 1 минута</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <FieldLabel htmlFor="quiz-maxpoints" required>
                  Макс. балл
                </FieldLabel>
                <Input
                  id="quiz-maxpoints"
                  type="number"
                  step={1}
                  {...register("maxPoints", {
                    ...requiredField("Укажите максимальный балл"),
                    min: { value: 0, message: "Минимум 0 баллов" },
                    valueAsNumber: true,
                  })}
                  placeholder="100"
                />
                {errors.maxPoints && (
                  <p className="text-xs text-destructive">Минимум 0 баллов</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <FieldLabel htmlFor="quiz-minpoints" required>
                  Мин. балл для сдачи
                </FieldLabel>
                <Input
                  id="quiz-minpoints"
                  type="number"
                  step={1}
                  {...register("minPoints", {
                    required: "Укажите минимальный балл для сдачи",
                    min: { value: 0, message: "От 0 до максимума" },
                    valueAsNumber: true,
                    validate: (value) => {
                      if (!Number.isFinite(value)) {
                        return "Укажите минимальный балл для сдачи";
                      }
                      return (
                        value <= (watch("maxPoints") || 0) ||
                        "Не больше максимального балла"
                      );
                    },
                  })}
                  placeholder="60"
                />
                {errors.minPoints && (
                  <p className="text-xs text-destructive">
                    {errors.minPoints.message || "От 0 до максимума"}
                  </p>
                )}
              </div>
            </div>

            {!formParam?.includes("choose-test") && (
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Дополнительно</FieldLabel>
                <CheckboxCard
                  options={options}
                  selectedValues={selectedValues}
                  onChange={handleCheckboxChange}
                />
              </div>
            )}
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
                  <QuizQuestionCard
                    value={questionField.value || emptyQuestionDraft()}
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
                        questionField.value || emptyQuestionDraft();
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
                <Button type="button" variant="outline" onClick={handleAppendQuestion}>
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
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Создание..." : "Создать тест"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isPending}
            className="w-full"
          >
            Отмена
          </Button>
        </CardFooter>
      </form>

      <PickQuestionsDialog
        open={bankPickerOpen}
        onOpenChange={setBankPickerOpen}
        onInsert={handleInsertFromBank}
      />
    </Card>
  );
};

export default Add_Quiz;
