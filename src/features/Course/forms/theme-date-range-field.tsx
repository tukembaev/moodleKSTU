import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarClock, Infinity as InfinityIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { FieldLabel } from "shared/components/FieldLabel";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import { Calendar } from "shared/shadcn/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/shadcn/ui/popover";

export type ThemeDateTimestamp = number | string | null | undefined;

export type ThemeScheduleValue = {
  opening_date: number | null;
  deadline: number | null;
};

export const OPEN_ENDED_SCHEDULE: ThemeScheduleValue = {
  opening_date: null,
  deadline: null,
};

const toDate = (value: ThemeDateTimestamp): Date | undefined => {
  if (value == null || value === "") return undefined;
  const numeric =
    typeof value === "number"
      ? value
      : Number(value) && !Number.isNaN(Number(value)) && /^\d+$/.test(String(value).trim())
        ? Number(value)
        : NaN;
  const date =
    Number.isFinite(numeric) && numeric > 0
      ? new Date(numeric < 1e12 ? numeric * 1000 : numeric)
      : new Date(value as string);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const startOfDayMs = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.getTime();
};

const endOfDayMs = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next.getTime();
};

export const timestampsToDateRange = (
  openingDate: ThemeDateTimestamp,
  deadline: ThemeDateTimestamp
): DateRange | undefined => {
  const from = toDate(openingDate);
  const to = toDate(deadline);
  if (!from && !to) return undefined;
  return { from: from ?? to, to };
};

export const dateRangeToTimestamps = (range?: DateRange): ThemeScheduleValue => {
  if (!range?.from && !range?.to) return OPEN_ENDED_SCHEDULE;

  return {
    opening_date: range.from ? startOfDayMs(range.from) : null,
    deadline: range.to
      ? endOfDayMs(range.to)
      : range.from
        ? endOfDayMs(range.from)
        : null,
  };
};

export const toThemeTimestamp = (
  value: ThemeDateTimestamp
): number | null => {
  const date = toDate(value);
  return date ? date.getTime() : null;
};

interface ThemeDateRangeFieldProps {
  openingDate?: ThemeDateTimestamp;
  deadline?: ThemeDateTimestamp;
  onChange: (dates: ThemeScheduleValue) => void;
  className?: string;
  compact?: boolean;
}

export const ThemeDateRangeField = ({
  openingDate,
  deadline,
  onChange,
  className,
  compact = false,
}: ThemeDateRangeFieldProps) => {
  const selected = timestampsToDateRange(openingDate, deadline);
  const hasDates = Boolean(selected?.from);
  const [mode, setMode] = useState<"open-ended" | "range">(
    hasDates ? "range" : "open-ended"
  );

  useEffect(() => {
    if (hasDates) setMode("range");
  }, [hasDates]);

  const isOpenEnded = mode === "open-ended";

  const label =
    selected?.from && selected?.to
      ? `${format(selected.from, "d MMM yyyy", { locale: ru })} — ${format(selected.to, "d MMM yyyy", { locale: ru })}`
      : selected?.from
        ? `${format(selected.from, "d MMM yyyy", { locale: ru })} — …`
        : "Выберите начало и конец периода";

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <FieldLabel htmlFor="theme-schedule">Срок доступа</FieldLabel>
      <div className="grid w-full min-w-0 grid-cols-2 gap-1 rounded-lg border bg-muted/40 p-1">
        <button
          type="button"
          id="theme-schedule"
          className={cn(
            "inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium sm:text-sm",
            isOpenEnded
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => {
            setMode("open-ended");
            onChange(OPEN_ENDED_SCHEDULE);
          }}
        >
          <InfinityIcon className="size-3.5 shrink-0" />
          Открыт всегда
        </button>
        <button
          type="button"
          className={cn(
            "inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium sm:text-sm",
            !isOpenEnded
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setMode("range")}
        >
          <CalendarClock className="size-3.5 shrink-0" />
          С датами
        </button>
      </div>

      {isOpenEnded ? (
        <p className="text-xs text-muted-foreground">
          Тема всегда открыта: дата открытия и дедлайн не задаются.
        </p>
      ) : compact ? (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarClock className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={selected}
                onSelect={(range) => {
                  if (!range?.from) return;
                  onChange(dateRangeToTimestamps(range));
                }}
                numberOfMonths={1}
                defaultMonth={selected?.from}
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Начало — дата открытия, конец — дедлайн.
          </p>
        </>
      ) : (
        <div className="min-w-0 overflow-hidden rounded-lg border bg-background">
          <Calendar
            mode="range"
            selected={selected}
            onSelect={(range) => {
              if (!range?.from) return;
              onChange(dateRangeToTimestamps(range));
            }}
            numberOfMonths={1}
            defaultMonth={selected?.from}
            className="w-full max-w-full p-2"
            classNames={{
              months: "flex w-full min-w-0 flex-col",
              month: "flex w-full min-w-0 flex-col gap-3",
              caption:
                "flex w-full items-center justify-center pt-1 relative px-9",
              table: "w-full min-w-0 border-collapse",
              head_row: "flex w-full",
              head_cell:
                "text-muted-foreground rounded-md flex-1 min-w-0 font-normal text-[0.7rem]",
              row: "flex w-full mt-1",
              cell: "relative flex-1 min-w-0 p-0 text-center text-sm",
              day: "inline-flex h-8 w-full items-center justify-center rounded-md p-0 text-sm font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
            }}
          />
          <p className="border-t px-3 py-2 text-xs text-muted-foreground">
            {label}. Начало — дата открытия, конец — дедлайн.
          </p>
        </div>
      )}
    </div>
  );
};
