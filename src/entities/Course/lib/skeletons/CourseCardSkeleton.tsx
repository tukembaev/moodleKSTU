import { Skeleton } from "shared/shadcn/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="flex min-w-1/3 flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm">
      <div className="rounded-xl bg-muted/70 p-4 dark:bg-muted/40">
        <Skeleton className="h-7 w-3/4 rounded-md" />
        <div className="mt-4 flex items-center gap-3 rounded-lg border bg-background/80 px-3 py-2.5">
          <Skeleton className="size-9 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-3 w-14 rounded-md" />
            <Skeleton className="mt-1.5 h-4 w-2/3 rounded-md" />
          </div>
        </div>
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
