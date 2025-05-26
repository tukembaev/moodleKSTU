import { SpringPopup } from "shared/components";
import { Card } from "shared/shadcn/ui/card";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const UserCardSkeleton = () => {
  return (
    <Card className="relative w-full p-6 rounded-4xl shadow-md bg-gradient-to-r from-transparent from-10% via-sky-200 via-90% to-sky-300 to-100%">
      <div className="relative flex items-center gap-16 pl-20 py-6">
        <SpringPopup>
          <Skeleton className="w-64 h-64 rounded-full border-4 border-white shadow-md" />
        </SpringPopup>
        <SpringPopup>
          <div className="space-y-4">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-82 h-12 rounded-md" />
            <Skeleton className="w-32 h-4 rounded-md" />
            <div className="mt-2 space-y-3">
              <Skeleton className="w-90 h-4 rounded-md" />
              <Skeleton className="w-30 h-4 rounded-md" />
              <Skeleton className="w-60 h-4 rounded-md" />
              <Skeleton className="w-40 h-4 rounded-md" />
            </div>
          </div>
        </SpringPopup>
      </div>
    </Card>
  );
};

export default UserCardSkeleton;
