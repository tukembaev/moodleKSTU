import { SpringPopup } from "shared/components";
import { Card } from "shared/shadcn/ui/card";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const UserCardSkeleton = () => {
  return (
    <Card className="relative w-full p-4 md:p-6 rounded-3xl md:rounded-4xl shadow-md bg-gradient-to-r from-transparent from-10% via-sky-200 via-90% to-sky-300 to-100%">
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-16 px-4 md:pl-20 py-4 md:py-6">
        <SpringPopup>
          <Skeleton className="w-32 h-32 md:w-64 md:h-64 rounded-full border-2 md:border-4 border-white shadow-md" />
        </SpringPopup>
        <SpringPopup>
          <div className="flex flex-col items-center md:items-start space-y-4 w-full">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-48 md:w-82 h-8 md:h-12 rounded-md" />
            <Skeleton className="w-32 h-4 rounded-md" />
            <div className="mt-4 md:mt-2 space-y-3 w-full flex flex-col items-center md:items-start">
              <Skeleton className="w-full max-w-[200px] md:max-w-none md:w-90 h-4 rounded-md" />
              <Skeleton className="w-32 md:w-30 h-4 rounded-md" />
              <Skeleton className="w-48 md:w-60 h-4 rounded-md" />
              <Skeleton className="w-40 md:w-40 h-4 rounded-md" />
              <Skeleton className="w-full h-10 mt-4 rounded-md" />
            </div>
          </div>
        </SpringPopup>
      </div>
    </Card>
  );
};

export default UserCardSkeleton;
