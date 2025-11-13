import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseMaterials } from "entities/Course/model/types/course";
import { useState } from "react";
import {
  LuEye,
  LuEyeClosed,
  LuFolderDown,
  LuGlasses,
  LuList,
  LuMessageSquareText,
  LuTrash2,
} from "react-icons/lu";
import { HoverLift, ModalPreview, UseTabs } from "shared/components";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Dialog, DialogTrigger } from "shared/shadcn/ui/dialog";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";
import ThemeAnswers from "../Answers/ThemeAnswers";

import ThemeFAQ from "./ThemeFAQ";
import { ThemeFeed } from "./ThemeFeed";
import ThemeQuiz from "./ThemeQuiz";

const ThemeFiles = ({ id, isOwner }: { id: string; isOwner: boolean }) => {
  const { data, isLoading, error } = useQuery(
    courseQueries.allTaskMaterials(id)
  );
  const { data: comments, isLoading: isLoadingComments } = useQuery(
    courseQueries.allThemeFeed(id)
  );

  const auth_data = useAuth();
  const openForm = useForm();

  const [preview, setPreview] = useState<CourseMaterials | null>(null);

  const handleOpenPreview = (material: CourseMaterials) => {
    if (preview?.id === material.id) {
      setPreview(null);
    } else {
      setPreview(material);
    }
  };

  const tabs = [
    {
      name: auth_data.isStudent ? "Мои файлы" : "Список студентов",
      value: "theme_answers",
      content: <ThemeAnswers id={id} />,
      icon: <LuList />,
    },
    {
      name: "Обсуждение",
      value: "feed",
      content: (
        <ThemeFeed
          items={comments || []}
          isLoading={isLoadingComments}
          theme_id={id}
        />
      ),
      icon: <LuMessageSquareText />,
    },
    {
      name: "FAQ",
      value: "faq",
      content: <ThemeFAQ theme_id={id} />,
      icon: <LuGlasses />,
    },
  ];

  // Объединяем материалы с файлами и URL в один массив
  const allMaterials = [
    ...(data?.filter((material) => material.files) || []),
    ...(data?.filter((material) => material.url) || []),
  ];

  const { mutate: delete_material } = courseQueries.delete_material();

  if (error) {
    return <p>Ошибка: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-3 pt-6">
      <div className="flex flex-col gap-3">
        <p className="text-lg font-semibold">Учебный материал</p>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] py-4">Название</TableHead>
                <TableHead className="w-[300px] py-4">Описание</TableHead>
                {!auth_data.isStudent && (
                  <TableHead className="text-right">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => openForm(FormQuery.ADD_MATERIAL, { id })}
                    >
                      Добавить материал
                    </Button>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell className="flex justify-end gap-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !allMaterials.length ? (
                <TableRow>
                  <TableCell colSpan={4}>Учебный материал пуст</TableCell>
                </TableRow>
              ) : (
                allMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      {material.url ? (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {material.url_name || "Ссылка на материал"}
                        </a>
                      ) : (
                        material.file_name || "Без названия"
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <HoverLift>
                        <Badge
                          variant="outline"
                          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
                        >
                          {material.description}
                        </Badge>
                      </HoverLift>
                    </TableCell>
                    <TableCell className="justify-end flex gap-3">
                      {material.file?.includes(".pdf") && (
                        <Dialog
                          onOpenChange={(isOpen) => {
                            if (!isOpen) {
                              setPreview(null);
                            }
                          }}
                          open={preview?.id === material.id}
                        >
                          <DialogTrigger>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleOpenPreview(material)}
                            >
                              {preview?.id === material.id ? (
                                <LuEyeClosed />
                              ) : (
                                <LuEye />
                              )}
                            </Button>
                          </DialogTrigger>
                          <ModalPreview data={material} />
                        </Dialog>
                      )}
                      {material.file && (
                        <a
                          href={material.file}
                          download={material.file_name}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Button variant="outline" size="icon">
                            <LuFolderDown />
                          </Button>
                        </a>
                      )}
                      {isOwner && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => delete_material(material.id)}
                        >
                          <LuTrash2 />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ThemeQuiz />
      <UseTabs tabs={tabs} />
    </div>
  );
};

export default ThemeFiles;
