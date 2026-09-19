import { Building2, ChevronRight } from "lucide-react";
import {
  compareRu,
  coursesCountLabel,
  Department,
  filesCountLabel,
  teachersCountLabel,
} from "entities/Department";
import { StatChip } from "./workload-shared";

interface DepartmentCardsProps {
  departments: Department[];
  onSelect: (department: Department) => void;
}

export function DepartmentCards({
  departments,
  onSelect,
}: DepartmentCardsProps) {
  const sorted = [...departments].sort((a, b) => compareRu(a.name, b.name));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map((department) => {
        const letter = (department.name || "?").trim().charAt(0).toUpperCase();
        return (
          <button
            key={department.id}
            type="button"
            onClick={() => onSelect(department)}
            className="group relative overflow-hidden rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:border-foreground/15 hover:shadow-md"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-3 -right-1 select-none text-7xl font-bold leading-none text-foreground/[0.06]"
            >
              {letter}
            </span>
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Building2 className="size-4 text-muted-foreground" />
              </div>
              <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="relative mt-3 text-base font-semibold leading-snug tracking-tight">
              {department.name}
            </h3>
            <div className="relative mt-2 flex flex-wrap gap-1.5">
              <StatChip>{teachersCountLabel(department.teachers_count)}</StatChip>
              <StatChip>{coursesCountLabel(department.courses_count)}</StatChip>
              <StatChip>{filesCountLabel(department.files_count)}</StatChip>
            </div>
          </button>
        );
      })}
    </div>
  );
}
