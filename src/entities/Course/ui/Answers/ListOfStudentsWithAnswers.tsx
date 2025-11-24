import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { makeIsRead } from "entities/Course/model/services/courseAPI";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { StudentsAnswers } from "entities/Course/model/types/course";
import { SetComment } from "features/Course/hooks/SetComment";
import { SetMark } from "features/Course/hooks/SetMark";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import {
  LuCheckCheck,
  LuFolderDown,
  LuKeyRound,
  LuLaugh,
  LuLock,
  LuMeh,
  LuMessageCircleWarning,
  LuThumbsUp,
  LuX,
  LuEye,
  LuEyeClosed,
} from "react-icons/lu";
import { GetFileIcon, HoverLift, UseTooltip } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import { Avatar, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import { Input } from "shared/shadcn/ui/input";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";

const ListOfStudentsWithAnswers = ({
  data,
  isLoading,
  error,
  refetch,
}: {
  data: StudentsAnswers[];
  isLoading?: boolean;
  refetch: () => void;
  error?: Error | null;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    "Все группы"
  );
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
    new Set()
  );
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);

  const toggleExpand = (studentId: string) => {
    setExpandedId(expandedId === studentId ? null : studentId);
  };

  const handleOpenPreview = (fileId: string) => {
    if (previewFileId === fileId) {
      setPreviewFileId(null);
    } else {
      setPreviewFileId(fileId);
      // Помечаем файл как прочитанный при открытии предпросмотра
      makeIsRead(fileId);
      refetch();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const toggleSelectAll = () => {
    const visibleStudentIds = filteredData.map((s) => s.user_id);
    const allVisibleSelected =
      visibleStudentIds.length > 0 &&
      visibleStudentIds.every((id) => selectedStudents.has(id));

    if (allVisibleSelected) {
      setSelectedStudents((prev) => {
        const newSet = new Set(prev);
        visibleStudentIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    } else {
      setSelectedStudents((prev) => {
        const newSet = new Set(prev);
        visibleStudentIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  };

  const uniqueGroups = [
    "Все группы",
    ...new Set(data.map((student) => student.group)),
  ];
  const uniqueData:StudentsAnswers[] = React.useMemo(() => {
    const map = new Map();
    data.forEach((s) => {
      if (!map.has(s.user_id)) map.set(s.user_id, s);
    });
    return [...map.values()];
  }, [data]);
  
  const filteredData = uniqueData.filter(
    (student) =>
      student.fullname.toLowerCase().includes(searchQuery) &&
      (selectedGroup === "" ||
        selectedGroup === "Все группы" ||
        student.group === selectedGroup)
  );

  const { mutate: change_permission } = courseQueries.edit_permission();

  const handlePermission = (student: StudentsAnswers) => {
    change_permission({
      id: student.task,
      data: {
        locked: !student.locked,
        users: [student.user_id],
      },
    });
  };

  const handleMultiplePermission = (lock: boolean) => {
    change_permission({
      id: filteredData[0]?.task,
      data: {
        locked: lock,
        users: [...selectedStudents],
      },
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Skeleton className="h-4 w-4 rounded-sm" />
              </TableHead>
              <TableHead className="w-[300px]">Имя студента</TableHead>
              <TableHead className="w-[100px]">Баллы</TableHead>
              <TableHead>Статус сдачи</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className="py-2">
                <TableCell>
                  <Skeleton className="h-4 w-4 rounded-sm" />
                </TableCell>
                <TableCell className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-25" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return <p className="text-center">{error.message}</p>;
  }

  if (!data.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Поиск по имени..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-[350px]"
          />
          {selectedStudents.size === filteredData.length &&
          filteredData.length > 0 ? (
            <>
              <Button
                onClick={() => handleMultiplePermission(true)}
                variant="outline"
              >
                <LuLock className="text-red-400" />
                Закрыть доступ
              </Button>
              <Button
                onClick={() => handleMultiplePermission(false)}
                variant="outline"
              >
                <LuKeyRound className="text-green-400" />
                Открыть доступ
              </Button>
            </>
          ) : null}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {selectedGroup || "Все группы"} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {uniqueGroups.map((group) => (
              <DropdownMenuItem
                key={group}
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    filteredData.length > 0 &&
                    filteredData.every((student) =>
                      selectedStudents.has(student.user_id)
                    )
                  }
                  onCheckedChange={toggleSelectAll}
                  className="cursor-pointer"
                  disabled={filteredData.length === 0}
                />
              </TableHead>
              <TableHead className="w-[150px]">Студент</TableHead>
              <TableHead className="w-[130px]">Статус сдачи</TableHead>
              <TableHead className="w-[130px]">Доступ</TableHead>
              <TableHead className="w-[130px]">Замечания</TableHead>
        

              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map((student) => (
              <React.Fragment key={student.id}>
                <TableRow
                  className={`${expandedId === student.id ? "border-b-0" : ""}`}
                  // key={student.id + student.fullname}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedStudents.has(student.user_id)}
                      onCheckedChange={() => {
                        setSelectedStudents((prev) => {
                          const newSet = new Set(prev);
                          if (newSet.has(student.user_id)) {
                            newSet.delete(student.user_id);
                          } else {
                            newSet.add(student.user_id);
                          }
                          return newSet;
                        });
                      }}
                      className="cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="font-medium flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                      </Avatar>

                      <p>{student.fullname}</p>
                      <Badge className="bg-primary/5 text-primary shadow-none text-xs">
                        {student.group}
                      </Badge>
                    </div>

                    {student.files.some((file) => !file.is_read.is_read) ? (
                      <UseTooltip text="Новый не просмотренный файл!">
                        <LuMessageCircleWarning className="text-orange-500" />
                      </UseTooltip>
                    ) : (
                      <UseTooltip text="Все файлы просмотренны">
                        <LuCheckCheck className="text-blue-500" />
                      </UseTooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <HoverLift>
                      <SetMark
                        text="Выставить баллы"
                        points={student.points}
                        max_points={student.max_points}
                        id={student.id}
                      >
                        <Badge
                          variant="outline"
                          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 cursor-pointer"
                        >
                          {student.status ? (
                            <LuThumbsUp className="text-green-500 dark:text-green-400" />
                          ) : (
                            <LuX />
                          )}
                          {student.status
                            ? `Сдано на ${student.points}`
                            : "Не сдано"}
                        </Badge>
                      </SetMark>
                    </HoverLift>
                  </TableCell>
                  <TableCell>
                    <UseTooltip
                      text={
                        student.locked ? "Открыть доступ" : "Закрыть доступ"
                      }
                    >
                      <HoverLift>
                        <Badge
                          variant="outline"
                          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                          onClick={() => handlePermission(student)}
                        >
                          {student.locked ? (
                            <LuLock />
                          ) : (
                            <LuKeyRound className="text-green-500 dark:text-green-400" />
                          )}
                          {student.locked ? "Доступ запрещен" : "Доступ открыт"}
                        </Badge>
                      </HoverLift>
                    </UseTooltip>
                  </TableCell>
                  <TableCell>
                    <HoverLift>
                      <Badge
                        variant="outline"
                        className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 cursor-pointer"
                      >
                        {!student.comment ? (
                          <SetComment text="Добавить замечание" id={student.id}>
                            <span className="flex gap-1 items-center cursor-pointer">
                              <LuLaugh className="text-green-500 dark:text-green-400" />
                              Замечаний нет
                            </span>
                          </SetComment>
                        ) : (
                          <SetComment text="Добавить замечание" id={student.id}>
                            <span className="flex gap-1 items-center">
                              <LuMeh className="text-orange-500 dark:text-orange-400 cursor-pointer" />
                              {student.comment}
                            </span>
                          </SetComment>
                        )}
                      </Badge>
                    </HoverLift>
                  </TableCell>
                  {/* <TableCell>
                    <Badge
                      variant="outline"
                      className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                    >
                      {student.locked ? (
                        <LuMessageCircleWarning className="text-yellow-500 dark:text-yellow-400" />
                      ) : (
                        <LuMessageCircle className="text-green-500 dark:text-green-400" />
                      )}

                      <SetChat text="Добавить замечание" id={student.id}>
                        <span className="flex gap-1 items-center cursor-pointer">
                          Открыть чат
                        </span>
                      </SetChat>
                    </Badge>
                  </TableCell> */}

                  <TableCell
                    className="flex justify-end cursor-pointer"
                    onClick={() => toggleExpand(student.id)}
                  >
                    {student.files.length > 0 && (
                      <span>
                        {expandedId === student.id ? (
                          <ChevronDown strokeWidth={1} />
                        ) : (
                          <ChevronRight strokeWidth={1} />
                        )}
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {expandedId === student.id &&
                  student.files.map((item) => (
                    <TableRow
                      key={`expanded-${student.id}-${item.file}`}
                      className="border-b-1 hover:bg-transparent"
                    >
                      <TableCell />
                      <TableCell className="font-medium flex gap-3 pt-3 pl-3 items-center max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <GetFileIcon file_names={item.file_names} />
                        <UseTooltip text={item.file_names}>
                          <p>{item.file_names}</p>
                        </UseTooltip>
                        <span className="text-xs text-foreground/50">
                          {format(item.created_at, "PPP", {
                            locale: ru,
                          })}
                        </span>
                        {item.is_read.is_read ? <UseTooltip text={
                            <>
                              <div>Файл просмотрен</div>
                              <div>{format(item.is_read.read, "PPP 'в' p", {
                                locale: ru,
                              })}</div>
                            </>
                          }>
                            <LuCheckCheck className="text-blue-500" />
                          </UseTooltip>
                        : <UseTooltip text="Новый не просмотренный файл!">
                            <LuMessageCircleWarning className="text-orange-500" />
                          </UseTooltip>}
                      </TableCell>
                      <TableCell colSpan={6} className="text-right">
                        <div className="flex gap-2 justify-end">
                          {item.file_names.toLowerCase().endsWith('.pdf') && (
                            <Dialog
                              onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                  setPreviewFileId(null);
                                }
                              }}
                              open={previewFileId === item.id}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleOpenPreview(item.id)}
                                >
                                  {previewFileId === item.id ? (
                                    <LuEyeClosed />
                                  ) : (
                                    <LuEye />
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
                                <DialogHeader className="px-6 pt-6 pb-0">
                                  <DialogTitle>{item.file_names}</DialogTitle>
                                </DialogHeader>
                                <PdfViewer url={item.file || ""} inDialog={true} />
                              </DialogContent>
                            </Dialog>
                          )}
                          <a
                            href={item.file}
                            download={item.file_names}
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              makeIsRead(item.id);
                              refetch();
                            }}
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="cursor-pointer"
                            >
                              <LuFolderDown />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListOfStudentsWithAnswers;
