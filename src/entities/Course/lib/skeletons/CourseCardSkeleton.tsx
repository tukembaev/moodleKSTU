import { Skeleton } from "shared/shadcn/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="flex min-w-1/3 flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm">
      <div className="rounded-xl bg-muted/70 p-4 dark:bg-muted/40">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-7 w-1/2 rounded-md" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-11 rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-2.5 h-1.5 w-full rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
