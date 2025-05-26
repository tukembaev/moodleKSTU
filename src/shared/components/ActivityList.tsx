import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
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
  },
  {
    id: "6",
    title: "Добавлен файл 'Лекция по React.memo'",
    amount: "",
    type: "incoming",
    category: "file",
    icon: ShoppingCart,
    timestamp: "На прошлой неделе",
    status: "completed",
  },
];

export default function ActivityList({ activities = ACTIVITIES }: List02Props) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Недавние активности
          <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">
            (23 активности)
          </span>
        </h2>
        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          Этот месяц
        </span>
      </div>

      <div className="space-y-1">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={cn(
              "group flex items-center gap-3",
              "p-2 rounded-lg",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
              "transition-all duration-200"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg",
                categoryStyles[activity.category as keyof typeof categoryStyles]
              )}
            >
              <activity.icon className="w-4 h-4" />
            </div>

            <div className="flex-1 flex items-center justify-between min-w-0">
              <div className="space-y-0.5">
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {activity.title}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    {activity.timestamp}
                  </p>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium",
                      categoryStyles[
                        activity.category as keyof typeof categoryStyles
                      ]
                    )}
                  >
                    {activity.category}
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center gap-1.5 pl-3">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      transaction.type === "incoming"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {transaction.type === "incoming" ? "+" : "-"}
                    {transaction.amount}
                  </span>
                  {transaction.type === "incoming" ? (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  )}
                </div> */}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4  border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 px-3 rounded-lg",
            "text-xs font-medium",
            "bg-gradient-to-r from-zinc-900 to-zinc-800",
            "dark:from-zinc-50 dark:to-zinc-200",
            "text-zinc-50 dark:text-zinc-900",
            "hover:from-zinc-800 hover:to-zinc-700",
            "dark:hover:from-zinc-200 dark:hover:to-zinc-300",
            "shadow-sm hover:shadow",
            "transform transition-all duration-200",
            "hover:-translate-y-0.5",
            "active:translate-y-0",
            "focus:outline-none focus:ring-2",
            "focus:ring-zinc-500 dark:focus:ring-zinc-400",
            "focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          )}
        >
          <span>Открыть все активности</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
}
