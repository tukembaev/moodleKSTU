import { format, isSameDay, isSameMonth, startOfMonth } from "date-fns";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Button as DayButton,
  useDayRender,
  type DateRange,
  type DayContentProps,
  type DayProps,
} from "react-day-picker";
import { getDateLocale } from "shared/config/i18n/dateLocale";
import { cn } from "shared/lib/utils";
import { Calendar } from "shared/shadcn/ui/calendar";
import { buttonVariants } from "shared/shadcn/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "shared/shadcn/ui/hover-card";
import { formatThemeSpan, themeRange, typeLabel } from "../model/today";
import { TodayCourse, TodayTheme } from "../model/types";

type TodayCalendarProps = {
  courses: TodayCourse[];
  themes: TodayTheme[];
  onOpenTheme: (theme: TodayTheme) => void;
};

type CalendarEvents = {
  courses: TodayCourse[];
  themes: TodayTheme[];
  highlightedId: string | null;
  setHighlightedId: (id: string | null) => void;
  onOpenTheme: (theme: TodayTheme) => void;
};

const CalendarEventsContext = createContext<CalendarEvents | null>(null);

function useCalendarEvents() {
  const value = useContext(CalendarEventsContext);
  if (!value) throw new Error("Calendar events are missing");
  return value;
}

function openingsOnDay(themes: TodayTheme[], day: Date, month: Date) {
  if (!isSameMonth(day, month)) return [];
  return themes.filter(
    (theme) => theme.opening != null && isSameDay(theme.opening, day)
  );
}

function EventDayContent({ date, displayMonth }: DayContentProps) {
  const { courses, themes, highlightedId } = useCalendarEvents();
  const openings = openingsOnDay(themes, date, displayMonth);
  const courseIds = courses
    .map((course) => course.id)
    .filter((id) => openings.some((theme) => theme.courseId === id));
  const showDots = courseIds.length > 0 && !highlightedId;

  return (
    <span className="relative flex size-full items-center justify-center">
      <span className={cn("leading-none", showDots && "-translate-y-0.5")}>
        {format(date, "d")}
      </span>
      {showDots && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0.5 flex items-center justify-center gap-0.5">
          {courseIds.slice(0, 3).map((id) => (
            <span
              key={id}
              className="size-1 rounded-full"
              style={{
                backgroundColor: courses.find((course) => course.id === id)?.color,
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
}

function EventDay(props: DayProps) {
  const { t, i18n } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dayRender = useDayRender(
    props.date,
    props.displayMonth,
    buttonRef as RefObject<HTMLButtonElement>
  );
  const { courses, themes, highlightedId, setHighlightedId, onOpenTheme } =
    useCalendarEvents();

  if (dayRender.isHidden) {
    return <div role="gridcell" />;
  }
  if (!dayRender.isButton) {
    return <div {...dayRender.divProps} />;
  }

  const openings = openingsOnDay(themes, props.date, props.displayMonth);
  const button = (
    <DayButton name="day" ref={buttonRef} {...dayRender.buttonProps} />
  );
  if (!openings.length) return button;

  const grouped = courses
    .map((course) => ({
      course,
      items: openings.filter((theme) => theme.courseId === course.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <HoverCard
      openDelay={120}
      closeDelay={80}
      onOpenChange={(open) => {
        if (!open) setHighlightedId(null);
      }}
    >
      <HoverCardTrigger asChild>{button}</HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="center"
        sideOffset={8}
        avoidCollisions={false}
        className="w-80 overflow-visible p-2"
      >
        <p className="px-2 pb-1 text-xs text-muted-foreground">
          {t("Открывается {{date}}", {
            date: format(props.date, "d MMMM", {
              locale: getDateLocale(i18n.language),
            }),
          })}
        </p>
        <div className="flex flex-col gap-2">
          {grouped.map((group) => (
            <div key={group.course.id}>
              <p className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: group.course.color }}
                />
                {group.course.title}
              </p>
              {group.items.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left hover:bg-accent",
                    highlightedId === theme.id && "bg-accent"
                  )}
                  onMouseEnter={() => setHighlightedId(theme.id)}
                  onFocus={() => setHighlightedId(theme.id)}
                  onClick={() => onOpenTheme(theme)}
                >
                  <span className="text-sm">
                    <span className="mr-1.5 text-muted-foreground">
                      {typeLabel(theme.typeLess)}
                    </span>
                    {theme.title}
                  </span>
                  {formatThemeSpan(theme) && (
                    <span className="text-xs text-muted-foreground">
                      {formatThemeSpan(theme)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function TodayCalendar({
  courses,
  themes,
  onOpenTheme,
}: TodayCalendarProps) {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const highlighted = themes.find((theme) => theme.id === highlightedId) ?? null;
  const range: DateRange | undefined = useMemo(
    () => (highlighted ? themeRange(highlighted) ?? undefined : undefined),
    [highlighted]
  );

  const events = useMemo<CalendarEvents>(
    () => ({
      courses,
      themes,
      highlightedId,
      setHighlightedId,
      onOpenTheme,
    }),
    [courses, themes, highlightedId, onOpenTheme]
  );

  return (
    <CalendarEventsContext.Provider value={events}>
      <section className="rounded-2xl border bg-card">
        <Calendar
          mode="range"
          month={month}
          onMonthChange={(next) => {
            setHighlightedId(null);
            setMonth(startOfMonth(next));
          }}
          selected={range}
          onSelect={() => undefined}
          numberOfMonths={1}
          weekStartsOn={1}
          className="w-full bg-transparent p-3"
          classNames={{
            months: "flex w-full flex-col",
            month: "flex w-full flex-col gap-4",
            caption: "relative flex w-full items-center justify-center pt-1",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell:
              "flex-1 text-center font-normal text-[0.8rem] text-muted-foreground",
            row: "mt-2 flex w-full",
            cell: cn(
              "relative flex flex-1 items-center justify-center p-0 text-center text-sm focus-within:relative focus-within:z-50 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
              "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            ),
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "relative mx-auto size-8 p-0 font-normal aria-selected:opacity-100"
            ),
          }}
          components={{
            Day: EventDay,
            DayContent: EventDayContent,
          }}
        />
        <p className="px-3 pb-3 text-[11px] leading-snug text-muted-foreground">
          {t(
            "Точка — день открытия. Наведите на задание, чтобы увидеть срок до дедлайна."
          )}
        </p>
      </section>
    </CalendarEventsContext.Provider>
  );
}
