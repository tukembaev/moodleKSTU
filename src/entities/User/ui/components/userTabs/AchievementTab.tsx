import { useQuery } from "@tanstack/react-query";
import { userQueries } from "entities/User/model/userQueryFactory";
import { Achievement } from "entities/User/types/user";
import { motion } from "motion/react";
import { UseTooltip } from "shared/components";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const rarityLabels: Record<string, string> = {
  regular: "Обычные",
  rare: "Редкие",
  mythical: "Мифические",
  legendary: "Легендарные",
};

const AchievementModalInfo = ({
  title,
  description,
  icon,
  requirements,
}: {
  title: any;
  description: any;
  icon: any;
  requirements: any;
  status?: any;
}) => {
  return (
    <DialogContent className="min-w-1/3 min-h-1/5">
      <div className="flex gap-3">
        <Avatar className="h-18 w-18">
          <AvatarImage src={icon} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-between">
            <span className="text-3xl leading-none font-semibold italic">
              {title}
            </span>
            <span className="text-sm leading-none text-muted-foreground italic">
              {description}
            </span>
          </div>
          <p className="text-md text-muted-foreground">{requirements}</p>
        </div>
      </div>
    </DialogContent>
  );
};

const SkeletonBlock = () => (
  <div className="flex flex-col gap-6">
    <Skeleton className="w-40 h-6 rounded-md" />
    <div className="flex gap-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <Skeleton key={i} className="w-20 h-16 rounded-xl" />
      ))}
    </div>
  </div>
);

const AchievementTab = () => {
  const { data, isLoading } = useQuery(userQueries.user_achievements());

  if (isLoading) {
    return (
      <div className="space-y-8 ">
        <SkeletonBlock />
        <SkeletonBlock />
        <SkeletonBlock />
        <SkeletonBlock />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data &&
        Object.entries(data).map(([rarity, items]) => (
          <div key={rarity} className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-800 italic">
              {rarityLabels[rarity]}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {items.map((achievement: Achievement, index: string) => (
                <Dialog key={`${rarity}-${index}`}>
                  <DialogTitle />
                  <DialogTrigger>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        scale: {
                          type: "spring",
                          visualDuration: 0.4,
                          bounce: 0.5,
                        },
                      }}
                      className={`w-16 h-16`}
                      whileHover={{
                        scale: 1.2,
                        y: -10,
                      }}
                    >
                      <UseTooltip text={achievement.title}>
                        <img
                          src={achievement.icon}
                          alt={achievement.title}
                          className={`${
                            !achievement.user_status && "grayscale-100"
                          }`}
                        />
                      </UseTooltip>
                    </motion.div>
                  </DialogTrigger>
                  <AchievementModalInfo {...achievement} />
                </Dialog>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AchievementTab;
