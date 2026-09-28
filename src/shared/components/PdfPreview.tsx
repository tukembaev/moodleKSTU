import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  inDialog?: boolean;
}

const PdfViewer = ({ url, inDialog = false }: PdfViewerProps) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(0.5);
  const [containerWidth, setContainerWidth] = useState<number>(960);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setContainerWidth(Math.max(width - 48, 320));
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.pdf";
    link.click();
  };

  const openInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.25));
  };

  const handleFitWidth = () => {
    setScale(0.5);
    viewportRef.current?.scrollTo({ top: 0, left: 0 });
  };

  const pageWidth = containerWidth * scale;
  const pages = numPages ? Array.from({ length: numPages }, (_, index) => index + 1) : [];

  const toolbar = (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-background/95 p-2">
      <span className="px-1 text-sm font-medium">
        {numPages ? t("{{count}} стр.", { count: numPages }) : t("Документ")}
      </span>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleZoomOut}
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
          onClick={handleZoomIn}
          disabled={scale >= 3}
          variant="outline"
          size="sm"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleFitWidth}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <Maximize2 className="h-4 w-4" />
          {t("По ширине")}
        </Button>
      </div>
    </div>
  );

  const content = (
    <div
      ref={containerRef}
      className={inDialog ? "flex h-full min-h-0 flex-col" : "flex min-h-[70vh] flex-col p-4"}
    >
      {!inDialog && (
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t("Документ")}</h3>
        </div>
      )}

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
        {toolbar}
        <div
          ref={viewportRef}
          className="min-h-0 flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900"
        >
          <Document
            file={url}
            onLoadSuccess={({ numPages: nextPages }) => setNumPages(nextPages)}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-muted-foreground">
                  {t("Загрузка документа...")}
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-8">
                <div className="text-destructive">{t("Ошибка загрузки документа")}</div>
              </div>
            }
          >
            <div className="flex flex-col items-center gap-4 p-4">
              {pages.map((page) => (
                <Page
                  key={page}
                  pageNumber={page}
                  width={pageWidth}
                  renderTextLayer
                  renderAnnotationLayer
                  className="shadow-xl"
                  devicePixelRatio={
                    typeof window !== "undefined"
                      ? Math.min(window.devicePixelRatio || 1, 2)
                      : 1
                  }
                />
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );

  if (inDialog) {
    return content;
  }

  return (
    <Card className="h-fit transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
};

export default PdfViewer;
