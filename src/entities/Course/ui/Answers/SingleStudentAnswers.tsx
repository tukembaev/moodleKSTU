import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FileAnswer } from "entities/Course/model/types/course";
import { useState } from "react";
import { 
  LuCheckCheck, 
  LuEraser, 
  LuFolderDown, 
  LuMessageCircleWarning, 
  LuEye, 
  LuEyeClosed,
  LuFile,
  LuCalendarDays,
  LuUpload
} from "react-icons/lu";
import { UseTooltip, SpringPopupList } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";

const SingleStudentAnswers = ({
  data,
  isLoading,
  error,
  id,
}: {
  data: FileAnswer[];
  isLoading: boolean;
  error: Error | null;
  id: string;
}) => {
  const openForm = useForm();
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  
  const handleOpenPreview = (fileId: string) => {
    if (previewFileId === fileId) {
      setPreviewFileId(null);
    } else {
      setPreviewFileId(fileId);
    }
  };

  // Render card skeleton for loading state (mobile/tablet)
  const renderCardSkeleton = () => (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render file cards for mobile/tablet
  const renderFileCards = () => (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {!data.length ? (
        <div className="col-span-full py-8 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="p-4 rounded-2xl bg-muted/50">
              <LuFile className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Файлы отсутствуют</p>
              <p className="text-sm text-muted-foreground">
                Добавьте свой первый файл!
              </p>
            </div>
            <Button
              variant="default"
              className="gap-2 mt-2"
              onClick={() => openForm(FormQuery.ADD_ANSWER, { id: id })}
            >
              <LuUpload className="h-4 w-4" />
              Загрузить файл
            </Button>
          </div>
        </div>
      ) : (
        <SpringPopupList>
          {data.map((material) => (
            <Card 
              key={material.id} 
              className="overflow-hidden hover:shadow-md transition-all duration-300 group"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                      <LuFile className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 min-w-0">
                      {material.file_names}
                    </h3>
                  </div>
                  {/* Status indicator */}
                  {material.is_read.is_read ? (
                    <UseTooltip
                      text={
                        <>
                          <div>Файл просмотрен</div>
                          <div>
                            {format(material.is_read.read, "PPP 'в' p", {
                              locale: ru,
                            })}
                          </div>
                        </>
                      }
                    >
                      <Badge className="gap-1 bg-blue-50 text-blue-600 border-blue-200 shrink-0 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
                        <LuCheckCheck className="h-3 w-3" />
                        <span className="text-xs">Просмотрен</span>
                      </Badge>
                    </UseTooltip>
                  ) : (
                    <UseTooltip text="Файл не просмотрен">
                      <Badge className="gap-1 bg-orange-50 text-orange-600 border-orange-200 shrink-0 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800">
                        <LuMessageCircleWarning className="h-3 w-3" />
                        <span className="text-xs">Ожидает</span>
                      </Badge>
                    </UseTooltip>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LuCalendarDays className="h-3.5 w-3.5" />
                  <span>
                    {format(material.created_at, "PPP", { locale: ru })}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {material.file_names.toLowerCase().endsWith('.pdf') && (
                    <Dialog
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setPreviewFileId(null);
                        }
                      }}
                      open={previewFileId === material.id}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 flex-1"
                          onClick={() => handleOpenPreview(material.id)}
                        >
                          {previewFileId === material.id ? (
                            <LuEyeClosed className="h-4 w-4" />
                          ) : (
                            <LuEye className="h-4 w-4" />
                          )}
                          Просмотр
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
                        <DialogHeader className="px-6 pt-6 pb-0">
                          <DialogTitle>{material.file_names}</DialogTitle>
                        </DialogHeader>
                        <PdfViewer url={material.file || ""} inDialog={true} />
                      </DialogContent>
                    </Dialog>
                  )}
                  <a
                    href={material.file}
                    download={material.file_names}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <LuFolderDown className="h-4 w-4" />
                      Скачать
                    </Button>
                  </a>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="gap-1.5"
                  >
                    <LuEraser className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </SpringPopupList>
      )}
    </div>
  );

  // Render table for desktop
  const renderTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px] py-4">Название файла</TableHead>
            <TableHead className="text-right">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => openForm(FormQuery.ADD_ANSWER, { id: id })}
              >
                Загрузить файл
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data.length && (
            <TableRow>
              <TableCell>
                Файлы отсутствуют , добавьте свой первый файл!{" "}
              </TableCell>
            </TableRow>
          )}
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                </TableCell>
              </TableRow>
            ))
            : data?.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3 max-w-[500px] overflow-hidden text-ellipsis whitespace-nowrap">

                    {material.file_names}
                    <span className="text-xs text-foreground/50">
                      {format(material.created_at, "PPP", {
                        locale: ru,
                      })}
                    </span>
                    {material.is_read.is_read ? (
                      <UseTooltip text={
                        <>
                          <div>Файл просмотрен</div>
                          <div>{format(material.is_read.read, "PPP 'в' p", {
                            locale: ru,
                          })}</div>
                        </>
                      }>
                        <LuCheckCheck className="text-blue-500" />
                      </UseTooltip>
                    ) : (
                      <UseTooltip text="Файл не просмотрен">
                        <LuMessageCircleWarning className="text-orange-500" />
                      </UseTooltip>
                    )}



                  </div>

                </TableCell>
                <TableCell className="justify-end flex gap-3">
                  {material.file_names.toLowerCase().endsWith('.pdf') && (
                    <Dialog
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setPreviewFileId(null);
                        }
                      }}
                      open={previewFileId === material.id}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenPreview(material.id)}
                        >
                          {previewFileId === material.id ? (
                            <LuEyeClosed />
                          ) : (
                            <LuEye />
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
                        <DialogHeader className="px-6 pt-6 pb-0">
                          <DialogTitle>{material.file_names}</DialogTitle>
                        </DialogHeader>
                        <PdfViewer url={material.file || ""} inDialog={true} />
                      </DialogContent>
                    </Dialog>
                  )}
                  <a
                    href={material.file}
                    download={material.file_names}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Button variant="outline" size="icon">
                      <LuFolderDown />
                    </Button>
                  </a>
                  <Button variant="destructive" size="icon">
                    <LuEraser />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
    <div className="flex flex-col gap-3">
      {/* Header with upload button for mobile/tablet */}
      <div className="flex items-center justify-between lg:hidden">
        <p className="text-sm font-medium text-muted-foreground">
          {data.length > 0 ? `${data.length} файл(ов)` : "Нет файлов"}
        </p>
        {data.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => openForm(FormQuery.ADD_ANSWER, { id: id })}
          >
            <LuUpload className="h-4 w-4" />
            Загрузить
          </Button>
        )}
      </div>

      {/* Mobile and Tablet view (cards) */}
      <div className="block lg:hidden">
        {isLoading ? renderCardSkeleton() : renderFileCards()}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden lg:block">
        {renderTable()}
      </div>
    </div>
  );
};

export default SingleStudentAnswers;
