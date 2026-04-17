import { CourseMaterials } from "entities/Course/model/types/course";
import { FC, useState } from "react";
import {
  LuExternalLink,
  LuEye,
  LuFileText,
  LuFolderDown,
  LuGlasses,
  LuTrash2,
} from "react-icons/lu";
import { UseTooltip } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import { Button } from "shared/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";

interface MaterialCardProps {
  material: CourseMaterials;
  isOwner: boolean;
  onDelete: (id: string) => void;
}

export const MaterialCard: FC<MaterialCardProps> = ({
  material,
  isOwner,
  onDelete,
}) => {
  const [preview, setPreview] = useState(false);
  const isPdf = material.file?.includes(".pdf");
  const isUrl = !!material.url;

  const getFileIcon = () => {
    if (isUrl) return <LuGlasses className="size-8" />;
    if (isPdf) return <LuFileText className="size-8" />;
    return <LuFolderDown className="size-8" />;
  };

  const fileName = isUrl
    ? material.url_name || "Ссылка на материал"
    : material.file_name || "Без названия";

  const getTooltipContent = () => {
    return (
      <div className="flex flex-col gap-1 max-w-[250px]">
        <p className="font-semibold">{fileName}</p>
        {material.description && (
          <p className="text-xs text-muted-foreground">{material.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {isUrl ? "Внешняя ссылка" : isPdf ? "PDF документ" : "Файл для скачивания"}
        </p>
      </div>
    );
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUrl) {
      window.open(material.url, "_blank", "noopener,noreferrer");
    } else if (material.file) {
      window.open(material.file, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <UseTooltip text={getTooltipContent()} side="top">
      <div className="relative group">
  
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
            {/* Иконка файла */}
            <div className="flex items-center justify-center h-20 w-full">
              {getFileIcon()}
            </div>

            {/* Название файла */}
            <p className="text-xs text-center w-full truncate px-1">
              {fileName}
            </p>
          </div>
       
        {/* Кнопки действий при наведении */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Кнопка открыть/скачать */}
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 shadow-md"
            onClick={handleDownload}
          >
            <LuExternalLink className="h-3.5 w-3.5" />
          </Button>

          {/* Кнопка предпросмотра для PDF */}
          {isPdf && (
            <Dialog open={preview} onOpenChange={setPreview}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LuEye className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-0">
                  <DialogTitle>
                    {material.file_name || "Документ PDF"}
                  </DialogTitle>
                </DialogHeader>
                <PdfViewer url={material.file || ""} inDialog={true} />
              </DialogContent>
            </Dialog>
          )}

          {/* Кнопка удаления для владельца */}
          {isOwner && (
            <Button
              variant="destructive"
              size="icon"
              className="h-7 w-7 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(material.id);
              }}
            >
              <LuTrash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </UseTooltip>
  );
};
