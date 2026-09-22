import { testQueries } from "entities/Test";
import {
  clearAttemptDraft,
  ensureAttemptDraft,
  remainingSecondsFromDraft,
  saveDraftAnswers,
} from "entities/Test/model/lib/attemptDraftCache";
import { submitTestAnswers } from "entities/Test/model/services/testAPI";
import {
  isFilledTestQuestion,
  SavedAttemptAnswer,
  TestAnswer,
  TestDetails,
  TestQuestion,
  TestSubmissionResponse,
} from "entities/Test/model/types/test";
import { AlertCircle, FileQuestion, Clock } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastRequiredField } from "shared/lib/onFormInvalid";
import { cn } from "shared/lib/utils";
import {
  isTextQuestionType,
  resolveQuestionType,
} from "shared/components/QuestionEditor";
import {
  openCourse,
  openTestResult,
  useCourseId,
  useQuizId,
} from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
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
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
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
  return questions.map((question) => {
    const type = resolveQuestionType(question);
    if (isTextQuestionType(type)) {
      return {
        questionId: question.id,
        textAnswer: String(formData.get(question.id) ?? "").trim(),
      };
    }
    return {
      questionId: question.id,
      selectedOptions: formData.getAll(question.id).map(String),
    };
  });
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

  const { data: testQuestionsData, isLoading, isError, refetch } = useQuery(
    testQueries.TestQuestions(id || null)
  );

  const quizData = useMemo(() => {
    if (!testQuestionsData) return null;
    return {
      ...testQuestionsData,
      questions: testQuestionsData.questions.filter(isFilledTestQuestion),
    };
  }, [testQuestionsData]);

  const [showTimeUp, setShowTimeUp] = useState(false);
  const [pendingResults, setPendingResults] = useState<{
    results: TestSubmissionResponse;
    quizData: TestDetails;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState<SavedAttemptAnswer[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const timeRemainingRef = useRef(0);
  const startedRef = useRef(false);

  const persistDraft = useCallback(() => {
    if (!id || !quizData || !formRef.current || isSubmitted) return;
    saveDraftAnswers(id, collectAnswers(formRef.current, quizData.questions));
  }, [id, isSubmitted, quizData]);

  useEffect(() => {
    if (!id || !quizData) return;
    const draft = ensureAttemptDraft(id, (quizData.timeLimit || 0) * 60);
    const remaining = quizData.timeLimit
      ? remainingSecondsFromDraft(draft)
      : 0;
    setSavedAnswers(draft.answers);
    setRemainingSeconds(remaining);
    timeRemainingRef.current = remaining;
    setReady(true);
  }, [id, quizData]);

  const goToResults = useCallback(
    (results: TestSubmissionResponse, meta: TestDetails) => {
      if (id) clearAttemptDraft(id);
      openTestResult(navigate, id as string, {
        courseId,
        state: { results, quizData: meta, courseId },
      });
      void queryClient.invalidateQueries({ queryKey: ["course", "tests"] });
      void queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    [courseId, id, navigate, queryClient]
  );

  const submitAnswers = useCallback(
    async (formattedAnswers: TestAnswer[], fromTimer = false) => {
      if (!quizData || !id || startedRef.current) return;
      startedRef.current = true;
      setSubmitFailed(false);

      try {
        setIsSubmitting(true);
        const response = await submitTestAnswers(id, {
          answers: formattedAnswers,
          timeRemaining: Math.max(0, timeRemainingRef.current),
          showCorrectAnswers: quizData.showCorrectAnswers || false,
        });
        if (fromTimer) {
          setPendingResults({ results: response, quizData });
          setShowTimeUp(true);
          setIsSubmitted(true);
          if (id) clearAttemptDraft(id);
        } else {
          goToResults(response, quizData);
        }
      } catch (err) {
        startedRef.current = false;
        setSubmitFailed(true);
        const apiMessage = axios.isAxiosError(err)
          ? err.response?.data?.error || err.response?.data?.message
          : null;
        toast.error(
          apiMessage || "Произошла ошибка при отправке ответов. Пожалуйста, попробуйте снова."
        );
        setIsSubmitting(false);
        setIsSubmitted(false);
      }
    },
    [goToResults, id, quizData]
  );

  useEffect(() => {
    if (!ready || !quizData || !id || isSubmitted || isSubmitting || submitFailed) return;
    if (!quizData.timeLimit || remainingSeconds > 0) return;
    setIsSubmitted(true);
    void submitAnswers(savedAnswers, true);
  }, [
    id,
    isSubmitted,
    isSubmitting,
    submitFailed,
    quizData,
    ready,
    remainingSeconds,
    savedAnswers,
    submitAnswers,
  ]);

  useEffect(() => {
    if (!id || !quizData || isSubmitted) return;
    const flush = () => persistDraft();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [id, isSubmitted, persistDraft, quizData]);

  const handleTimeUp = useCallback(() => {
    if (!quizData || isSubmitted || isSubmitting) return;
    persistDraft();
    setIsSubmitted(true);
    const formatted = formRef.current
      ? collectAnswers(formRef.current, quizData.questions)
      : savedAnswers;
    void submitAnswers(formatted, true);
  }, [isSubmitted, isSubmitting, persistDraft, quizData, savedAnswers, submitAnswers]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitted || isSubmitting || !quizData) return;
    const formattedAnswers = collectAnswers(event.currentTarget, quizData.questions);
    persistDraft();
    setIsSubmitted(true);
    await submitAnswers(formattedAnswers, false);
  };

  if (isLoading || (quizData && !ready)) {
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

  if (showTimeUp && pendingResults) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6">
            <Clock className="h-12 w-12 text-amber-500" />
            <h2 className="text-xl font-semibold text-center">Время вышло</h2>
            <p className="text-sm text-muted-foreground text-center text-pretty">
              Работа отправлена преподавателю. Неотвеченные вопросы засчитаны как
              пустые.
            </p>
            <Button
              className="w-full"
              onClick={() =>
                goToResults(pendingResults.results, pendingResults.quizData)
              }
            >
              К результатам
            </Button>
            <Button variant="ghost" className="w-full" onClick={goToCourse}>
              Вернуться к курсу
            </Button>
          </CardContent>
        </Card>
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
            <Button variant="outline" onClick={() => void refetch()}>
              Повторить
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (quizData.questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileQuestion />
            </EmptyMedia>
            <EmptyTitle>В тесте нет вопросов</EmptyTitle>
            <EmptyDescription>
              Этот тест ещё не содержит заполненных вопросов.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={goToCourse}>Вернуться к курсу</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (quizData.timeLimit && remainingSeconds <= 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {submitFailed ? (
                <AlertCircle />
              ) : (
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </EmptyMedia>
            <EmptyTitle>
              {submitFailed ? "Не удалось отправить тест" : "Отправка теста"}
            </EmptyTitle>
            <EmptyDescription>
              {submitFailed
                ? "Проверьте соединение и отправьте ответы ещё раз."
                : "Время вышло, отправляем ответы."}
            </EmptyDescription>
          </EmptyHeader>
          {submitFailed ? (
            <EmptyContent>
              <Button
                onClick={() => {
                  setSubmitFailed(false);
                  setIsSubmitted(true);
                  void submitAnswers(savedAnswers, true);
                }}
              >
                Отправить ещё раз
              </Button>
              <Button variant="outline" onClick={goToCourse}>
                Вернуться к курсу
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      </div>
    );
  }

  return (
    <StudentQuiz
      formRef={formRef}
      isSubmitted={isSubmitted}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onChange={persistDraft}
      onTimeUp={handleTimeUp}
      quizData={quizData}
      remainingSeconds={remainingSeconds}
      timeRemainingRef={timeRemainingRef}
      savedAnswers={savedAnswers}
    />
  );
};

function StudentQuiz({
  formRef,
  isSubmitted,
  isSubmitting,
  onSubmit,
  onChange,
  onTimeUp,
  quizData,
  remainingSeconds,
  timeRemainingRef,
  savedAnswers,
}: {
  formRef: React.RefObject<HTMLFormElement | null>;
  isSubmitted: boolean;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: () => void;
  onTimeUp: () => void;
  quizData: TestDetails & { questions: TestQuestion[] };
  remainingSeconds: number;
  timeRemainingRef: React.MutableRefObject<number>;
  savedAnswers: SavedAttemptAnswer[];
}) {
  const savedById = useMemo(() => {
    const map = new Map<string, SavedAttemptAnswer>();
    for (const answer of savedAnswers) map.set(answer.questionId, answer);
    return map;
  }, [savedAnswers]);

  const items = useMemo(
    () =>
      quizData.questions.map((question) => {
        const type = resolveQuestionType(question);
        return {
          name: question.id,
          required: type !== "essay",
          choices: isTextQuestionType(type)
            ? undefined
            : question.options.map((option) => ({ value: option.id })),
        };
      }),
    [quizData.questions]
  );

  const invalidToastLock = useRef(false);
  const handleInvalid = () => {
    if (invalidToastLock.current) return;
    invalidToastLock.current = true;
    toastRequiredField("Ответьте на все обязательные вопросы");
    window.setTimeout(() => {
      invalidToastLock.current = false;
    }, 400);
  };

  const useNumberShortcuts = quizData.questions.every((question) => {
    const type = resolveQuestionType(question);
    return !isTextQuestionType(type) && question.options.length <= 9;
  });

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
            initialTime={remainingSeconds}
            timeLimitSeconds={quizData.timeLimit * 60}
            onTimeUp={onTimeUp}
            isSubmitted={isSubmitted}
            timeRef={timeRemainingRef}
          />
        ) : null}
      </div>

      <Card>
        <CardContent onInvalidCapture={handleInvalid} onChange={onChange}>
          <Questionnaire
            ref={formRef}
            items={items}
            shortcuts={useNumberShortcuts ? "numbers" : undefined}
            defaultItem={quizData.questions[0]?.id}
            onSubmit={onSubmit}
            className={cn(
              isSubmitted || isSubmitting
                ? "pointer-events-none opacity-70"
                : undefined
            )}
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
              const type = resolveQuestionType(question);
              const isText = isTextQuestionType(type);
              const isEssay = type === "essay";
              const hasOptionImages = question.options.some((option) => option.image);
              const saved = savedById.get(question.id);
              const description =
                type === "multiple_choice"
                  ? "Выберите один или несколько вариантов."
                  : type === "short_answer"
                    ? "Введите короткий ответ."
                    : type === "essay"
                      ? "Напишите развёрнутый ответ. Можно пропустить вопрос."
                      : "Выберите один вариант.";

              return (
                <QuestionnaireItem
                  key={question.id}
                  name={question.id}
                  required={!isEssay}
                  multiple={type === "multiple_choice"}
                >
                  <QuestionnaireTitle>{question.question}</QuestionnaireTitle>
                  <QuestionnaireDescription>{description}</QuestionnaireDescription>
                  <QuestionMedia question={question} />

                  {isEssay ? (
                    <QuestionnaireInput
                      defaultValue={saved?.textAnswer || undefined}
                      placeholder="Введите развёрнутый ответ"
                      render={(props) => {
                        const { type: _inputType, ...rest } = props as typeof props & {
                          type?: string;
                        };
                        return (
                          <textarea
                            {...rest}
                            rows={8}
                            className={cn(
                              typeof rest.className === "string" ? rest.className : undefined,
                              "min-h-32 field-sizing-content py-2.5"
                            )}
                          />
                        );
                      }}
                    />
                  ) : type === "short_answer" ? (
                    <QuestionnaireInput
                      defaultValue={saved?.textAnswer || undefined}
                      placeholder="Введите ответ"
                    />
                  ) : (
                    <QuestionnaireChoices
                      className={hasOptionImages ? "grid-cols-1 sm:grid-cols-2" : undefined}
                    >
                      {question.options.map((option) => (
                        <QuestionnaireChoice
                          key={option.id}
                          value={option.id}
                          defaultChecked={Boolean(
                            saved?.selectedOptions?.includes(option.id)
                          )}
                        >
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
                  )}
                  <QuestionnaireError>
                    {isEssay
                      ? "Напишите ответ или пропустите вопрос."
                      : isText
                        ? "Введите ответ, чтобы продолжить."
                        : type === "multiple_choice"
                          ? "Выберите хотя бы один вариант, чтобы продолжить."
                          : "Выберите ответ, чтобы продолжить."}
                  </QuestionnaireError>
                </QuestionnaireItem>
              );
            })}

            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireSkip>Пропустить</QuestionnaireSkip>
              <QuestionnaireNext>Далее</QuestionnaireNext>
              <QuestionnaireSubmit disabled={isSubmitted || isSubmitting}>
                {isSubmitting
                  ? "Отправка..."
                  : isSubmitted
                    ? "Отправлено"
                    : "Завершить тест"}
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
