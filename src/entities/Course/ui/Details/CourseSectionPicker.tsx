import { Check } from "lucide-react";
import { useState } from "react";
import type { IconType } from "react-icons";
import { MobileBottomSheet } from "shared/components";
import { cn } from "shared/lib/utils";

export interface CourseSection {
  name: string;
  value: string;
  icon: IconType;
  count?: number;
}

interface CourseSectionPickerProps {
  sections: CourseSection[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Мобильная замена горизонтальным табам курса: 6 разделов не влезают в ряд,
 * поэтому активный раздел — иконка в шапке, а полный список открывается
 * нижним шитом с названиями.
 */
export function CourseSectionPicker({
  sections,
  activeValue,
  onChange,
  className,
}: CourseSectionPickerProps) {
  const [open, setOpen] = useState(false);
  const active = sections.find((s) => s.value === activeValue) ?? sections[0];

  if (!active) return null;

  const ActiveIcon = active.icon;
  const activeIndex = sections.indexOf(active);

  const select = (value: string) => {
    setOpen(false);
    onChange(value);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${active.name}, раздел ${activeIndex + 1} из ${sections.length}`}
        title={active.name}
        className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card text-primary shadow-sm transition-colors active:bg-accent/60"
      >
        <ActiveIcon className="size-5" />
      </button>

      <MobileBottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Разделы курса"
        description="Выберите, что открыть"
      >
        <ul>
          {sections.map(({ name, value, icon: Icon, count = 0 }) => {
            const isActive = value === activeValue;
            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => select(value)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex min-h-13 w-full items-center gap-3 px-4 text-left transition-colors active:bg-accent/60",
                    isActive && "bg-accent/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm",
                      isActive ? "font-semibold text-primary" : "font-medium"
                    )}
                  >
                    {name}
                  </span>
                  {count > 0 && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </MobileBottomSheet>
    </div>
  );
}
