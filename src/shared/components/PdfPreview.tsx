
import { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2,
  ExternalLink
} from "lucide-react";

// Импортируем react-pdf для просмотра PDF
import { Document, Page, pdfjs } from "react-pdf";

// Импортируем стили для react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";

// Используем версию worker, соответствующую версии pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  inDialog?: boolean; // Если true, не используем Card обертку
}

const PdfViewer = ({ url, inDialog = false }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(0.8);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width - 32);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
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
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const toggleFullWidth = () => {
    setIsFullWidth(prev => !prev);
  };

  const pageWidth = isFullWidth ? containerWidth : Math.min(containerWidth, 600);

  const content = (
    <div className={inDialog ? "px-6 pb-6" : "p-4"} ref={containerRef}>
      {!inDialog && (
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Документ</h3>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={openInNewTab}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Открыть в новой вкладке
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Скачать
          </Button>
        </div>
      </div>

      {/* Панель управления */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 p-2 border rounded-lg bg-muted/30">
        {/* Навигация по страницам */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrevPage}
            disabled={pageNumber <= 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            {pageNumber} / {numPages || "..."}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={pageNumber >= (numPages || 1)}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Управление масштабом */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            variant="outline"
            size="sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            onClick={handleZoomIn}
            disabled={scale >= 3.0}
            variant="outline"
            size="sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          {/* <Button
            onClick={toggleFullWidth}
            variant="outline"
            size="sm"
            title={isFullWidth ? "Обычная ширина" : "На всю ширину"}
          >
            {isFullWidth ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button> */}
        </div>
      </div>
      
      <div className={`flex justify-center overflow-auto ${inDialog ? "max-h-[calc(90vh-16rem)]" : "max-h-[calc(100vh-20rem)]"} rounded-lg border bg-muted/10`}>
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="animate-pulse text-muted-foreground">Загрузка документа...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-8">
              <div className="text-destructive">Ошибка загрузки документа</div>
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber}
            width={pageWidth * scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );

  if (inDialog) {
    return content;
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 h-fit">
      <CardContent className="p-0">
        {content}
      </CardContent>
    </Card>
  );
};

export default PdfViewer;
