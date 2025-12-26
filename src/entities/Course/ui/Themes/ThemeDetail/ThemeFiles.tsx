import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseMaterials } from "entities/Course/model/types/course";
import { useState } from "react";
import {
  LuClipboardList,
  LuEye,
  LuEyeClosed,
  LuFolderDown,
  LuGlasses,
  LuList,
  LuMessageSquareText,
  LuTrash2,
  LuLink,
  LuFile,
  LuFileText,
} from "react-icons/lu";
import { HoverLift, UseTabs, UseTooltip, SpringPopupList } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "shared/shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "shared/shadcn/ui/dialog";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/shadcn/ui/table";


import { StudentComments } from "features/Course/hooks/StudentComments";
import ThemeAnswers from "../../Answers/ThemeAnswers";
import { ThemeFeed } from "./ThemeFeed";
import ThemeFAQ from "./ThemeFAQ";


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
    ...(auth_data.isStudent
      ? [
        {
          name: "Замечания",
          value: "comments",
          content: <StudentComments theme_id={id} />,
          icon: <LuClipboardList />,
        },
      ]
      : []),
  ];

  // Объединяем материалы с файлами и URL в один массив
  const allMaterials = [
    ...(data?.filter((material) => material.files) || []),
    ...(data?.filter((material) => material.url) || []),
  ];

  const { mutate: delete_material } = courseQueries.delete_material();

  // Render card skeleton for loading state (mobile/tablet)
  const renderCardSkeleton = () => (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render material cards for mobile/tablet
  const renderMaterialCards = () => (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {!allMaterials.length ? (
        <div className="col-span-full py-8 text-center text-muted-foreground">
          <LuFile className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>Учебный материал пуст</p>
        </div>
      ) : (
        <SpringPopupList>
          {allMaterials.map((material) => (
            <Card 
              key={material.id} 
              className="overflow-hidden hover:shadow-md transition-all duration-300 group"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      material.url 
                        ? "bg-blue-50 dark:bg-blue-950/30" 
                        : "bg-primary/10"
                    }`}>
                      {material.url ? (
                        <LuLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <LuFileText className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 min-w-0">
                      {material.url ? (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {material.url_name || "Ссылка на материал"}
                        </a>
                      ) : (
                        material.file_name || "Без названия"
                      )}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {material.description && (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground line-clamp-1"
                  >
                    {material.description}
                  </Badge>
                )}
                <div className="flex gap-2 flex-wrap">
                  {material.file?.includes(".pdf") && (
                    <Dialog
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setPreview(null);
                        }
                      }}
                      open={preview?.id === material.id}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleOpenPreview(material)}
                        >
                          {preview?.id === material.id ? (
                            <LuEyeClosed className="h-4 w-4" />
                          ) : (
                            <LuEye className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">Просмотр</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
                        <DialogHeader className="px-6 pt-6 pb-0">
                          <DialogTitle>{material.file_name || "Документ PDF"}</DialogTitle>
                        </DialogHeader>
                        <PdfViewer url={material.file || ""} inDialog={true} />
                      </DialogContent>
                    </Dialog>
                  )}
                  {material.file && (
                    <a
                      href={material.file}
                      download={material.file_name}
                    >
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <LuFolderDown className="h-4 w-4" />
                        <span className="hidden sm:inline">Скачать</span>
                      </Button>
                    </a>
                  )}
                  {isOwner && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => delete_material(material.id)}
                    >
                      <LuTrash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Удалить</span>
                    </Button>
                  )}
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
                <TableCell className="font-medium max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {material.url ? (
                    <UseTooltip text={material.url_name || "Ссылка на материал"}>
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline "
                      >
                        {material.url_name || "Ссылка на материал"}
                      </a>

                    </UseTooltip>

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
                      <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
                        <DialogHeader className="px-6 pt-6 pb-0">
                          <DialogTitle>{material.file_name || "Документ PDF"}</DialogTitle>
                        </DialogHeader>
                        <PdfViewer url={material.file || ""} inDialog={true} />
                      </DialogContent>
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
  );

  if (error) {
    return <p>Ошибка: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4 pt-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-lg font-semibold">Учебные материалы</p>
          {/* Add material button for mobile */}
          {!auth_data.isStudent && (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => openForm(FormQuery.ADD_MATERIAL, { id })}
            >
              Добавить материал
            </Button>
          )}
        </div>
        
        {/* Mobile and Tablet view (cards) */}
        <div className="block lg:hidden">
          {isLoading ? renderCardSkeleton() : renderMaterialCards()}
        </div>

        {/* Desktop view (table) */}
        <div className="hidden lg:block">
          {renderTable()}
        </div>
      </div>
      {/* <ThemeQuiz course_id={course_id} course_name={course_name} theme_id={id}/> */}
      <UseTabs tabs={tabs} />
    </div>
  );
};

export default ThemeFiles;
