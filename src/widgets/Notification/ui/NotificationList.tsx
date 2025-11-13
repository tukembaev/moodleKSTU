import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";

// Мок-данные для уведомлений
const mockNotifications = [
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

const NotificationList = () => {
  return (
    <Card className="h-full border-0 shadow-none py-0">
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <h2 className="text-xl font-semibold">Уведомления</h2>
        <div className="flex-1 overflow-y-auto flex flex-col gap-6 ">
          {mockNotifications.map((notification) => (
            <Link to={`/notification/${notification.id}`} key={notification.id}>
              <Button
                variant="outline"
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent w-full",
                  "min-h-[140px] bg-muted"
                )}
                isAnimated={false}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {notification.sender}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.date, {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </span>
                  </div>
                  <div className="text-xs font-medium ">
                    {notification.title}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground break-words whitespace-pre-wrap">
                  {notification.message}
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationList;
