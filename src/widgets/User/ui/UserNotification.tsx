import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useState } from "react";
import { LuBell } from "react-icons/lu";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

const notifications = [
  {
    id: "1",
    title: "Design review meeting notes",
    updatedAt: "Updated 2 hours ago",
    icon: FileText,
  },
  {
    id: "2",
    title: "New feature request",
    updatedAt: "Updated yesterday",
    icon: FileText,
  },
];

const UserNotification = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="z-40">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="flex gap-2 items-center text-sm">
          <Button variant="outline" size="icon" className="relative mr-4">
            <LuBell />
            <span className="absolute top-0 right-0 px-1 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-full text-xs bg-destructive text-destructive-foreground">
              2
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-41">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "w-80 flex flex-col",
              "p-3 rounded-xl",
              "bg-white dark:bg-zinc-900",
              "sticky top-4",
              "max-h-[32rem]"
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <LuBell className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Уведомления (2)
              </h2>
            </div>
            <div className="space-y-2">
              {notifications.map(({ id, title, updatedAt, icon: Icon }) => (
                <div
                  key={id}
                  className="group flex items-center gap-4 p-2 rounded-xl 
                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                    transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex-none p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {updatedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserNotification;
