import { CourseMaterials } from "entities/Course/model/types/course";
import {
  DownloadIcon,
  ExternalLinkIcon,
  LinkIcon,
  Trash2Icon,
} from "lucide-react";
import { UseConfirmationDialog, UseTooltip } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import {
  getExtension,
  getFileKindIcon,
  getYouTubeId,
  isImageExt,
  isPdfExt,
} from "shared/lib/fileKind";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "shared/shadcn/ui/attachment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";

function downloadUrl(url: string, fileName?: string) {
  const link = document.createElement("a");
  link.href = url;
  if (fileName) link.download = fileName;
  link.rel = "noopener noreferrer";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function MaterialAttachment({
  material,
  canDelete = false,
  onDelete,
  className,
}: {
  material: CourseMaterials;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
  className?: string;
}) {
  const isUrl = Boolean(material.url);
  const youtubeId = isUrl ? getYouTubeId(material.url) : null;
  const sourceName = isUrl
    ? material.url_name || "Ссылка на материал"
    : material.file_name || "Без названия";
  const fileSource = material.file || material.files || "";
  const extension = getExtension(material.file_name || fileSource);
  const isPdf = !isUrl && (isPdfExt(extension) || fileSource.toLowerCase().includes(".pdf"));
  const isImage = !isUrl && isImageExt(extension);
  const FileKindIcon = getFileKindIcon(extension);

  const typeLabel = isUrl
    ? youtubeId
      ? "YouTube"
      : "Ссылка"
    : extension
      ? extension.toUpperCase()
      : "Файл";
  const description = [typeLabel, material.description].filter(Boolean).join(" · ");

  const deleteAction = canDelete ? (
    <UseConfirmationDialog
      title="Удалить материал?"
      description={`«${sourceName}» будет удалён без возможности восстановления.`}
      onConfirm={() => onDelete?.(material.id)}
      trigger={
        <AttachmentAction
          variant="ghost"
          aria-label={`Удалить ${sourceName}`}
          className="text-destructive hover:text-destructive"
        >
          <Trash2Icon />
        </AttachmentAction>
      }
    />
  ) : null;

  const title = (
    <UseTooltip text={sourceName}>
      <AttachmentTitle>{sourceName}</AttachmentTitle>
    </UseTooltip>
  );

  if (isUrl && youtubeId) {
    const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    return (
      <Dialog>
        <Attachment className={className}>
          <AttachmentMedia variant="image">
            <img src={thumb} alt={sourceName} />
          </AttachmentMedia>
          <AttachmentContent>
            {title}
            <AttachmentDescription>{description}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              aria-label={`Открыть ${sourceName} на YouTube`}
              onClick={() => window.open(material.url, "_blank", "noopener,noreferrer")}
            >
              <ExternalLinkIcon />
            </AttachmentAction>
            {deleteAction}
          </AttachmentActions>
          <DialogTrigger asChild>
            <AttachmentTrigger aria-label={`Смотреть ${sourceName}`} />
          </DialogTrigger>
        </Attachment>
        <DialogContent className="max-w-4xl w-[90vw] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>{sourceName}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="relative w-full overflow-hidden rounded-lg bg-muted pt-[56.25%]">
              <iframe
                className="absolute inset-0 size-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={sourceName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isUrl) {
    return (
      <Attachment className={className}>
        <AttachmentMedia>
          <LinkIcon />
        </AttachmentMedia>
        <AttachmentContent>
          {title}
          <AttachmentDescription>{description}</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction
            aria-label={`Открыть ${sourceName}`}
            onClick={() => window.open(material.url, "_blank", "noopener,noreferrer")}
          >
            <ExternalLinkIcon />
          </AttachmentAction>
          {deleteAction}
        </AttachmentActions>
        <AttachmentTrigger
          asChild
          aria-label={`Открыть ${sourceName}`}
        >
          <a href={material.url} target="_blank" rel="noopener noreferrer" />
        </AttachmentTrigger>
      </Attachment>
    );
  }

  const actions = (
    <AttachmentActions>
      <AttachmentAction
        aria-label={`Скачать ${sourceName}`}
        onClick={() => downloadUrl(fileSource, material.file_name)}
      >
        <DownloadIcon />
      </AttachmentAction>
      {deleteAction}
    </AttachmentActions>
  );

  const media = isImage ? (
    <AttachmentMedia variant="image">
      <img src={fileSource} alt={sourceName} />
    </AttachmentMedia>
  ) : (
    <AttachmentMedia>
      <FileKindIcon />
    </AttachmentMedia>
  );

  const content = (
    <AttachmentContent>
      {title}
      <AttachmentDescription>{description}</AttachmentDescription>
    </AttachmentContent>
  );

  if (isPdf) {
    return (
      <Dialog>
        <Attachment className={className}>
          {media}
          {content}
          {actions}
          <DialogTrigger asChild>
            <AttachmentTrigger aria-label={`Открыть превью ${sourceName}`} />
          </DialogTrigger>
        </Attachment>
        <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>{sourceName}</DialogTitle>
          </DialogHeader>
          <PdfViewer url={fileSource} inDialog={true} />
        </DialogContent>
      </Dialog>
    );
  }

  if (isImage) {
    return (
      <Dialog>
        <Attachment className={className}>
          {media}
          {content}
          {actions}
          <DialogTrigger asChild>
            <AttachmentTrigger aria-label={`Открыть ${sourceName}`} />
          </DialogTrigger>
        </Attachment>
        <DialogContent className="max-w-4xl w-[90vw] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>{sourceName}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <img
              src={fileSource}
              alt={sourceName}
              className="max-h-[70vh] w-full rounded-lg object-contain bg-muted"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Attachment className={className}>
      {media}
      {content}
      {actions}
      <AttachmentTrigger asChild aria-label={`Скачать ${sourceName}`}>
        <a href={fileSource} download={material.file_name} />
      </AttachmentTrigger>
    </Attachment>
  );
}
