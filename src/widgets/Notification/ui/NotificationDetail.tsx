import { useParams } from "react-router-dom";
import { Card, CardContent } from "shared/shadcn/ui/card";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LuCable } from "react-icons/lu";
import { Avatar, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Separator } from "shared/shadcn/ui/separator";

const mockNotifications = [
  // Те же мок-данные, что в NotificationList
  {
    id: "1",
    sender: "Александр Петров",
    title: "Новое задание добавлено",
    message:
      "В курсе 'Методы оптимизации' добавлено новое задание 'Лабораторная работа №3'. Пожалуйста, ознакомьтесь с материалами и сдайте до дедлайна.",
    date: new Date("2025-05-20T10:00:00Z"),
    tags: ["курс", "задание", "важно"],
  },
  {
    id: "2",
    sender: "Елена Смирнова",
    title: "Оценка за СРС",
    message:
      "Ваша работа по СРС в курсе 'Программирование на Python' оценена на 85 баллов. Комментарии преподавателя доступны в профиле курса.",
    date: new Date("2025-05-18T14:30:00Z"),
    tags: ["оценка", "курс"],
  },
  {
    id: "3",
    sender: "Иван Иванов",
    title: "Приглашение на вебинар",
    message:
      "Приглашаем вас на вебинар 'Современные технологии в разработке' 30 мая в 18:00. Зарегистрируйтесь по ссылке в вашем профиле.",
    date: new Date("2025-05-15T09:15:00Z"),
    tags: ["вебинар", "мероприятие"],
  },
];

const NotificationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const notification = mockNotifications.find((n) => n.id === id);

  // const { mutate: rate_answer, isPending } = courseQueries.rate_answer();

  // const [score, setScore] = useState(8);
  // const handleSubmitScore = () => {
  //   rate_answer({
  //     answer: id as string,
  //     points: score,
  //   });
  // };

  if (!notification) {
    return (
      <Card className="h-full border-0 shadow-none">
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            Выберите уведомление
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <Card className="h-full border-0 shadow-none py-0">
      <CardContent className="flex flex-col p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarFallback className="text-xs sm:text-sm">{getInitials(notification.sender)}</AvatarFallback>
          </Avatar>
          <div className="ml-0 sm:ml-4 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <div className="font-semibold text-sm sm:text-base">{notification.sender}</div>
              <div className="text-xs text-muted-foreground">
                {format(notification.date, "d MMMM yyyy, HH:mm", {
                  locale: ru,
                })}
              </div>
            </div>
            <div className="text-xs sm:text-sm font-medium mt-1">{notification.title}</div>
          </div>
        </div>
        <Separator className="my-3 sm:my-4" />
        <div
          className="group flex items-center gap-2 sm:gap-4 p-2 rounded-xl 
                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                    transition-colors duration-200 cursor-pointer"
        >
          <div className="flex-none p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
            <LuCable className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Курс №1
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Лабораторная работа №3
            </p>
          </div>
        </div>

        <Separator className="my-3 sm:my-4" />
        <div className="text-xs sm:text-sm flex-1 break-words whitespace-pre-wrap">{notification.message}</div>
        {/* <Separator className="my-4" />
        <p className="mb-2 text-center">Выставить баллы</p>
        <Separator />

        <GaugeWithSliderSmall
          score={10}
          maxScore={Number(20)}
          onChange={setScore}
        />

        <Button
          className="w-full mt-5 flex gap-2"
          variant={"outline"}
          disabled={isPending}
          onClick={() => handleSubmitScore()}
        >
          Применить
          <LucideWandSparkles />
        </Button> */}

        {/* <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Textarea
            {...register("reply", { required: true })}
            placeholder={`Ответить ${notification.sender}...`}
            className="min-h-[100px] p-4 text-sm"
          />
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" className="ml-auto">
              <LuSend />
              Отправить
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LuX /> Пометить как прочитаное
            </Button>
          </div>
        </form> */}
      </CardContent>
    </Card>
  );
};

export default NotificationDetail;
