import ActivityList from "shared/components/ActivityList";
import { ProgressCircle } from "shared/components/Progress/CircleProgressBar";
import { useAuth } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";

const CourseInvolvement = () => {
  const auth_data = useAuth();
  return (
    <div className="w-full grid grid-cols-2 gap-6">
      <div
        className="relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 
              bg-linear-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/50"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <img
                src={auth_data.avatar}
                alt={"name"}
                width={72}
                height={72}
                className="rounded-xl ring-2 ring-zinc-100 dark:ring-zinc-800"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-zinc-500"> {auth_data.position}</p>
              <p className="text-sm text-zinc-400">
                {auth_data.first_name} {auth_data.last_name}
              </p>
              <Badge
                variant="secondary"
                className="px-2  text-xs font-medium 
                                  bg-linear-to-r from-amber-100 to-amber-200 
                                  dark:from-amber-900/50 dark:to-amber-800/50 
                                  text-amber-700 dark:text-amber-400
                                  border-amber-200/50 dark:border-amber-800/50"
              >
                Создатель
              </Badge>
            </div>
          </div>
          <ProgressCircle value={68} max={100}>
            68%
          </ProgressCircle>
        </div>
        <ActivityList />
      </div>
      <div
        className="relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 
              bg-linear-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/50"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <img
                src={auth_data.avatar}
                alt={"name"}
                width={72}
                height={72}
                className="rounded-xl ring-2 ring-zinc-100 dark:ring-zinc-800"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-zinc-500">Программист</p>
              <p className="text-sm text-zinc-400">Петя Иванов</p>
              <Badge
                variant="secondary"
                className="px-2  text-xs font-medium 
                                  bg-linear-to-r from-purple-100 to-purple-200 
                                  dark:from-purple-900/50 dark:to-purple-800/50 
                                  text-purple-700 dark:text-purple-400
                                  border-purple-200/50 dark:border-purple-800/50"
              >
                Соучастник
              </Badge>
            </div>
          </div>
          <ProgressCircle value={32} max={100}>
            32%
          </ProgressCircle>
        </div>
        <ActivityList />
      </div>
    </div>
  );
};

export default CourseInvolvement;
