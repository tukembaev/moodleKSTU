import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FileAnswer } from "entities/Course/model/types/course";
import { useState } from "react";
import { LuCheckCheck, LuEraser, LuFolderDown, LuMessageCircleWarning, LuEye, LuEyeClosed } from "react-icons/lu";
import { UseTooltip } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
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

  if (error) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className="text-center" colSpan={4}>
            {error.message}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <div className="flex flex-col gap-2 ">
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
                      <div className="flex items-center gap-3">
                      {material.file_names}
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
      {/* <div className="flex justify-end">
        <Button>Отправить работу </Button>
      </div> */}
    </div>
  );
};

export default SingleStudentAnswers;
