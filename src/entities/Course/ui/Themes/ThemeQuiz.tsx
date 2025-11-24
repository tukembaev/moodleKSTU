import Quiz from "features/Quiz/ui/Quiz";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { LuHandCoins, LuPlus } from "react-icons/lu";
import {
  FadeIn,
  HoverLift,
  UseConfirmation,
  UseTooltip,
} from "shared/components";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "shared/shadcn/ui/dialog";

const test_list = [
  {
    id_quiz: "quiz_test",
    title: "mini-test1",
    description: "mini-descr",
    max_points: 4,
    correct_answers: 3,
    question_length: 4,
    status: false,
    is_restart: false,
  },
];

const ThemeQuiz = ({ course_id, course_name , theme_id }: { course_id: string; course_name: string; theme_id: string }) => {
  const { isStudent } = useAuth();
  const openForm = useForm();

  const [open, setOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const handleStartQuiz = (quiz: string) => {
    setSelectedQuiz(quiz);
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent
            className="max-w-2xl"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <Quiz id_quiz={selectedQuiz} onFinish={() => setOpen(false)} />
            {open ? null : <DialogClose />}
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <div className="flex flex-col gap-3">
        <p className="text-lg font-semibold">
          Тесты для закрепления материала
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {test_list?.map((theme) => {
            if (theme.status)
              return (
                <Card key={theme.id_quiz}>
                  <CardHeader>
                    <CardTitle>Результаты теста: {theme.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">
                      Ваш результат: {theme.correct_answers} из{" "}
                      {theme.question_length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Процент правильных ответов:{" "}
                      {(
                        (theme.correct_answers / theme.question_length) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                    {theme.is_restart && (
                      <div className="mt-4 flex gap-4">
                        <Button onClick={() => handleStartQuiz(theme.id_quiz)}>
                          Пройти заново
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            else
              return (
                <Card
                  key={theme.id_quiz}
                  className="transition-all duration-300"
                >
                  <CardContent className="flex flex-col justify-between">
                    <span className="text-lg font-semibold flex gap-2 items-center">
                      {theme.title}
                      {!isStudent ? null : (
                        <Badge variant={"outline"} className="max-h-6">
                          Не сдано
                        </Badge>
                      )}
                    </span>
                    <span className="text-md text-foreground/80">
                      {theme.description}
                    </span>
                    <div className="flex gap-6 text-sm text-foreground/80 items-center py-2">
                      {theme.max_points && (
                        <UseTooltip text="Максимальное количество баллов">
                          <div className="flex items-center gap-2">
                            <LuHandCoins className="h-4 w-4" />
                            <span>{theme.max_points}</span>
                          </div>
                        </UseTooltip>
                      )}
                    </div>
                    <UseConfirmation
                      title="Подтверждение действия"
                      description="Вы уверены, что хотите выполнить это действие? Оно не может быть отменено. Если вы перезагрузите насильно , результаты отправятся как есть."
                      action={() => handleStartQuiz(theme.id_quiz)}
                      cancelText="Отказаться"
                      actionText="Продолжить"
                    >
                      <Button
                        className="shadow-none w-full mt-4"
                        variant="outline"
                      >
                        Пройти тест <ChevronRight />
                      </Button>
                    </UseConfirmation>
                  </CardContent>
                </Card>
              );
          })}

          {!isStudent && (
            <FadeIn className="flex border rounded-xl py-4 px-5 min-w-1/3 justify-center items-center min-h-48 text-center">
              <HoverLift>
                <UseTooltip text="Добавить тест">
                  <div
                    className="flex flex-col justify-center items-center"
                    onClick={() => openForm(FormQuery.ADD_QUIZ, {
                      course_id: course_id, 
                      course_name: course_name,
                      theme_id: theme_id
                    })}
                  >
                    <LuPlus size={35} className="text-muted-foreground" />
                    <p>Добавьте новый тест</p>
                  </div>
                </UseTooltip>
              </HoverLift>
            </FadeIn>
          )}
        </div>
      </div>
    </>
  );
};

export default ThemeQuiz;
