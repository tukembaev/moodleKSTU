import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { testQueries } from "entities/Test";
import { submitTestAnswers } from "entities/Test/model/services/testAPI";
import { TestAnswer, TestDetails, TestQuestion } from "entities/Test/model/types/test";
import { AlertCircle, FileQuestion } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { cn } from "shared/lib/utils";
import {
  openCourse,
  openTestResult,
  useCourseId,
  useQuizId,
} from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "shared/shadcn/ui/questionnaire";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Timer } from "./Timer";
import axios from "axios";
import { toast } from "sonner";

const collectAnswers = (
  form: HTMLFormElement,
  questions: TestQuestion[]
): TestAnswer[] => {
  const formData = new FormData(form);
  return questions.map((question) => ({
    questionId: question.id,
    selectedOptions: formData.getAll(question.id).map(String),
  }));
};

const QuizTestPage = () => {
  const id = useQuizId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const courseId = useCourseId() || null;
  const goToCourse = () => {
    if (courseId) openCourse(navigate, courseId);
    else navigate("/courses");
  };
  const isStudent = true;
  const { data: testQuestionsData, isLoading, isError } = useQuery(
    testQueries.TestQuestions(id as string)
  );
  const quizData = testQuestionsData ?? null;

  const formRef = useRef<HTMLFormElement>(null);
  const timeRemainingRef = useRef<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quizData?.timeLimit) {
      timeRemainingRef.current = quizData.timeLimit * 60;
    }
  }, [quizData]);

  const submitAnswers = async (formattedAnswers: TestAnswer[], currentTimeRemaining: number) => {
    if (!quizData || !id) return;

    try {
      setIsSubmitting(true);

      const response = await submitTestAnswers(id, {
        answers: formattedAnswers,
        timeRemaining: currentTimeRemaining,
        showCorrectAnswers: testQuestionsData?.showCorrectAnswers || false,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["course", "tests"] }),
        queryClient.invalidateQueries({ queryKey: ["test"] }),
      ]);
      openTestResult(navigate, id, {
        courseId,
        state: {
          results: response,
          quizData,
          courseId,
        },
      });
    } catch (error) {
      const apiMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.response?.data?.message
        : null;
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error(apiMessage || "Тест закрыт или не прикреплён к вашему курсу.");
      } else {
        toast.error(apiMessage || "Произошла ошибка при отправке ответов. Пожалуйста, попробуйте снова.");
      }
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  };

  const handleTimeUp = useCallback(() => {
    if (!quizData || isSubmitted) return;

    const formattedAnswers = formRef.current
      ? collectAnswers(formRef.current, quizData.questions)
      : quizData.questions.map((question) => ({
          questionId: question.id,
          selectedOptions: [],
        }));

    setIsSubmitted(true);
    submitAnswers(formattedAnswers, 0);
  }, [quizData, isSubmitted, id, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitted || isSubmitting || !quizData) return;

    const formattedAnswers = collectAnswers(event.currentTarget, quizData.questions);

    setIsSubmitted(true);
    await submitAnswers(formattedAnswers, timeRemainingRef.current);
  };

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот тест?")) {
      goToCourse();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </EmptyMedia>
            <EmptyTitle>Загрузка теста</EmptyTitle>
            <EmptyDescription>Подождите, вопросы уже почти готовы.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>Тест недоступен</EmptyTitle>
            <EmptyDescription>
              Тест закрыт или не прикреплён к вашему курсу.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={goToCourse}>Вернуться к курсу</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileQuestion />
            </EmptyMedia>
            <EmptyTitle>Тест не найден</EmptyTitle>
            <EmptyDescription>Данные теста отсутствуют.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={goToCourse}>Вернуться к курсу</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{quizData.title}</h1>
              <p className="text-gray-500 max-w-2xl text-lg">{quizData.description}</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="shrink-0 shadow-sm hover:shadow transition-all"
            >
              <LuTrash2 className="mr-2 h-4 w-4" />
              Удалить тест
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 h-fit sticky top-6 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Детали теста</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Время</span>
                  <span className="font-bold text-gray-900">{quizData.timeLimit} мин</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Обязательный</span>
                  <span className={cn("px-2 py-1 rounded text-xs font-bold", quizData.required ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-700")}>
                    {quizData.required ? "Да" : "Нет"}
                  </span>
                </div>
                <div className="space-y-1 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 block">Даты</span>
                  <div className="text-sm text-gray-900">
                    <div className="flex justify-between">
                      <span>Начало:</span>
                      <span>{format(new Date(quizData.opening_date), "dd MMM", { locale: ru })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl">Вопросы ({quizData.questions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {quizData.questions.map((question: TestQuestion, index: number) => (
                  <div key={question.id} className="group relative pl-4 border-l-4 border-gray-200 hover:border-primary transition-colors">
                    <div className="absolute -left-[29px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 group-hover:border-primary text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">
                      {index + 1}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                        <span className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {question.multipleAnswers ? "Множественный выбор" : "Один вариант"}
                        </span>
                      </div>

                      {question.questionImage && (
                        <div className="relative rounded-xl overflow-hidden border bg-gray-50 max-w-md">
                          <img
                            src={question.questionImage}
                            alt="Question"
                            className="w-full h-auto object-contain max-h-[300px]"
                          />
                        </div>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                            <span className="text-sm text-gray-700">{option.text}</span>
                            {option.image && (
                              <img
                                src={option.image}
                                alt="Option"
                                className="ml-auto w-12 h-12 rounded object-cover border"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StudentQuiz
      formRef={formRef}
      isSubmitted={isSubmitted}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onTimeUp={handleTimeUp}
      quizData={quizData}
      timeRemainingRef={timeRemainingRef}
    />
  );
};

function StudentQuiz({
  formRef,
  isSubmitted,
  isSubmitting,
  onSubmit,
  onTimeUp,
  quizData,
  timeRemainingRef,
}: {
  formRef: React.RefObject<HTMLFormElement | null>;
  isSubmitted: boolean;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTimeUp: () => void;
  quizData: TestDetails;
  timeRemainingRef: React.MutableRefObject<number>;
}) {
  const items = useMemo(
    () =>
      quizData.questions.map((question) => ({
        name: question.id,
        required: true,
        choices: question.options.map((option) => ({ value: option.id })),
      })),
    [quizData.questions]
  );

  const useNumberShortcuts = quizData.questions.every(
    (question) => question.options.length <= 9
  );

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-pretty">
            {quizData.title}
          </h1>
          {quizData.description ? (
            <p className="text-sm text-muted-foreground text-pretty">
              {quizData.description}
            </p>
          ) : null}
        </div>
        {quizData.timeLimit ? (
          <Timer
            initialTime={quizData.timeLimit * 60}
            onTimeUp={onTimeUp}
            isSubmitted={isSubmitted}
            timeRef={timeRemainingRef}
          />
        ) : null}
      </div>

      <Card>
        <CardContent>
          <Questionnaire
            ref={formRef}
            items={items}
            shortcuts={useNumberShortcuts ? "numbers" : undefined}
            defaultItem={quizData.questions[0]?.id}
            onSubmit={onSubmit}
            className={cn(isSubmitted || isSubmitting ? "pointer-events-none opacity-70" : undefined)}
          >
            <QuestionnaireProgress
              className="w-full min-w-0"
              render={(props, state) => (
                <div
                  {...props}
                  className={cn(
                    typeof props.className === "string" ? props.className : undefined,
                    "flex w-full min-w-0 flex-col gap-2"
                  )}
                >
                  <span>
                    Вопрос {state.current} из {state.total}
                  </span>
                  <div className="bg-primary/20 h-1 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{
                        width: state.total
                          ? `${(state.current / state.total) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            />

            {quizData.questions.map((question) => {
              const hasOptionImages = question.options.some((option) => option.image);

              return (
                <QuestionnaireItem
                  key={question.id}
                  name={question.id}
                  required
                  multiple={question.multipleAnswers}
                >
                  <QuestionnaireTitle>{question.question}</QuestionnaireTitle>
                  <QuestionnaireDescription>
                    {question.multipleAnswers
                      ? "Выберите один или несколько вариантов."
                      : "Выберите один вариант."}
                  </QuestionnaireDescription>

                  <QuestionMedia question={question} />

                  <QuestionnaireChoices
                    className={hasOptionImages ? "grid-cols-1 sm:grid-cols-2" : undefined}
                  >
                    {question.options.map((option) => (
                      <QuestionnaireChoice key={option.id} value={option.id}>
                        <span className="font-medium">{option.text}</span>
                        {option.image ? (
                          <img
                            src={option.image}
                            alt=""
                            className="mt-1 max-h-32 w-full rounded-md border object-cover"
                          />
                        ) : null}
                      </QuestionnaireChoice>
                    ))}
                  </QuestionnaireChoices>
                  <QuestionnaireError>
                    {question.multipleAnswers
                      ? "Выберите хотя бы один вариант, чтобы продолжить."
                      : "Выберите ответ, чтобы продолжить."}
                  </QuestionnaireError>
                </QuestionnaireItem>
              );
            })}

            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext>Далее</QuestionnaireNext>
              <QuestionnaireSubmit disabled={isSubmitted || isSubmitting}>
                {isSubmitting ? "Отправка..." : isSubmitted ? "Отправлено" : "Завершить тест"}
              </QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionMedia({ question }: { question: TestQuestion }) {
  if (!question.questionAudio && !question.questionVideo && !question.questionImage) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {question.questionAudio ? (
        <div className="rounded-xl border bg-muted/40 p-3">
          <audio controls className="w-full">
            <source src={question.questionAudio} type="audio/mpeg" />
          </audio>
        </div>
      ) : null}
      {question.questionVideo ? (
        <div className="overflow-hidden rounded-xl border bg-muted/40">
          <video controls className="mx-auto max-h-[420px] w-full bg-black">
            <source src={question.questionVideo} type="video/mp4" />
          </video>
        </div>
      ) : null}
      {question.questionImage ? (
        <div className="overflow-hidden rounded-xl border bg-muted/40">
          <img
            src={question.questionImage}
            alt=""
            className="mx-auto max-h-[420px] w-full object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}

export default QuizTestPage;
