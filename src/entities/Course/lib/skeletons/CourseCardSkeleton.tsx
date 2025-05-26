import { Skeleton } from "shared/shadcn/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="flex flex-col border rounded-xl py-6 px-5 justify-between min-w-1/3">
      <div className="flex items-center justify-between py-2">
        <Skeleton className="w-20 h-5 rounded-md" />
        <Skeleton className="w-10 h-5 rounded-md" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 mt-2 rounded-md" />
      <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />

      <div className="mt-6 flex items-center justify-between align-middle">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-3 w-16 mt-1 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
