import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { StudentComments } from "features/Course/hooks/StudentComments";
import {
  LuClipboardList,
  LuFile,
  LuGlasses,
  LuList,
  LuMessageSquareText,
  LuUpload,
} from "react-icons/lu";
import { UseTabs } from "shared/components";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import ThemeAnswers from "../../Answers/ThemeAnswers";
import { AddMaterialCard } from "../../Themes2/AddMaterialCard";
import { MaterialAttachment } from "../../Themes2/MaterialAttachment";
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
      name: "FAQDADADAD",
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

  const renderMaterials = () => {
    if (isLoading) {
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-14 min-w-[240px] flex-1 max-w-md rounded-xl"
            />
          ))}
        </div>
      );
    }

    if (!allMaterials.length) {
      return (
        <div className="flex flex-wrap gap-2">
          {!auth_data.isStudent ? (
            <AddMaterialCard themeId={id} />
          ) : (
            <div className="w-full py-8 text-center text-muted-foreground">
              <LuFile className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Учебный материал пуст</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {allMaterials.map((material) => (
          <MaterialAttachment
            key={material.id}
            material={material}
            canDelete={isOwner}
            onDelete={delete_material}
            className="min-w-[240px] flex-1 max-w-md"
          />
        ))}
        {!auth_data.isStudent && <AddMaterialCard themeId={id} />}
      </div>
    );
  };

  if (error) {
    return <p>Ошибка: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4 pt-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold">Учебные материалы</p>
          {!auth_data.isStudent && (
            <Button
              variant="outline"
              className="h-11 w-full gap-2 sm:h-9 sm:w-auto"
              onClick={() => openForm(FormQuery.ADD_MATERIAL, { id })}
            >
              <LuUpload className="h-4 w-4" />
              Добавить файл
            </Button>
          )}
        </div>
        {renderMaterials()}
      </div>
      <UseTabs tabs={tabs} />
    </div>
  );
};

export default ThemeFiles;
