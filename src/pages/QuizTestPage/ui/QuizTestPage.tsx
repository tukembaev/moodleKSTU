import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { LuClock, LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { quizData } from "shared/mocks/testMock";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "shared/shadcn/ui/card";

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
  const getTimerColor = () => {
    if (timePercentage > 50) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (timePercentage > 20) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200 animate-pulse";
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

    setIsSubmitted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
                    <div className="flex justify-between mt-1">
                      <span>Конец:</span>
                      <span>{format(new Date(quizData.deadline), "dd MMM", { locale: ru })}</span>
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
    <div className="min-h-screen bg-slate-50/50 font-sans">
      {/* Sticky Timer Header */}
      <div className="sticky top-0 z-50 pointer-events-none">
        <div className="absolute w-full h-24 bg-linear-to-b from-slate-50/90 to-transparent pointer-events-none" />
        <div className="container max-w-4xl mx-auto px-4 pt-4 flex justify-center relative">
          <div
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-xl border transition-all duration-500",
              getTimerColor()
            )}
          >
            <LuClock className="w-5 h-5 animate-pulse" />
            <div className="flex flex-col items-center leading-none">
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Осталось</span>
              <span className="font-mono text-lg font-bold tabular-nums">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                disabled={isSubmitted}
                className="min-w-[200px] h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                {isSubmitted ? "Отправка..." : "Завершить тест"}
              </Button>
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizTestPage;

