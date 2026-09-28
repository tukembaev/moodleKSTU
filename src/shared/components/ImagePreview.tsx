import { useState } from "react";
import { Download, ExternalLink, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";

interface ImagePreviewProps {
  url: string;
  alt?: string;
}

const ImagePreview = ({ url, alt }: ImagePreviewProps) => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(0.5);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = alt || "image";
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    link.click();
  };

  const openInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2 px-1">
        <Button onClick={openInNewTab} variant="outline" size="sm" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          {t("Открыть в новой вкладке")}
        </Button>
        <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          {t("Скачать")}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-muted/20">
        <div className="flex shrink-0 items-center justify-end gap-2 border-b bg-background/95 p-2">
          <Button
            onClick={() => setScale((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.25))}
            disabled={scale <= 0.25}
            variant="outline"
            size="sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[52px] text-center text-sm font-medium">
            {Math.round(scale * 100)}%
          </span>
          <Button
            onClick={() => setScale((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 3))}
            disabled={scale >= 3}
            variant="outline"
            size="sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={() => setScale(0.5)} variant="outline" size="sm" className="gap-1.5">
            <Maximize2 className="h-4 w-4" />
            {t("По ширине")}
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900">
          <div className="flex justify-center p-4">
            <img
              src={url}
              alt={alt || t("Изображение")}
              className="max-w-none rounded-md shadow-xl"
              style={{ width: `${scale * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
