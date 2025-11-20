import {
  ArrowUpRight,
  CreditCard,
  MessageCircle,
  ShoppingCart,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "shared/lib/utils";

interface Activity {
  id: string;
  title: string;
  amount: string;
  type: "incoming" | "outgoing";
  category: string;
  icon: LucideIcon;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  isCurrent?: boolean;
}

interface List02Props {
  activities?: Activity[];
  className?: string;
}

const categoryStyles = {
  course: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
  test: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100",
  file: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
  analytics:
    "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
  message:
    "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100",
};

const ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "Создан новый курс: React для начинающих",
    amount: "",
    type: "incoming",
    category: "course",
    icon: Wallet,
    timestamp: "Сегодня, 10:00",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "2",
    title: "Добавлен тест по теме useEffect",
    amount: "",
    type: "incoming",
    category: "test",
    icon: CreditCard,
    timestamp: "Сегодня, 12:15",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "3",
    title: "Пользователь прикрепил ответ к лабораторной работе",
    amount: "",
    type: "incoming",
    category: "file",
    icon: ShoppingCart,
    timestamp: "Вчера, 18:30",
    status: "pending",
    isCurrent: false,
  },
  {
    id: "4",
    title: "Обновлена статистика по успеваемости студентов",
    amount: "",
    type: "incoming",
    category: "analytics",
    icon: ArrowUpRight,
    timestamp: "Сегодня, 15:40",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "5",
    title: "Тест Google Form прикреплён к теме 'Hooks'",
    amount: "",
    type: "incoming",
    category: "test",
    icon: CreditCard,
    timestamp: "3 дня назад",
    status: "completed",
    isCurrent: false,
  },
  {
    id: "6",
    title: "Добавлен файл 'Лекция по React.memo'",
    amount: "",
    type: "incoming",
    category: "message",
    icon: MessageCircle,
    timestamp: "На прошлой неделе",
    status: "completed",
    isCurrent: false,
  },
];

export default function ActivityList({
  activities = ACTIVITIES,
  className,
}: List02Props) {
  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Недавние активности
          <span className="text-[10px] sm:text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">
            (23 активности)
          </span>
        </h2>
      </div>

      <div className="space-y-1">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={cn(
              "group flex items-center gap-2 sm:gap-3",
              "p-1.5 sm:p-2 rounded-lg",
              "transition-all duration-200"
            )}
          >
            <div
              className={cn(
                "p-1.5 sm:p-2 rounded-lg shrink-0",
                categoryStyles[activity.category as keyof typeof categoryStyles]
              )}
            >
              <activity.icon className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>

            <div className="flex-1 flex items-center justify-between min-w-0">
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {activity.title}
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <p className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400">
                    {activity.timestamp}
                  </p>
                  <span
                    className={cn(
                      "px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-medium shrink-0",
                      categoryStyles[
                        activity.category as keyof typeof categoryStyles
                      ]
                    )}
                  >
                    {activity.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
