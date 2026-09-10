import { PickQuestionsDialog } from "entities/QuestionBank";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LuBookDashed, LuLibrary } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UseTooltip } from "shared/components";
import CheckboxCard from "shared/components/CheckboxCard";
import {
  emptyOptionDraft,
  emptyQuestionDraft,
  type QuestionDraft,
} from "shared/components/QuestionEditor";
import { useFormParam } from "shared/hooks";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
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
import { Checkbox } from "shared/shadcn/ui/checkbox";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { Separator } from "shared/shadcn/ui/separator";
import { Textarea } from "shared/shadcn/ui/textarea";
import QuizQuestionCard from "./quiz-question-card";

type QuestionForm = QuestionDraft;

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
      questions: [emptyQuestionDraft(), emptyQuestionDraft()],
    },
  });

  const [searchParams] = useSearchParams();
  const formParam = searchParams.get("form");
  const formCourseId = useFormParam("course_id");
  const storedCourseId = useCourseId();
  const courseId = formCourseId || storedCourseId;

  const { mutate: createTest, isPending } = testQueries.create_test_with_formdata();
  const { mutate: attachTest } = testQueries.attach_test_to_course();
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const options = [
    {
      label: "Обязательный",
      description: "Для выставления балла студенту требуется пройти этот тест",
      value: "required",
      icon: LuBookDashed,
    },
  ];

  const selectedValues = watch("required") ? ["required"] : [];

  const handleCheckboxChange = (_value: string, checked: boolean) => {
    setValue("required", checked);
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
  const canRemoveQuestion = totalQuestions > 2;
  const isBankDisabled = isQuestionStarted(watchedQuestions?.[activeIndex]);

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

  const onSubmit = (formData: QuizFormData) => {
    const testData = {
      title: formData.title,
      description: formData.description || "",
      opening_date: formData.opening_date.toISOString(),
      required: formData.required || false,
      timeLimit: formData.timeLimit,
      maxPoints: formData.maxPoints || 0,
      minPoints: formData.minPoints || 0,
      showCorrectAnswers: formData.showCorrectAnswers || false,
      questions: formData.questions.map((question) => ({
        question: question.question,
        multipleAnswers: question.multipleAnswers || false,
        correctAnswer: question.multipleAnswers && Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : typeof question.correctAnswer === "string"
            ? question.correctAnswer
            : "",
        options: question.options
          .filter((opt) => opt.text.trim() !== "")
          .map((option) => ({
            text: option.text,
          })),
      })),
    };

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(testData));

    formData.questions.forEach((question, qIndex) => {
      if (question.questionImage) {
        formDataToSend.append(`questions[${qIndex}][questionImage]`, question.questionImage);
      }

      question.options.forEach((option, oIndex) => {
        if (option.image) {
          formDataToSend.append(`questions[${qIndex}][options][${oIndex}][image]`, option.image);
        }
      });
    });

    createTest(formDataToSend, {
      onSuccess: (created) => {
        if (courseId && created?.id) {
          attachTest(
            { test_id: created.id, course_id: courseId },
            { onSettled: () => navigate(-1) }
          );
          return;
        }
        navigate(-1);
      },
    });
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

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Новый тест</CardTitle>
          <CardDescription>
            Заполните параметры и добавьте вопросы. Правильный ответ отмечается
            нажатием на карточку варианта.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-1.5">
              <Label htmlFor="quiz-title">Название теста</Label>
              <Input
                id="quiz-title"
                {...register("title", { required: true })}
                placeholder="Например, Проверка знаний по теме 1"
              />
              {errors.title && (
                <p className="text-xs text-destructive">Обязательно</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Label htmlFor="quiz-description">Описание</Label>
              <Textarea
                id="quiz-description"
                rows={2}
                placeholder="Кратко опишите, что проверяет тест"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <span className="text-xs text-destructive">
                  Описание обязательно
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex w-full flex-col gap-1.5">
                <Label htmlFor="quiz-timelimit">Время, мин</Label>
                <Input
                  id="quiz-timelimit"
                  type="number"
                  {...register("timeLimit", { required: true, min: 1 })}
                  placeholder="60"
                />
                {errors.timeLimit && (
                  <p className="text-xs text-destructive">Минимум 1 минута</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <Label htmlFor="quiz-maxpoints">Макс. балл</Label>
                <Input
                  id="quiz-maxpoints"
                  type="number"
                  step={1}
                  {...register("maxPoints", {
                    required: true,
                    min: 0,
                    valueAsNumber: true,
                  })}
                  placeholder="100"
                />
                {errors.maxPoints && (
                  <p className="text-xs text-destructive">Минимум 0 баллов</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <Label htmlFor="quiz-minpoints">Мин. балл</Label>
                <Input
                  id="quiz-minpoints"
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
                  placeholder="60"
                />
                {errors.minPoints && (
                  <p className="text-xs text-destructive">
                    {errors.minPoints.message || "От 0 до максимума"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-input px-3">
                <Checkbox
                  id="showCorrectAnswers"
                  {...register("showCorrectAnswers")}
                  onCheckedChange={(checked) =>
                    setValue("showCorrectAnswers", !!checked)
                  }
                />
                <Label
                  htmlFor="showCorrectAnswers"
                  className="cursor-pointer text-sm font-normal"
                >
                  Показывать ответы после сдачи
                </Label>
              </div>
            </div>

            {!formParam?.includes("choose-test") && (
              <div className="flex flex-col gap-1.5">
                <Label>Дополнительно</Label>
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
                <p className="text-lg font-medium">Вопросы </p>
               
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
