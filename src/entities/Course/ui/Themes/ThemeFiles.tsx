import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  LuChevronsUpDown,
  LuEye,
  LuEyeClosed,
  LuFolderDown,
  LuGlasses,
  LuList,
  LuMessageSquareText,
  LuTrash2,
} from "react-icons/lu";
import { HoverLift, ModalPreview, UseTabs } from "shared/components";
import { useAuth, useForm } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "shared/shadcn/ui/collapsible";
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

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseMaterials } from "entities/Course/model/types/course";
import { FormQuery } from "shared/config";
import { Badge } from "shared/shadcn/ui/badge";
import ThemeAnswers from "../Answers/ThemeAnswers";
import ThemeFAQ from "./ThemeFAQ";
import { ThemeFeed } from "./ThemeFeed";

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
  const materialsWithFiles = data?.filter((material) => material.files);
  const materialsWithUrls = data?.filter((material) => material.url);

  const { mutate: delete_material } = courseQueries.delete_material();
  if (error) {
    return <p>Ошибка : {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-3 pt-6">
      <>
        <div className="flex flex-col gap-3 ">
          <p className="text-lg font-semibold">Учебный материал</p>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] py-4">Название</TableHead>
                  <TableHead className="w-[300px] py-4">Описание</TableHead>

                  {!auth_data.isStudent && (
                    <TableHead className="text-right">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() =>
                          openForm(FormQuery.ADD_MATERIAL, { id: id })
                        }
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
                ) : !materialsWithFiles?.length ? (
                  <TableRow key={1}>
                    <TableCell colSpan={4}>Учебный материал пуст</TableCell>
                  </TableRow>
                ) : (
                  materialsWithFiles?.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.file_name}
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
                        {material.file.includes(".pdf") && (
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
                        <a
                          href={material.file}
                          download={material.files}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Button variant="outline" size="icon">
                            <LuFolderDown />
                          </Button>
                        </a>
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
        {materialsWithUrls?.length && (
          <Collapsible>
            <CollapsibleTrigger className="text-lg font-semibold flex gap-2">
              <span>Учебные видео ({materialsWithUrls?.length})</span>

              <Button variant="ghost" size="sm">
                <LuChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {materialsWithUrls?.map((video) => (
                  <div key={video.id} className="rounded-md border p-4">
                    <p className="mb-2 font-semibold">{video.url_name}</p>
                    <iframe
                      className="w-full aspect-video rounded"
                      src={video.url.replace("watch?v=", "embed/")}
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </>

      <UseTabs tabs={tabs} />
    </div>
  );
};

export default ThemeFiles;
