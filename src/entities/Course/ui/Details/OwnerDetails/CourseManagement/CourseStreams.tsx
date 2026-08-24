import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseStream } from "entities/Course/model/types/course";
import { CourseStreamItemPayload } from "features/Course";
import { LuPlus, LuTrash2, LuUsers } from "react-icons/lu";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "shared/shadcn/ui/alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import { AddStreamDialog } from "./AddStreamDialog";

interface CourseStreamsProps {
  courseId: string;
}

export const CourseStreams = ({ courseId }: CourseStreamsProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [streamToDelete, setStreamToDelete] = useState<CourseStream | null>(
    null
  );

  const { data: streams = [], isLoading, error } = useQuery(
    courseQueries.courseStreams(courseId)
  );
  const { mutate: bindStreams, isPending: isBinding } =
    courseQueries.bind_course_streams();
  const { mutate: deleteStream, isPending: isDeleting } =
    courseQueries.delete_course_stream();

  const handleAdd = (data: CourseStreamItemPayload) => {
    bindStreams(
      {
        course: courseId,
        title: data.title,
        streams: [data],
      },
      {
        onSuccess: () => setIsAddOpen(false),
      }
    );
  };

  const handleDelete = () => {
    if (!streamToDelete) return;

    deleteStream(streamToDelete.id, {
      onSuccess: () => setStreamToDelete(null),
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="flex items-center gap-2">
              <LuUsers className="h-5 w-5 text-primary" />
              Потоки
            </CardTitle>
            <CardDescription>
              Список потоков, которым доступен этот курс. Можно добавить новый
              поток или убрать существующий.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <LuPlus />
            Добавить поток
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Поток</TableHead>
                    <TableHead>Идентификатор</TableHead>
                    <TableHead className="w-[60px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-6" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">
              Не удалось загрузить потоки. {error.message}
            </p>
          ) : streams.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <LuUsers />
                </EmptyMedia>
                <EmptyTitle>Потоки ещё не добавлены</EmptyTitle>
                <EmptyDescription>
                  Добавьте поток, чтобы студенты этой группы увидели курс.
                </EmptyDescription>
           
              </EmptyContent>
            </Empty>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Поток</TableHead>
                    <TableHead>Идентификатор</TableHead>
                    <TableHead className="w-[60px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {streams.map((stream) => (
                    <TableRow key={stream.id}>
                      <TableCell className="font-medium">{stream.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{stream.stream_id}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => setStreamToDelete(stream)}
                          aria-label={`Удалить поток ${stream.title}`}
                        >
                          <LuTrash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddStreamDialog
        open={isAddOpen}
        onOpenChange={(open) => {
          if (!isBinding) setIsAddOpen(open);
        }}
        onSubmit={handleAdd}
        isPending={isBinding}
      />

      <AlertDialog
        open={!!streamToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setStreamToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить поток?</AlertDialogTitle>
            <AlertDialogDescription>
              Поток «{streamToDelete?.title}» потеряет доступ к этому курсу.
              Студенты потока больше не увидят темы и материалы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаляем..." : "Удалить"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
