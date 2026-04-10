import { UserFilesList } from "entities/User/types/user";
import { LuFolderDown } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { HoverLift, SpringPopupList, UseTooltip } from "shared/components";
import { AppSubRoutes } from "shared/config";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";

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

  // Render loading skeleton for cards
  const renderCardSkeleton = () => (
    <SpringPopupList>
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </SpringPopupList>
  );

  // Render file cards for mobile/tablet
  const renderFileCards = () => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <SpringPopupList>
        {user_files?.map((material) => (
          <Card key={material.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <h3 className="font-medium text-base line-clamp-2">
                {material.file_names}
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Источник:</span>
                <HoverLift>
                  <UseTooltip
                    text={material?.resides?.course[0]?.discipline_name}
                  >
                    <Badge
                      variant="outline"
                      className="flex gap-1 px-2 py-1 text-xs cursor-pointer"
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
              </div>
              <a
                href={material.file}
                download={material.file_names}
                className="block"
              >
                <Button variant="outline" className="w-full gap-2">
                  <LuFolderDown className="h-4 w-4" />
                  Скачать файл
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </SpringPopupList>
    </div>
  );

  // Render table for desktop
  const renderTable = () => (
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

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        {error.message}
      </div>
    );
  }

  return (
    <>
      {/* Mobile and Tablet view (cards) */}
      <div className="block lg:hidden">
        {isLoading ? renderCardSkeleton() : renderFileCards()}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden lg:block">
        {renderTable()}
      </div>
    </>
  );
};

//TODO Добавить возможность удалять файл пользователя в таблице $api_users/delete-file delete метод
export default FileTab;
