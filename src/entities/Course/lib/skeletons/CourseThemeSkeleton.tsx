import { SpringPopupList } from "shared/components";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const CourseThemeSkeleton = () => {
  return (
    <div className="min-h-screen flex py-3">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <SpringPopupList>
            <div className="flex flex-col">
              <Skeleton className="h-14 w-64 sm:w-80 rounded-md" />
              <Skeleton className="mt-2 h-6 w-32 rounded-md" />
              <Skeleton className="mt-1 h-6 w-48 rounded-md" />
              <Skeleton className="mt-1 h-6 w-48 rounded-md" />
            </div>
          </SpringPopupList>
        </div>

        <div className="mt-6">
          <SpringPopupList>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="relative mb-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-48 rounded-md" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
                <div className="w-full relative mt-4">
                  <div className="flex px-2 gap-4">
                    {[...Array(3)].map((_, idx) => (
                      <Skeleton key={idx} className="h-52 w-full rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </SpringPopupList>
        </div>
      </div>
    </div>
  );
};

export default CourseThemeSkeleton;
