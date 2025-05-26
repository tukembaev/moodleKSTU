import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { Calendar } from "lucide-react";
import {
  LuFlaskConical,
  LuHammer,
  LuIdCard,
  LuNotebookPen,
  LuPuzzle,
  LuShapes,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";

export default function BriefUserProgress({ user_id }: { user_id: number }) {
  const { id } = useParams();
  const { data } = useQuery(courseQueries.allStudentPerfomance(id as string));
  //   const data = [
  //     {
  //       id: "5560d3ac-bdb1-4922-b0d4-799b68581fc0",
  //       user_id: 47095,
  //       first_name: "Нурбеков",
  //       last_name: "Бексултан",
  //       avatar:
  //         "https://utask.kstu.kg/media/avatars/photo_2024-07-17_12-59-25.jpg",
  //       group: "ПИ-1-23",
  //       is_end: true,
  //       themes: {
  //         pr: [
  //           { id: "1", title: "Практика 1", stud_points: 6 },
  //           { id: "2", title: "Практика 2", stud_points: null },
  //         ],
  //         lb: [
  //           { id: "3", title: "Лабораторная 1", stud_points: 9 },
  //           { id: "4", title: "Лабораторная 2", stud_points: null },
  //         ],
  //         srs: [{ id: "5", title: "СРС", stud_points: null }],
  //         other: [
  //           { id: "6", title: "Дополнительный материал", stud_points: null },
  //         ],
  //       },
  //     },
  //   ];

  const user_progress = data?.find((u) => u.user_id === user_id);

  const themesMap = {
    pr: {
      title: "Практика",
      icon: <LuHammer className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />,
    },
    lb: {
      title: "Лабораторные",
      icon: (
        <LuFlaskConical className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
      ),
    },
    srs: {
      title: "СРС",
      icon: (
        <LuNotebookPen className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
      ),
    },
    tests: {
      title: "Тесты",
      icon: <LuShapes className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />,
    },
    other: {
      title: "Прочее",
      icon: <LuPuzzle className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />,
    },
  };

  return (
    <div className="min-w-md ">
      <div
        className={cn(
          "relative overflow-hidden",
          "bg-white/50 dark:bg-zinc-900/50",
          "transition-all duration-300",
          "hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-zinc-900/20",
          "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
          "p-2"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div
              className={cn(
                "w-16 h-16 rounded-xl overflow-hidden",
                "ring-2 ring-zinc-100 dark:ring-zinc-800"
              )}
            >
              <img
                src={user_progress?.avatar}
                alt={"avatar"}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {user_progress?.first_name} {user_progress?.last_name}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-0.5">
              {user_progress?.group}
            </p>
            {user_progress?.is_end ? (
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
                  "bg-emerald-50 dark:bg-emerald-900/20",
                  "text-emerald-600 dark:text-emerald-400",
                  "text-xs font-medium"
                )}
              >
                <Calendar className="w-3 h-3" />
                Окончил курс
              </div>
            ) : (
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
                  "bg-blue-50 dark:bg-emerald-900/20",
                  "text-blue-600 dark:text-blue-400",
                  "text-xs font-medium"
                )}
              >
                <Calendar className="w-3 h-3" />В процессе
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3.5 py-2">
          {Object.entries(user_progress?.themes || {}).map(
            ([key, value]: [string, any]) => (
              <div
                key={key}
                className={cn(
                  "flex items-center gap-3",
                  "p-2 rounded-xl",

                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "transition-colors duration-200"
                )}
              >
                {themesMap[key as keyof typeof themesMap]?.icon}
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {themesMap[key as keyof typeof themesMap]?.title || key}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(value.length)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 rounded-full flex-1",
                          value[i]?.stud_points
                            ? "bg-emerald-600 dark:bg-emerald-400"
                            : "bg-zinc-200 dark:bg-zinc-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <Button
          variant="default"
          size="sm"
          className={cn(
            "w-full",
            "bg-zinc-900 dark:bg-zinc-100",
            "hover:bg-zinc-700 dark:hover:bg-zinc-300",
            "text-white dark:text-zinc-900",
            "shadow-xs"
          )}
        >
          <LuIdCard className="w-4 h-4 mr-2" />
          Открыть профиль
        </Button>
      </div>
    </div>
  );
}
