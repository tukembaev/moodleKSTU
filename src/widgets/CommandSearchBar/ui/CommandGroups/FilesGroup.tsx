import { CommandSeparator } from "cmdk";
import { UserFilesList } from "entities/User";
import { LuFolderDown } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { AppSubRoutes } from "shared/config";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { CommandGroup, CommandItem } from "shared/shadcn/ui/command";

const FilesGroup = ({ data }: { data: UserFilesList[] }) => {
  const navigate = useNavigate();
  if (data.length === 0) return null;
  return (
    <CommandGroup heading="Файлы">
      {data.map((item) => (
        <CommandItem
          key={item.id}
          value={item.file_names}
          className="flex justify-between"
        >
          <div>
            <span>{item.file_names}</span>
            <Badge
              variant="outline"
              className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
              onClick={() =>
                navigate(
                  "/courses/" +
                    AppSubRoutes.COURSE_THEMES +
                    "/" +
                    item.resides?.course[0]?.id +
                    `?themeId=${item.resides?.theme[0]?.id}`
                )
              }
            >
              {item?.resides?.theme[0]?.title}
            </Badge>
          </div>
          <a
            href={item.file}
            download={item.file_names}
            className="text-blue-500 hover:text-blue-700"
          >
            <Button variant="outline" size="icon">
              <LuFolderDown />
            </Button>
          </a>
        </CommandItem>
      ))}
      <CommandSeparator />
    </CommandGroup>
  );
};

export default FilesGroup;
