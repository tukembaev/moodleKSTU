import { motion } from "motion/react";
import { Skeleton } from "shared/shadcn/ui/skeleton";

interface UserData {
  id: number;
  employee_id?: number;
  inn?: string;
  first_name: string;
  surname: string;
  email_person?: string;
  imeag?: string;
  position: string;
  division?: string | null;
  number_phone: string;
  date_of_come?: string | null;
  date_of_leave?: string | null;
  num_prikaz_enter?: string;
  rate?: number;
  is_active?: boolean;
}

export const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SkeletonItem = () => (
  <div className="flex items-center gap-4 animate-pulse">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div>
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

const UserList = ({
  users,
  isLoading,
}: {
  users: UserData[];
  isLoading: boolean;
}) => (
  <motion.div
    className="space-y-4"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={listVariants}
  >
    {isLoading
      ? Array.from({ length: 5 }).map((_, index) => (
          <motion.div key={index} variants={itemVariants}>
            <SkeletonItem />
          </motion.div>
        ))
      : users.map(
          ({ first_name, surname, position, number_phone, id, imeag }) => (
            <motion.div
              key={id}
              className="flex items-center gap-2 justify-between"
              variants={itemVariants}
              transition={{ type: "tween" }}
            >
              <div className="flex items-center gap-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={imeag}
                  alt="User avatar"
                />
                <div>
                  <span className="block text-sm leading-none font-semibold">
                    {`${first_name} ${surname}`}
                  </span>
                  <span className="text-xs leading-none">
                    {`${position}-${number_phone}`}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        )}
  </motion.div>
);

export default UserList;
