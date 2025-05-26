import { Skeleton } from "shared/shadcn/ui/skeleton";

const SearchLoader = () => {
  return (
    <div className="flex flex-col p-2 gap-2">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-1/4" />
        {Array.from({ length: 3 }).map(() => (
          <div className="flex gap-2">
            <Skeleton className="h-6 w-1/12 rounded-sm" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-1/6" />
        {Array.from({ length: 2 }).map(() => (
          <div className="flex gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/12 rounded-sm" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-1/8" />
        {Array.from({ length: 2 }).map(() => (
          <div className="flex gap-2">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchLoader;
