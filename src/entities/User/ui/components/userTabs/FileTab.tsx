import { UserFilesList } from "entities/User/types/user";
import { LuFolderDown } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { HoverLift, SpringPopupList, UseTooltip } from "shared/components";
import { AppSubRoutes } from "shared/config";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Skeleton } from "shared/shadcn/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";

const FileTab = ({
  user_files,
  isLoading,
  error,
}: {
  user_files: UserFilesList[];
  isLoading: boolean;
  error: Error | null;
}) => {
  const navigate = useNavigate();
  if (error) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className="text-center" colSpan={3}>
            {error.message}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-4 w-72">Файл</TableHead>
            <TableHead className="py-4">Источник</TableHead>

            <TableHead className="w-12 py-4 text-right">Действие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SpringPopupList>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </SpringPopupList>
          ) : (
            user_files?.map((material) => (
              <TableRow key={material.id}>
                <TableCell>
                  <span className="font-medium">{material.file_names}</span>
                </TableCell>
                <TableCell>
                  <HoverLift>
                    <UseTooltip
                      text={material?.resides?.course[0]?.discipline_name}
                    >
                      <Badge
                        variant="outline"
                        className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                        onClick={() =>
                          navigate(
                            "/courses/" +
                              AppSubRoutes.COURSE_THEMES +
                              "/" +
                              material.resides?.course[0]?.id +
                              `?themeId=${material.resides?.theme[0]?.id}`
                          )
                        }
                      >
                        {material?.resides?.theme[0]?.title}
                      </Badge>
                    </UseTooltip>
                  </HoverLift>
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={material.file}
                    download={material.file_names}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Button variant="outline" size="icon">
                      <LuFolderDown />
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

//TODO Добавить возможность удалять файл пользователя в таблице $api_users/delete-file delete метод
export default FileTab;
