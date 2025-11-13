import { FileAnswer } from "entities/Course/model/types/course";
import { LuEraser, LuFolderDown } from "react-icons/lu";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";
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

//TODO Нужно добавить возможность прикреплять описание к файлам , сообщения от студента , а именно пояснительная к заданию или файлу, обсудить с бексом
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
                      {material.file_names}
                    </TableCell>
                    <TableCell className="justify-end flex gap-3">
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
      <div className="flex justify-end">
        <Button>Отправить работу на проверку</Button>
      </div>
    </div>
  );
};

export default SingleStudentAnswers;
