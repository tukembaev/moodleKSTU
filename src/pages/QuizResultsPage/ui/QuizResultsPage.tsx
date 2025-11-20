import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "shared/shadcn/ui/card";
import { Button } from "shared/shadcn/ui/button";
import { LuX, LuArrowLeft } from "react-icons/lu";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Answer {
  questionId: string;
  selectedOptions: string[];
}

interface QuizResultsState {
  answers: Answer[];
  quizData: typeof import("shared/mocks/testMock").quizData;
  timeRemaining: number;
}

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as QuizResultsState | null;
  
  // Мок-переменная для управления отображением детальных результатов
  const showDetailedResults = true; // Измените на false, чтобы скрыть детали

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 p-4 sm:p-6">
            <p className="text-center text-muted-foreground text-sm sm:text-base">
              Результаты не найдены
            </p>
            <Button
              className="w-full mt-4"
              onClick={() => navigate("/test")}
            >
              Вернуться к тестам
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { answers, quizData, timeRemaining } = state;

  // Мок-данные для правильных ответов (в реальном приложении должны приходить из API)
  const correctAnswers: Record<string, string[]> = {
    "q_1": ["opt_a"], // Правильный ответ для первого вопроса
    "q_2": ["opt_d", "opt_e", "opt_g"], // Правильные ответы для второго вопроса
  };

  // Подсчет результатов
  const totalQuestions = quizData.questions.length;
  const answeredQuestions = answers.filter(
    (a) => a.selectedOptions.length > 0
  ).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  // Подсчет правильных и неправильных ответов
  let correctCount = 0;
  let incorrectCount = 0;

  answers.forEach((answer) => {
    const correctOptions = correctAnswers[answer.questionId] || [];
    const userOptions = answer.selectedOptions || [];
    
    if (userOptions.length === 0) {
      // Пропущенный вопрос не считается неправильным
      return;
    }

    // Проверяем, совпадают ли выбранные ответы с правильными
    const isCorrect = 
      correctOptions.length === userOptions.length &&
      correctOptions.every(opt => userOptions.includes(opt)) &&
      userOptions.every(opt => correctOptions.includes(opt));

    if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  // Время, потраченное на тест
  const timeSpent = quizData.timeLimit * 60 - timeRemaining;
  const minutesSpent = Math.floor(timeSpent / 60);
  const secondsSpent = timeSpent % 60;

  // Дата прохождения теста
  const completionDate = new Date();

  return (
    <div className="min-h-screen flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 max-w-4xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/test")}
        className="self-start w-full sm:w-auto"
      >
        <LuArrowLeft className="mr-2" />
        Вернуться к тестам
      </Button>

      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Результаты теста</h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">{quizData.title}</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Всего вопросов</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-3xl font-bold">{totalQuestions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Правильные</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {correctCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Неправильные</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-3xl font-bold text-red-600">
              {incorrectCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Пропущено</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              {unansweredQuestions}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Время и дата */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Время прохождения</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-base sm:text-lg">
              {minutesSpent} минут {secondsSpent} секунд
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Из {quizData.timeLimit} минут
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Дата прохождения</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-base sm:text-lg">
              {format(completionDate, "PPP", { locale: ru })}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {format(completionDate, "HH:mm", { locale: ru })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Детали ответов - показывается только если showDetailedResults = true */}
      {showDetailedResults && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Ваши ответы</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Просмотрите все вопросы и ваши ответы
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 pt-0">
            {quizData.questions.map((question: typeof quizData.questions[0], index: number) => {
              const userAnswer = answers.find((a) => a.questionId === question.id);
              const selectedOptions = userAnswer?.selectedOptions || [];
              const hasAnswer = selectedOptions.length > 0;

              return (
                <div
                  key={question.id}
                  className="border rounded-lg p-3 sm:p-4"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-semibold flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base break-words">{question.question}</p>
                      {question.questionImage && (
                        <img
                          src={question.questionImage}
                          alt="Question"
                          className="mt-2 w-full max-w-full sm:max-w-md rounded-lg object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div className="ml-4 sm:ml-6">
                    {hasAnswer ? (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs sm:text-sm font-medium">Ваш ответ:</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <LuX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">Вопрос пропущен</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      {question.options.map((option: typeof question.options[0]) => {
                        const isSelected = selectedOptions.includes(option.id);
                        // Показываем только выбранные пользователем варианты
                        if (!isSelected) return null;
                        
                        return (
                          <div
                            key={option.id}
                            className="flex items-start gap-2 p-2 rounded bg-primary/5 border border-primary/20"
                          >
                            <div className="w-2 h-2 rounded-full mt-1.5 bg-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-sm sm:text-base break-words">
                                {option.text}
                              </span>
                              {option.image && (
                                <img
                                  src={option.image}
                                  alt="Option"
                                  className="mt-1 w-full max-w-full sm:max-w-xs rounded object-contain"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4 pb-4 sm:pb-6">
        <Button onClick={() => navigate("/test")} size="lg" className="w-full sm:w-auto">
          Вернуться к тестам
        </Button>
      </div>
    </div>
  );
};

export default QuizResultsPage;

