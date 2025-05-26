import { CommandSeparator } from "cmdk";
import { Course } from "entities/Course";
import { LuBook } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { AppRoutes, AppSubRoutes } from "shared/config";
import { CommandGroup, CommandItem } from "shared/shadcn/ui/command";

const CoursesGroup = ({ data }: { data: Course[] }) => {
  const navigate = useNavigate();
  if (data.length === 0) return null;

  return (
    <CommandGroup heading="Курсы">
      {data.map((item) => (
        <CommandItem
          key={item.id}
          value={item.discipline_name}
          onSelect={() => {
            navigate(
              "/" +
                AppRoutes.COURSES +
                "/" +
                AppSubRoutes.COURSE_THEMES +
                "/" +
                item.id
            );
          }}
        >
          <LuBook />
          <span>{item.discipline_name}</span>
        </CommandItem>
      ))}
      <CommandSeparator />
    </CommandGroup>
  );
};

export default CoursesGroup;
