import { FC } from "react";
import { LuPlus, LuUpload } from "react-icons/lu";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";

interface AddMaterialCardProps {
  themeId: string;
}

export const AddMaterialCard: FC<AddMaterialCardProps> = ({ themeId }) => {
  const openForm = useForm();

  return (

      <div
        className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all cursor-pointer min-h-[140px]"
        onClick={() => openForm(FormQuery.ADD_MATERIAL, { id: themeId })}
      >
        {/* Иконки */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
            <LuPlus className="size-5 text-primary" />
          </div>
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
            <LuUpload className="size-5 text-primary" />
          </div>
        </div>

        {/* Текст */}
        <div className="text-center px-2">
          <p className="text-xs font-medium text-foreground mb-1">
            Добавить материал
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Нажмите и загрузите или перенесите файлы
          </p>
        </div>
      </div>

  );
};
