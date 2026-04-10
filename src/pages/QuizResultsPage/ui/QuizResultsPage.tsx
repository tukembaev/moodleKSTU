import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "shared/shadcn/ui/card";
import { Button } from "shared/shadcn/ui/button";
import { LuX, LuArrowLeft, LuCheck } from "react-icons/lu";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { TestSubmissionResponse, TestDetails } from "entities/Test/model/types/test";

interface QuizResultsState {
  results: TestSubmissionResponse;
  quizData: TestDetails;
}

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as QuizResultsState | null;

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

  const { results, quizData } = state;

  // Время прохождения
  const minutesSpent = Math.floor(results.timeSpent / 60);
  const secondsSpent = results.timeSpent % 60;

  // Дата прохождения теста
  const completionDate = new Date(results.completionDate);

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
            <p className="text-2xl sm:text-3xl font-bold">{results.totalQuestions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Правильные</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {results.correctAnswers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Неправильные</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-3xl font-bold text-red-600">
              {results.incorrectAnswers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg">Пропущено</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              {results.skippedQuestions}
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

      {/* Детали ответов - показывается только если есть detailedResults */}
      {results.detailedResults && results.detailedResults.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Ваши ответы</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Просмотрите все вопросы и ваши ответы
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 pt-0">
            {results.detailedResults.map((result, index) => {
              const hasAnswer = result.selectedOptions.length > 0;

              return (
                <div
                  key={result.questionId}
                  className="border rounded-lg p-3 sm:p-4"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="font-semibold flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base break-words">{result.questionText}</p>
                      {result.questionImage && (
                        <img
                          src={result.questionImage}
                          alt="Question"
                          className="mt-2 w-full max-w-full sm:max-w-md rounded-lg object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div className="ml-4 sm:ml-6 space-y-3">
                    {!hasAnswer ? (
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <LuX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">Вопрос пропущен</span>
                      </div>
                    ) : (
                      <>
                        {/* Ваш ответ */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs sm:text-sm font-medium">Ваш ответ:</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            {result.selectedOptions.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-start gap-2 p-2 rounded bg-blue-50 border border-blue-200"
                              >
                                <div className="w-2 h-2 rounded-full mt-1.5 bg-blue-600 flex-shrink-0" />
                                <span className="font-medium text-sm sm:text-base break-words">
                                  {option.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Правильный ответ */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {result.isCorrect ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <LuCheck className="h-4 w-4" />
                                <span className="text-xs sm:text-sm font-medium">Правильно!</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-600">
                                <LuX className="h-4 w-4" />
                                <span className="text-xs sm:text-sm font-medium">Неправильно. Правильный ответ:</span>
                              </div>
                            )}
                          </div>
                          {!result.isCorrect && (
                            <div className="flex flex-col gap-2">
                              {result.correctOptions.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-start gap-2 p-2 rounded bg-green-50 border border-green-200"
                                >
                                  <div className="w-2 h-2 rounded-full mt-1.5 bg-green-600 flex-shrink-0" />
                                  <span className="font-medium text-sm sm:text-base break-words">
                                    {option.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
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

