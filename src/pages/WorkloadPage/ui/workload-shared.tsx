import { ChevronLeft, Search } from "lucide-react";
import type { ReactNode } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Input } from "shared/shadcn/ui/input";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { cn } from "shared/lib/utils";

export function WorkloadSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
    </div>
  );
}

export function WorkloadBackBar({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-start gap-2">
      <button
        type="button"
        onClick={onBack}
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card transition-colors hover:bg-accent"
        aria-label="Назад"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export function WorkloadListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-[4.5rem] w-full rounded-xl" />
      ))}
    </div>
  );
}

export function WorkloadCardSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <Skeleton key={index} className="h-36 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function WorkloadError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center">
      <p className="font-medium text-destructive">Не удалось загрузить данные</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function WorkloadEmpty({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function StatChip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
