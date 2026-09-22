import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Pin } from "lucide-react";
import { TodayAnnouncement, TodayCourse } from "../model/types";

type TodayFeedProps = {
  items: TodayAnnouncement[];
  courses: TodayCourse[];
  onOpen: (item: TodayAnnouncement) => void;
};

export function TodayFeed({ items, courses, onOpen }: TodayFeedProps) {
  const sorted = [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold">Объявления</h2>
      {sorted.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          Объявлений нет
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {sorted.map((item) => {
            const course = courses.find((entry) => entry.id === item.courseId);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onOpen(item)}
                  className="flex w-full flex-col gap-1 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: course?.color }}
                    />
                    <span className="truncate">{course?.title}</span>
                    {item.pinned && (
                      <span className="ml-auto inline-flex items-center gap-1">
                        <Pin className="size-3" />
                        Закреплено
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-3 text-sm">{item.text}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.author} ·{" "}
                    {format(item.createdAt, "d MMM, HH:mm", { locale: ru })}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
