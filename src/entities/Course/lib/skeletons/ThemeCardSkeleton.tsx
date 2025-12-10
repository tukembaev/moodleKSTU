import { Skeleton } from "shared/shadcn/ui/skeleton";

const ThemeCardSkeleton = () => {
  return (
    <div className="flex flex-col border rounded-xl py-6 px-5 justify-between transition-all duration-300 lg:col-span-1">
      <div className="flex flex-col pb-2">
        <div className="flex items-center justify-between py-2">
          <Skeleton className="w-24 h-5 rounded-md mb-2" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 mt-2 rounded-md" />
      </div>
    </div>
  );
};

export default ThemeCardSkeleton;
