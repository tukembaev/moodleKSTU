import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { makeIsRead } from "entities/Course/model/services/courseAPI";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { StudentsAnswers } from "entities/Course/model/types/course";
import { SetComment } from "features/Course/hooks/SetComment";
import { SetMark } from "features/Course/hooks/SetMark";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
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
  LuUsers,
  LuCalendarDays,
  LuFile,
} from "react-icons/lu";
import { GetFileIcon, HoverLift, UseTooltip, SpringPopupList } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import { Avatar, AvatarImage, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "shared/shadcn/ui/collapsible";
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
  const uniqueData: StudentsAnswers[] = React.useMemo(() => {
    const map = new Map<string, StudentsAnswers>();
    data.forEach((s) => {
      const key = String(s.user_id);
      if (!map.has(key)) {
        map.set(key, s);
      } else {
        const existing = map.get(key)!;

        // Logic to keep the most relevant entry
        const existingHasFiles = existing.files?.length > 0;
        const newHasFiles = s.files?.length > 0;

        if (newHasFiles && !existingHasFiles) {
          map.set(key, s);
        } else if (newHasFiles === existingHasFiles) {
          if (s.status && !existing.status) {
            map.set(key, s);
          } else if (s.status === existing.status) {
            if (s.points > existing.points) {
              map.set(key, s);
            }
          }
        }
      }
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

  // Render card skeleton for loading state (mobile/tablet)
  const renderCardSkeleton = () => (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render student file card for mobile
  const renderFileCard = (item: StudentsAnswers['files'][0]) => (
    <Card
      key={item.id}
      className="overflow-hidden hover:shadow-sm transition-all duration-300 bg-muted/30"
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-background shrink-0">
            <GetFileIcon file_names={item.file_names} />
          </div>
          <div className="flex-1 min-w-0">
            <UseTooltip text={item.file_names}>
              <p className="font-medium text-sm truncate">{item.file_names}</p>
            </UseTooltip>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <LuCalendarDays className="h-3 w-3" />
                {format(item.created_at, "PPP", { locale: ru })}
              </span>
              {item.is_read.is_read ? (
                <UseTooltip
                  text={
                    <>
                      <div>Файл просмотрен</div>
                      <div>
                        {format(item.is_read.read, "PPP 'в' p", { locale: ru })}
                      </div>
                    </>
                  }
                >
                  <Badge className="gap-1 bg-blue-50 text-blue-600 border-blue-200 text-xs px-1.5 py-0 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
                    <LuCheckCheck className="h-3 w-3" />
                  </Badge>
                </UseTooltip>
              ) : (
                <UseTooltip text="Не просмотрен">
                  <Badge className="gap-1 bg-orange-50 text-orange-600 border-orange-200 text-xs px-1.5 py-0 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800">
                    <LuMessageCircleWarning className="h-3 w-3" />
                  </Badge>
                </UseTooltip>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
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
                    className="h-8 w-8"
                    onClick={() => handleOpenPreview(item.id)}
                  >
                    {previewFileId === item.id ? (
                      <LuEyeClosed className="h-4 w-4" />
                    ) : (
                      <LuEye className="h-4 w-4" />
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
              onClick={() => {
                makeIsRead(item.id);
                refetch();
              }}
            >
              <Button variant="outline" size="icon" className="h-8 w-8">
                <LuFolderDown className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render student cards for mobile/tablet
  const renderStudentCards = () => (
    <div className="space-y-3">
      {filteredData.length === 0 ? (
        <div className="py-8 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="p-4 rounded-2xl bg-muted/50">
              <LuUsers className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <p className="text-muted-foreground">Студенты не найдены</p>
          </div>
        </div>
      ) : (
        <SpringPopupList>
          {filteredData.map((student) => {
            const hasUnreadFiles = student.files.some((file) => !file.is_read.is_read);
            const isExpanded = expandedId === student.id;

            return (
              <Collapsible
                key={student.id}
                open={isExpanded}
                onOpenChange={() => toggleExpand(student.id)}
              >
                <Card className={`overflow-hidden transition-all duration-300 ${isExpanded ? "ring-2 ring-primary/20 shadow-md" : "hover:shadow-sm"
                  }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      {/* Student info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {student.fullname.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{student.fullname}</p>
                            {hasUnreadFiles ? (
                              <UseTooltip text="Есть непрочитанные файлы">
                                <Badge className="gap-1 bg-orange-50 text-orange-600 border-orange-200 text-xs px-1.5 py-0 shrink-0 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800">
                                  <LuMessageCircleWarning className="h-3 w-3" />
                                  Новое
                                </Badge>
                              </UseTooltip>
                            ) : (
                              <UseTooltip text="Все файлы просмотрены">
                                <LuCheckCheck className="h-4 w-4 text-blue-500 shrink-0" />
                              </UseTooltip>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{student.group}</p>
                        </div>
                      </div>

                      {/* Expand button */}
                      {student.files.length > 0 && (
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Submission status */}
                      <SetMark
                        text="Выставить баллы"
                        points={student.points}
                        max_points={student.max_points}
                        id={student.id}
                      >
                        <Badge
                          variant="outline"
                          className={`gap-1 text-xs cursor-pointer ${student.status
                            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                            : ""
                            }`}
                        >
                          {student.status ? (
                            <>
                              <LuThumbsUp className="h-3 w-3" />
                              Сдано на {student.points}
                            </>
                          ) : (
                            <>
                              <LuX className="h-3 w-3" />
                              Не сдано
                            </>
                          )}
                        </Badge>
                      </SetMark>

                      {/* Access status */}
                      <UseTooltip text={student.locked ? "Открыть доступ" : "Закрыть доступ"}>
                        <Badge
                          variant="outline"
                          className={`gap-1 text-xs cursor-pointer ${student.locked
                            ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
                            : "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                            }`}
                          onClick={() => handlePermission(student)}
                        >
                          {student.locked ? (
                            <>
                              <LuLock className="h-3 w-3" />
                              Закрыт
                            </>
                          ) : (
                            <>
                              <LuKeyRound className="h-3 w-3" />
                              Открыт
                            </>
                          )}
                        </Badge>
                      </UseTooltip>

                      {/* Comments status */}
                      <SetComment text="Добавить замечание" id={student.id}>
                        <Badge
                          variant="outline"
                          className={`gap-1 text-xs cursor-pointer ${student.comment
                            ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800"
                            : ""
                            }`}
                        >
                          {student.comment ? (
                            <>
                              <LuMeh className="h-3 w-3" />
                              Замечание
                            </>
                          ) : (
                            <>
                              <LuLaugh className="h-3 w-3" />
                              Ок
                            </>
                          )}
                        </Badge>
                      </SetComment>
                    </div>
                  </CardHeader>

                  {/* Files section */}
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-3">
                      <div className="pt-3 border-t border-border/50 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <LuFile className="h-3.5 w-3.5" />
                          Файлы ({student.files.length})
                        </p>
                        <div className="space-y-2">
                          {student.files.map((item) => renderFileCard(item))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </SpringPopupList>
      )}
    </div>
  );

  // Render table skeleton for loading state (desktop)
  const renderTableSkeleton = () => (
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

  // Render table for desktop
  const renderTable = () => (
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
                    {/* <Badge className="bg-primary/5 text-primary shadow-none text-xs">
                      {student.group}
                    </Badge> */}
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
                    <TableCell className="font-medium flex gap-3 pt-3 pl-3 items-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
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
  );

  if (isLoading) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className="block lg:hidden">
          {renderCardSkeleton()}
        </div>
        {/* Desktop skeleton */}
        <div className="hidden lg:block">
          {renderTableSkeleton()}
        </div>
      </>
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
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Поиск по имени..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 max-w-full sm:max-w-[350px]"
            />
          </div>

          {selectedStudents.size === filteredData.length &&
            filteredData.length > 0 && (
              <div className="hidden lg:flex gap-2">
                <Button
                  onClick={() => handleMultiplePermission(true)}
                  variant="outline"
                  size="sm"
                >
                  <LuLock className="text-red-400" />
                  Закрыть доступ
                </Button>
                <Button
                  onClick={() => handleMultiplePermission(false)}
                  variant="outline"
                  size="sm"
                >
                  <LuKeyRound className="text-green-400" />
                  Открыть доступ
                </Button>
              </div>
            )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              {selectedGroup || "Все группы"} <ChevronDown className="h-4 w-4 ml-1" />
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

      {/* Mobile and Tablet view (cards) */}
      <div className="block lg:hidden">
        {renderStudentCards()}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden lg:block">
        {renderTable()}
      </div>
    </div>
  );
};

export default ListOfStudentsWithAnswers;
