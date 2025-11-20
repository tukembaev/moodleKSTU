import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "shared/shadcn/ui/card";
import { quizData } from "shared/mocks/testMock";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LuTrash2, LuClock } from "react-icons/lu";
import { cn } from "shared/lib/utils";

interface Answer {
  questionId: string;
  selectedOptions: string[];
}

const QuizTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isStudent = true;

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const answersRef = useRef<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit * 60); // в секундах
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Синхронизация answers с ref
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Таймер
  useEffect(() => {
    if (!isStudent || isSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Автоматическая отправка при истечении времени
          const formattedAnswers: Answer[] = quizData.questions.map((q: typeof quizData.questions[0]) => ({
            questionId: q.id,
            selectedOptions: answersRef.current[q.id] || [],
          }));
          console.log("Время истекло. Ответы пользователя:", formattedAnswers);
          setIsSubmitted(true);
          navigate(`/test/quiz-result/${id}`, {
            state: {
              answers: formattedAnswers,
              quizData,
              timeRemaining: 0,
            },
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStudent, isSubmitted, id, navigate]);

  // Вычисление процента оставшегося времени
  const timePercentage = (timeRemaining / (quizData.timeLimit * 60)) * 100;
  const getTimerBorderColor = () => {
    if (timePercentage > 70) return "border-green-500";
    if (timePercentage > 40) return "border-yellow-500";
    return "border-red-500";
  };
  const getTimerBgColor = () => {
    if (timePercentage > 70) return "bg-green-500/10";
    if (timePercentage > 40) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  // Обработка выбора ответов
  const handleAnswerChange = (questionId: string, optionId: string, multiple: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (multiple) {
        const newAnswers = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  // Отправка ответов
  const handleSubmit = () => {
    if (isSubmitted) return;

    const formattedAnswers: Answer[] = quizData.questions.map((q: typeof quizData.questions[0]) => ({
      questionId: q.id,
      selectedOptions: answers[q.id] || [],
    }));

    console.log("Ответы пользователя:", formattedAnswers);
    console.log("ID теста:", id);
    console.log("Данные теста:", quizData);

    setIsSubmitted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Перенаправление на страницу результатов
    navigate(`/test/quiz-result/${id}`, {
      state: {
        answers: formattedAnswers,
        quizData,
        timeRemaining,
      },
    });
  };

  // Удаление теста (для учителя)
  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот тест?")) {
      console.log("Удаление теста:", id);
      // Здесь будет API вызов для удаления
      navigate("/test");
    }
  };

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Режим учителя - просмотр информации о тесте
  if (!isStudent) {
    return (
      <div className="min-h-screen flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{quizData.title}</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">{quizData.description}</p>
          </div>
          <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
            <LuTrash2 className="mr-2" />
            Удалить тест
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Информация о тесте</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <span className="font-semibold">Время на прохождение: </span>
              <span>{quizData.timeLimit} минут</span>
            </div>
            <div>
              <span className="font-semibold">Обязательный: </span>
              <span>{quizData.required ? "Да" : "Нет"}</span>
            </div>
            <div>
              <span className="font-semibold">Дата открытия: </span>
              <span>
                {format(new Date(quizData.opening_date), "PPP", { locale: ru })}
              </span>
            </div>
            <div>
              <span className="font-semibold">Дедлайн: </span>
              <span>
                {format(new Date(quizData.deadline), "PPP", { locale: ru })}
              </span>
            </div>
            <div>
              <span className="font-semibold">Курсы: </span>
              <span>{quizData.courseIds.join(", ")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Вопросы ({quizData.questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {quizData.questions.map((question: typeof quizData.questions[0], index: number) => (
              <div key={question.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start gap-2 mb-3">
                  <span className="font-semibold">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="font-medium">{question.question}</p>
                    {question.questionImage && (
                      <img
                        src={question.questionImage}
                        alt="Question"
                        className="mt-2 w-full max-w-full sm:max-w-md rounded-lg object-contain"
                      />
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.multipleAnswers
                        ? "Множественный выбор"
                        : "Один вариант"}
                    </p>
                  </div>
                </div>
                <div className="ml-6 flex flex-col gap-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{option.text}</span>
                      {option.image && (
                        <img
                          src={option.image}
                          alt="Option"
                          className="ml-2 w-full max-w-full sm:max-w-xs rounded object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Режим студента - прохождение теста
  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic Island таймер */}
      <div className="sticky  left-0 right-0 z-20 flex justify-center pt-2 px-4 pointer-events-none">
        <div
          className={cn(
            "px-3 sm:px-6 py-2 sm:py-3 rounded-full border-2 shadow-lg backdrop-blur-md pointer-events-auto",
            getTimerBorderColor(),
            getTimerBgColor(),
            "transition-all duration-300"
          )}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LuClock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">
              <span className="hidden sm:inline">Оставшееся время </span>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Контент теста */}
      <div className="flex-1 py-4 sm:py-6 max-w-4xl mx-auto px-4 w-full">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{quizData.title}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{quizData.description}</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-4 sm:gap-8">
          {quizData.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-start gap-2 text-lg sm:text-xl">
                  <span className="flex-shrink-0">{index + 1}.</span>
                  <span className="flex-1 break-words">{question.question}</span>
                </CardTitle>
                {question.questionImage && (
                  <img
                    src={question.questionImage}
                    alt="Question"
                    className="mt-2 w-full max-w-full sm:max-w-md rounded-lg object-contain"
                  />
                )}
                <CardDescription className="text-xs sm:text-sm">
                  {question.multipleAnswers
                    ? "Выберите один или несколько вариантов"
                    : "Выберите один вариант"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex flex-col gap-2 sm:gap-3">
                  {question.options.map((option: typeof question.options[0]) => {
                    const isChecked = (answers[question.id] || []).includes(
                      option.id
                    );
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200",
                          isChecked
                            ? "bg-primary/5 border-primary/30 shadow-sm"
                            : "hover:bg-accent/50 border-border"
                        )}
                      >
                        <input
                          type={question.multipleAnswers ? "checkbox" : "radio"}
                          name={question.id}
                          value={option.id}
                          checked={isChecked}
                          onChange={() =>
                            handleAnswerChange(
                              question.id,
                              option.id,
                              question.multipleAnswers
                            )
                          }
                          className="mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="break-words text-sm sm:text-base">{option.text}</span>
                          {option.image && (
                            <img
                              src={option.image}
                              alt="Option"
                              className="mt-2 w-full max-w-full sm:max-w-xs rounded object-contain"
                            />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end gap-4 pb-4 sm:pb-6">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitted}
              className="w-full sm:w-auto sm:min-w-32"
            >
              {isSubmitted ? "Отправка..." : "Отправить ответы"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizTestPage;

