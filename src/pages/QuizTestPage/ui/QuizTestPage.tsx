import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { testQueries } from "entities/Test";
import { submitTestAnswers } from "entities/Test/model/services/testAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Timer } from "./Timer";

interface Answer {
  questionId: string;
  selectedOptions: string[];
}

const QuizTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isStudent = true;
  const { data: testQuestionsData, isLoading, isError } = useQuery(testQueries.TestQuestions(id as string));
  console.log(testQuestionsData);
  // Берём первый элемент массива, так как API возвращает массив
  const quizData = testQuestionsData ? testQuestionsData : null;

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const answersRef = useRef<Record<string, string[]>>({});
  const timeRemainingRef = useRef<number>(0); // в секундах
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация времени после загрузки данных
  useEffect(() => {
    if (quizData?.timeLimit) {
      timeRemainingRef.current = quizData.timeLimit * 60;
    }
  }, [quizData]);

  // Синхронизация answers с ref
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Функция для отправки ответов на backend
  const submitAnswers = async (formattedAnswers: Answer[], currentTimeRemaining: number) => {
    if (!quizData || !id) return;

    try {
      setIsSubmitting(true);

      const response = await submitTestAnswers(id, {
        answers: formattedAnswers,
        timeRemaining: currentTimeRemaining,
        showCorrectAnswers: testQuestionsData?.showCorrectAnswers || false,
      });
      navigate(`/test/quiz-result/${id}`, {
        state: {
          results: response,
          quizData,
        },
      });
    } catch (error) {
      console.error("Ошибка при отправке ответов:", error);
      alert("Произошла ошибка при отправке ответов. Пожалуйста, попробуйте снова.");
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  };

  // Обработчик истечения времени
  const handleTimeUp = useCallback(() => {
    if (!quizData || isSubmitted) return;

    const formattedAnswers: Answer[] = quizData.questions.map((q) => ({
      questionId: q.id,
      selectedOptions: answersRef.current[q.id] || [],
    }));

    setIsSubmitted(true);
    submitAnswers(formattedAnswers, 0);
  }, [quizData, isSubmitted, id, navigate]);

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
  const handleSubmit = async () => {
    if (isSubmitted || isSubmitting || !quizData) return;

    const formattedAnswers: Answer[] = quizData.questions.map((q) => ({
      questionId: q.id,
      selectedOptions: answers[q.id] || [],
    }));

    setIsSubmitted(true);

    await submitAnswers(formattedAnswers, timeRemainingRef.current);
  };

  // Удаление теста (для учителя)
  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот тест?")) {
      navigate("/test");
    }
  };


  // Обработка состояния загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 text-lg">Загрузка теста...</p>
        </div>
      </div>
    );
  }

  // Обработка ошибки
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900">Ошибка загрузки</h2>
          <p className="text-gray-600">Не удалось загрузить данные теста</p>
          <Button onClick={() => navigate("/test")}>Вернуться к списку тестов</Button>
        </div>
      </div>
    );
  }

  // Обработка отсутствия данных
  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-gray-400 text-6xl">📝</div>
          <h2 className="text-2xl font-bold text-gray-900">Тест не найден</h2>
          <p className="text-gray-600">Данные теста отсутствуют</p>
          <Button onClick={() => navigate("/test")}>Вернуться к списку тестов</Button>
        </div>
      </div>
    );
  }

  // Режим учителя - просмотр информации о тесте
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
                    {/* <div className="flex justify-between mt-1">
                      <span>Конец:</span>
                      <span>{format(new Date(quizData.deadline), "dd MMM", { locale: ru })}</span>
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl">Вопросы ({quizData.questions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {quizData.questions.map((question: typeof quizData.questions[0], index: number) => (
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

  // Режим студента - прохождение теста
  return (
    <div className="min-h-screen font-sans">
      {/* Sticky Timer Header */}
      {isStudent && quizData?.timeLimit && (
        <div className="fixed top-[73px] left-0 w-full z-20 pointer-events-none">
          <div className="absolute w-full h-24 pointer-events-none" />
          <div className="container max-w-4xl mx-auto px-4 pt-4 flex justify-center relative">
            <Timer
              initialTime={quizData.timeLimit * 60}
              onTimeUp={handleTimeUp}
              isSubmitted={isSubmitted}
              timeRef={timeRemainingRef}
            />
          </div>
        </div>
      )}

      {/* Spacer for fixed timer */}
      <div className="h-20" aria-hidden="true" />

      <div className="container max-w-3xl mx-auto px-4 pb-24 pt-8">
        {/* Header */}
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {quizData.title}
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {quizData.description}
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="space-y-8"
        >
          {quizData.questions.map((question, index) => (
            <Card
              key={question.id}
              className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 sm:rounded-2xl bg-white transition-shadow hover:shadow-md"
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Question Header */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-slate-900 leading-snug">
                        {question.question}
                      </h3>
                      <p className="text-sm font-medium text-slate-400">
                        {question.multipleAnswers ? "Выберите один или несколько вариантов" : "Выберите один вариант"}
                      </p>
                    </div>
                  </div>

                  {/* Question Audio */}
                  {/* @ts-ignore */}
                  {question.questionAudio && (
                    <div className="mt-6 w-full flex justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <audio controls className="w-full max-w-2xl">
                        {/* @ts-ignore */}
                        <source src={question.questionAudio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Question Video */}
                  {/* @ts-ignore */}
                  {question.questionVideo && (
                    <div className="mt-6 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                      <video controls className="w-full max-h-[600px] mx-auto bg-black">
                        {/* @ts-ignore */}
                        <source src={question.questionVideo} type="video/mp4" />
                        Your browser does not support the video element.
                      </video>
                    </div>
                  )}

                  {/* Question Image */}
                  {question.questionImage && (
                    <div className="mt-6 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                      <div className="w-full flex items-center justify-center bg-white p-2">
                        <img
                          src={question.questionImage}
                          alt="Question Visual"
                          className="w-full h-auto object-contain max-h-[600px] rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Options Grid */}
                <div className={cn(
                  "grid gap-3",
                  question.options.some(opt => opt.image) ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                )}>
                  {question.options.map((option) => {
                    const isChecked = (answers[question.id] || []).includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group",
                          isChecked
                            ? "border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(var(--primary),1)]"
                            : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <input
                          type={question.multipleAnswers ? "checkbox" : "radio"}
                          name={question.id}
                          value={option.id}
                          checked={isChecked}
                          onChange={() => handleAnswerChange(question.id, option.id, question.multipleAnswers)}
                          className="sr-only"
                        />

                        <div className="flex w-full gap-4">
                          {/* Custom Checkbox/Radio Indicator */}
                          <div className={cn(
                            "flex-shrink-0 w-5 h-5 mt-0.5 rounded border transition-colors flex items-center justify-center",
                            question.multipleAnswers ? "rounded-md" : "rounded-full",
                            isChecked
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-slate-300 group-hover:border-slate-400 bg-white"
                          )}>
                            {isChecked && (
                              <div className={cn(
                                "bg-current",
                                question.multipleAnswers ? "w-3 h-3 rounded-sm" : "w-2.5 h-2.5 rounded-full"
                              )} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className={cn(
                              "block text-base transition-colors",
                              isChecked ? "font-medium text-slate-900" : "text-slate-700"
                            )}>
                              {option.text}
                            </span>

                            {option.image && (
                              <div className="mt-3 rounded-lg overflow-hidden border border-slate-100 bg-white">
                                <img
                                  src={option.image}
                                  alt="Option Visual"
                                  className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}

          {/* Submit Action */}
          <div className="sticky bottom-6 z-40 flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitted || isSubmitting}
              className="min-w-[200px] h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              {isSubmitting ? "Отправка..." : isSubmitted ? "Отправлено" : "Завершить тест"}
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizTestPage;

