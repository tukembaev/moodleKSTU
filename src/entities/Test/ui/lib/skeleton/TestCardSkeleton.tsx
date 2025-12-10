import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const TestCardSkeleton = () => {
  return (
    <Card className="min-h-68 flex flex-col justify-between">
      <div className="flex flex-col w-full">
        <CardHeader className="text-lg font-semibold w-full break-all">
          <Skeleton className="h-6 w-24 mb-3" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 w-fit">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2 w-fit">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2 w-fit">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </div>
    </Card>
  );
};

export default TestCardSkeleton;
