import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAuth } from "shared/hooks";
import { useQuizId } from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import { Progress } from "shared/shadcn/ui/progress";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";
import { toast } from "sonner";
import { mockQuizData } from "../model/feedMock";
import {
  useFetchQuiz,
  useSubmitQuizResult,
} from "../model/services/quizQueries";
import { QuizPayload } from "../model/types/quiz";

interface QuizProps {
  id_quiz: string;
  onFinish: () => void;
}
const Quiz = ({ id_quiz, onFinish }: QuizProps) => {
  const { t } = useTranslation();
  const quizId = useQuizId();
  const authData = useAuth();
  const { data: quizData, isLoading } = useFetchQuiz(quizId || "");
  const { mutate: submitResult, isPending } = useSubmitQuizResult();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [answers, setAnswers] = useState<
    { questionId: string; selected: string }[]
  >([]);

  const sourceQuiz: QuizPayload =
    quizData ||
    mockQuizData.find((q) => q.quizId === id_quiz) ||
    mockQuizData[0];
  const quiz: QuizPayload = {
    ...sourceQuiz,
    questions: sourceQuiz.questions.filter(
      (question) =>
        Boolean(question.question?.trim()) ||
        (question.options?.some((option) => Boolean(option?.trim())) ?? false)
    ),
  };

  const finishQuiz = useCallback(
    (lastAnswer: string) => {
      const currentQuestion = quiz.questions[currentQuestionIndex];

      // добавляем финальный ответ
      const allAnswers = [
        ...answers,
        {
          questionId: currentQuestion.id,
          selected: lastAnswer,
        },
      ];

      setAnswers(allAnswers);

      if (lastAnswer === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
      }
      toast.success(t("Тест завершён!"));
      console.log("Ответы пользователя:", allAnswers);
      onFinish();
      if (authData?.id) {
        submitResult({
          quizId: quizId || quiz.quizId,
          userId: authData.id,
          score:
            lastAnswer === currentQuestion.correctAnswer ? score + 1 : score,
          totalQuestions: quiz.questions.length,
          completedAt: new Date(),
        });
      }
    },
    [
      answers,
      authData.id,
      currentQuestionIndex,
      onFinish,
      quiz.questions,
      quiz.quizId,
      quizId,
      score,
      submitResult,
      t,
    ]
  );

  const handleNextQuestion = (selectedAnswer: string) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedAnswer,
      },
    ]);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quiz.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      reset();
    } else {
      finishQuiz(selectedAnswer);
    }
  };

  const onSubmit = handleSubmit((data) => {
    handleNextQuestion(data.answer);
  }, onFormInvalid);

  if (isLoading) {
    return <div className="text-center mt-8">{t("Загрузка...")}</div>;
  }

  if (!quiz) {
    return <div className="text-center mt-8">{t("Викторина не найдена")}</div>;
  }

  if (!quiz.questions.length) {
    return <div className="text-center mt-8">{t("В тесте нет вопросов")}</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mt-2">
      <div className="pt-2 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{quiz.title}</h2>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {t("Вопрос {{current}} / {{total}}", {
              current: currentQuestionIndex + 1,
              total: totalQuestions,
            })}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="p-2 flex flex-col gap-2">
        <p className="text-lg font-medium">{currentQuestion.question}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                id={`option-${index}`}
                value={option}
                {...register("answer", requiredField(t("Выберите ответ")))}
                className="h-4 w-4"
              />
              <label htmlFor={`option-${index}`} className="text-sm">
                {option}
              </label>
            </div>
          ))}
          {errors.answer && (
            <p className="text-destructive">
              {t("Выберите один из вариантов ответа")}
            </p>
          )}
          <Button type="submit" disabled={isPending} className="mt-4">
            {isPending ? t("Отправка...") : t("Ответить")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Quiz;
