import { CommandSeparator } from "cmdk";
import { Course } from "entities/Course";
import { LuBook } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { CommandGroup, CommandItem } from "shared/shadcn/ui/command";
import { openCourse } from "shared/lib/navigation/hidden-ids";

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
            openCourse(navigate, item.id);
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
