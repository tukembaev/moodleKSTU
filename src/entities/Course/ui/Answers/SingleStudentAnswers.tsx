import { FileAnswer } from "entities/Course/model/types/course";
import { LuFile, LuUpload } from "react-icons/lu";
import { SpringPopupList } from "shared/components";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { AnswerFileAttachment } from "./AnswerFileAttachment";

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

  const renderCardSkeleton = () => (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFileCards = () => {
    if (!data.length) {
      return (
        <div className="flex w-full min-h-64 items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-4 rounded-2xl bg-muted/50">
              <LuFile className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Файлы отсутствуют</p>
              <p className="text-sm text-muted-foreground">
                Добавьте свой первый файл!
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid w-full gap-3 grid-cols-1 sm:grid-cols-2">
        <SpringPopupList>
          {data.map((material) => (
            <AnswerFileAttachment
              key={material.id}
              file={material}
              canDelete
              className="w-full max-w-full"
            />
          ))}
        </SpringPopupList>
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">{error.message}</div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4">
      <Button
        variant={data.length ? "outline" : "default"}
        className="h-11 w-full gap-2 sm:h-9 sm:w-auto sm:self-end"
        onClick={() => openForm(FormQuery.ADD_ANSWER, { id })}
      >
        <LuUpload className="h-4 w-4" />
        Добавить файл
      </Button>

      {isLoading ? renderCardSkeleton() : renderFileCards()}
    </div>
  );
};

export default SingleStudentAnswers;
