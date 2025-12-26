import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { ChevronLeft, BookOpen } from "lucide-react";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "shared/shadcn/ui/card";
import { Badge } from "shared/shadcn/ui/badge";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import ThemeFiles from "entities/Course/ui/Themes/ThemeDetail/ThemeFiles";
import { useAuth } from "shared/hooks";
import { categories, mapTypeLessToCategory } from "entities/Course/model/consts/themeConsts";
import { LuHandCoins } from "react-icons/lu";
import { UseTooltip } from "shared/components";
// import { WeekTheme } from "entities/Course/model/types/course";

const ThemeDetailPage = () => {
  const { themeId, weekId } = useParams<{ themeId: string; weekId: string }>();
  const navigate = useNavigate();
  const auth_data = useAuth();

  // Fetch week themes to find the specific theme
  const { data: weekThemes, isLoading } = useQuery(
    courseQueries.weekThemes(weekId || null)
  );

  // Find the specific theme from the week themes
  const theme = weekThemes?.find(t => t.id === themeId);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-2">Тема не найдена</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Запрошенная тема не существует или была удалена
                </p>
              </div>
              <Button onClick={handleGoBack} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Вернуться назад
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryKey = mapTypeLessToCategory(theme.type_less);
  const category = categories.find((c) => c.key === categoryKey);

  return (
    <div className="min-h-screen w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className="mb-4 sm:mb-6 -ml-2 touch-manipulation min-h-[44px]"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад к курсу
        </Button>

        {/* Theme Header Card */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge className={`gap-2 ${category?.badgeClass || ""}`}>
                <span className={category?.iconClass}>{category?.icon}</span>
                <span>{category?.title}</span>
              </Badge>
              
              {theme.locked && (
                <Badge className="bg-gray-300 text-primary">
                  Доступ ограничен
                </Badge>
              )}

              {auth_data.isStudent && (
                <div className="ml-auto">
                  {theme.status ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                      {theme.result} балла
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">
                      Не сдано
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {theme.title}
            </CardTitle>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {theme.description}
            </p>

            {/* Theme Meta Information */}
            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 sm:pt-4 border-t">
              {theme.max_points && (
                <UseTooltip text="Максимальное количество балла">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <LuHandCoins className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                    <span className="font-medium">{theme.max_points} баллов</span>
                  </div>
                </UseTooltip>
              )}

              {theme.type_less && (
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="font-medium">Тип: {theme.type_less}</span>
                </div>
              )}

              {theme.deadline && (
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-medium text-muted-foreground">
                    Срок: {new Date(theme.deadline).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Theme Content */}
        {!theme.locked ? (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <ThemeFiles id={theme.id} isOwner={!auth_data.isStudent} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Доступ ограничен</h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                    Эта тема пока недоступна. Пожалуйста, свяжитесь с преподавателем для получения доступа.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ThemeDetailPage;
