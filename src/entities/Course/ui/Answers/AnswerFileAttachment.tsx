import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "shared/config/i18n/dateLocale";
import { makeIsRead } from "entities/Course/model/services/courseAPI";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { FileAnswer } from "entities/Course/model/types/course";
import { DownloadIcon, Trash2Icon } from "lucide-react";
import { UseConfirmationDialog, UseTooltip } from "shared/components";
import PdfViewer from "shared/components/PdfPreview";
import { getExtension, getFileKindIcon, isImageExt, isPdfExt } from "shared/lib/fileKind";
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

function markRead(fileId: string, onRead?: () => void) {
  makeIsRead(fileId).then(() => onRead?.());
}

export function AnswerFileAttachment({
  file,
  canDelete = false,
  markAsReadOnOpen = false,
  onRead,
  className,
}: {
  file: FileAnswer;
  canDelete?: boolean;
  markAsReadOnOpen?: boolean;
  onRead?: () => void;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const { mutate: deleteFile, isPending: isDeleting } =
    courseQueries.delete_answer();

  const extension = getExtension(file.file_names);
  const isPdf = isPdfExt(extension);
  const isImage = isImageExt(extension);
  const FileKindIcon = getFileKindIcon(extension);

  const createdLabel = file.created_at
    ? format(file.created_at, "d MMM yyyy", { locale: getDateLocale(i18n.language) })
    : null;
  const readLabel = file.is_read?.is_read
    ? file.is_read.read
      ? t("Просмотрен {{date}}", {
          date: format(file.is_read.read, "d MMM, p", {
            locale: getDateLocale(i18n.language),
          }),
        })
      : t("Просмотрен")
    : t("Не просмотрен");

  const description = [extension ? extension.toUpperCase() : null, createdLabel, readLabel]
    .filter(Boolean)
    .join(" · ");

  const handleOpen = () => {
    if (markAsReadOnOpen) {
      markRead(file.id, onRead);
    }
  };

  const previewTrigger = (
    <DialogTrigger asChild>
      <AttachmentTrigger
        aria-label={
          isPdf
            ? t("Открыть превью {{name}}", { name: file.file_names })
            : t("Открыть {{name}}", { name: file.file_names })
        }
        onClick={handleOpen}
      />
    </DialogTrigger>
  );

  const media = isImage ? (
    <AttachmentMedia variant="image">
      <img src={file.file} alt={file.file_names} />
    </AttachmentMedia>
  ) : (
    <AttachmentMedia>
      <FileKindIcon />
    </AttachmentMedia>
  );

  const content = (
    <AttachmentContent>
      <UseTooltip text={file.file_names}>
        <AttachmentTitle>{file.file_names}</AttachmentTitle>
      </UseTooltip>
      <AttachmentDescription>{description}</AttachmentDescription>
    </AttachmentContent>
  );

  const actions = (
    <AttachmentActions>
      <AttachmentAction
        aria-label={t("Скачать {{name}}", { name: file.file_names })}
        onClick={() => {
          handleOpen();
          const link = document.createElement("a");
          link.href = file.file;
          link.download = file.file_names;
          link.rel = "noopener noreferrer";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          link.remove();
        }}
      >
        <DownloadIcon />
      </AttachmentAction>
      {canDelete && (
        <UseConfirmationDialog
          title={t("Удалить файл?")}
          description={t("Файл «{{name}}» будет удалён без возможности восстановления.", { name: file.file_names })}
          onConfirm={() => deleteFile(file.id)}
          trigger={
            <AttachmentAction
              variant="ghost"
              disabled={isDeleting}
              aria-label={t("Удалить {{name}}", { name: file.file_names })}
              className="text-destructive hover:text-destructive"
            >
              <Trash2Icon />
            </AttachmentAction>
          }
        />
      )}
    </AttachmentActions>
  );

  const body = (
    <>
      {media}
      {content}
      {actions}
    </>
  );

  if (isPdf) {
    return (
      <Dialog>
        <Attachment className={className} state={file.is_read?.is_read ? "done" : "idle"}>
          {body}
          {previewTrigger}
        </Attachment>
        <DialogContent className="max-w-screen-2xl w-[90vw] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>{file.file_names}</DialogTitle>
          </DialogHeader>
          <PdfViewer url={file.file || ""} inDialog={true} />
        </DialogContent>
      </Dialog>
    );
  }

  if (isImage) {
    return (
      <Dialog>
        <Attachment className={className} state={file.is_read?.is_read ? "done" : "idle"}>
          {body}
          {previewTrigger}
        </Attachment>
        <DialogContent className="max-w-4xl w-[90vw] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>{file.file_names}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <img
              src={file.file}
              alt={file.file_names}
              className="max-h-[70vh] w-full rounded-lg object-contain bg-muted"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Attachment className={className} state={file.is_read?.is_read ? "done" : "idle"}>
      {body}
      <AttachmentTrigger
        asChild
        aria-label={t("Скачать {{name}}", { name: file.file_names })}
      >
        <a
          href={file.file}
          download={file.file_names}
          onClick={() => handleOpen()}
        />
      </AttachmentTrigger>
    </Attachment>
  );
}
