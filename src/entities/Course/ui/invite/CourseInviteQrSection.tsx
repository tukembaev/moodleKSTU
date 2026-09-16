import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { ChevronDown, Download, QrCode, Trash2 } from "lucide-react";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { Button } from "shared/shadcn/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "shared/shadcn/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { toast } from "sonner";

const INVITE_DURATIONS: { label: string; duration: string | null }[] = [
  { label: "1 день", duration: "P1D" },
  { label: "3 дня", duration: "P3D" },
  { label: "Неделя", duration: "P7D" },
  { label: "Месяц", duration: "P30D" },
  { label: "Год", duration: "P365D" },
  { label: "Бессрочно", duration: null },
];

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let current = words[0];
  for (const word of words.slice(1)) {
    const test = `${current} ${word}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Не удалось загрузить QR"));
    img.src = src;
  });
}

async function downloadInvitePoster(options: {
  qrDataUrl: string;
  courseName: string;
  teacherName: string;
  fileName: string;
}) {
  const width = 900;
  const height = 1240;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas недоступен");

  const qrImage = await loadImage(options.qrDataUrl);
  const courseName = options.courseName.trim() || "Курс";
  const teacherName = options.teacherName.trim();
  const pad = 80;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#e4e4e7";
  ctx.fillRect(40, 40, width - 80, height - 80);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(44, 44, width - 88, height - 88);

  ctx.textAlign = "center";
  ctx.fillStyle = "#3f3f46";
  ctx.font = "600 22px Arial, sans-serif";
  ctx.fillText("ПРИГЛАШЕНИЕ НА КУРС", width / 2, 120);

  ctx.fillStyle = "#18181b";
  ctx.font = "700 42px Arial, sans-serif";
  const titleLines = wrapCanvasText(ctx, courseName, width - pad * 2).slice(0, 3);
  let y = 188;
  titleLines.forEach((line) => {
    ctx.fillText(line, width / 2, y);
    y += 52;
  });

  ctx.strokeStyle = "#e4e4e7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad + 40, y + 12);
  ctx.lineTo(width - pad - 40, y + 12);
  ctx.stroke();

  y += 56;
  if (teacherName) {
    ctx.fillStyle = "#71717a";
    ctx.font = "500 18px Arial, sans-serif";
    ctx.fillText("Преподаватель", width / 2, y);
    y += 36;
    ctx.fillStyle = "#27272a";
    ctx.font = "600 28px Arial, sans-serif";
    const teacherLines = wrapCanvasText(ctx, teacherName, width - pad * 2).slice(0, 2);
    teacherLines.forEach((line) => {
      ctx.fillText(line, width / 2, y);
      y += 38;
    });
  }

  const qrSize = 400;
  const qrX = (width - qrSize) / 2;
  const qrY = Math.max(y + 36, 520);
  const framePad = 28;

  ctx.fillStyle = "#f4f4f5";
  roundRect(
    ctx,
    qrX - framePad,
    qrY - framePad,
    qrSize + framePad * 2,
    qrSize + framePad * 2,
    24
  );
  ctx.fill();
  ctx.strokeStyle = "#e4e4e7";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = "#3f3f46";
  ctx.font = "500 22px Arial, sans-serif";
  ctx.fillText("Отсканируйте код, чтобы вступить на курс", width / 2, qrY + qrSize + 72);

  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Не удалось создать файл"));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = options.fileName;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, "image/png");
  });
}

export function CourseInviteQrButton({
  courseId,
  courseName,
  teacherName,
}: {
  courseId: string;
  courseName?: string;
  teacherName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dataUrl, setDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const title = courseName?.trim() || "Курс";
  const teacher = teacherName?.trim() || "";

  const {
    data: invite,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...courseQueries.courseInviteLink(courseId),
    enabled: open && Boolean(courseId),
  });
  const { mutate: createInvite, isPending: isCreating } =
    courseQueries.create_course_invite();
  const { mutate: deleteInvite, isPending: isDeleting } =
    courseQueries.delete_course_invite();

  const inviteUrl = invite?.link ?? "";

  useEffect(() => {
    if (!open || !inviteUrl) {
      setDataUrl("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(inviteUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) toast.error("Не удалось сформировать QR-код");
      });
    return () => {
      cancelled = true;
    };
  }, [open, inviteUrl]);

  const onCreate = (duration: string | null) => {
    createInvite({ course_id: courseId, duration });
  };

  const onDelete = () => {
    deleteInvite(courseId, {
      onSuccess: () => setConfirmDelete(false),
    });
  };

  const onDownload = async () => {
    if (!dataUrl) return;
    setDownloading(true);
    try {
      const safeName = title.replace(/[\\/:*?"<>|]+/g, " ").trim() || "course";
      await downloadInvitePoster({
        qrDataUrl: dataUrl,
        courseName: title,
        teacherName: teacher,
        fileName: `invite-${safeName}.png`,
      });
    } catch {
      toast.error("Не удалось скачать изображение");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-label="QR-код курса"
            className="h-auto self-stretch aspect-square shrink-0 px-0"
          >
            <QrCode className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Приглашение на курс</DialogTitle>
            <DialogDescription>
              {title}
              {teacher ? `. Преподаватель: ${teacher}` : ""}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex flex-col items-center py-2">
              <div className="h-56 w-56 animate-pulse rounded-md bg-muted" />
            </div>
          ) : isError ? (
            <Empty className="border border-dashed p-6 md:p-6">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <QrCode />
                </EmptyMedia>
                <EmptyTitle>Не удалось загрузить приглашение</EmptyTitle>
                <EmptyDescription>
                  {error instanceof Error
                    ? error.message
                    : "Попробуйте открыть окно ещё раз"}
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : inviteUrl ? (
            <div className="flex flex-col items-center py-2">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="QR-код приглашения на курс"
                  className="h-56 w-56 rounded-md border bg-white p-2"
                />
              ) : (
                <div className="h-56 w-56 animate-pulse rounded-md bg-muted" />
              )}
            </div>
          ) : (
            <Empty className="border border-dashed p-6 md:p-6">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <QrCode />
                </EmptyMedia>
                <EmptyTitle>Приглашение ещё не создано</EmptyTitle>
                <EmptyDescription>
                  Создайте ссылку и выберите срок действия — студенты смогут
                  вступить на курс по QR-коду.
                </EmptyDescription>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" disabled={isCreating} className="gap-2">
                      {isCreating ? "Создаём..." : "Создать приглашение"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-52">
                    <DropdownMenuLabel>Срок действия</DropdownMenuLabel>
                    {INVITE_DURATIONS.map((item) => (
                      <DropdownMenuItem
                        key={item.label}
                        disabled={isCreating}
                        onSelect={() => onCreate(item.duration)}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </EmptyContent>
            </Empty>
          )}

          {inviteUrl ? (
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                type="button"
                className="w-full gap-2"
                onClick={onDownload}
                disabled={!dataUrl || downloading}
              >
                <Download className="h-4 w-4" />
                {downloading ? "Готовим файл..." : "Скачать PNG"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 text-destructive hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Удалить приглашение
              </Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDelete}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isDeleting) setConfirmDelete(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить приглашение?</AlertDialogTitle>
            <AlertDialogDescription>
              QR-код и ссылка перестанут работать. Чтобы пригласить студентов
              снова, нужно будет создать новое приглашение.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаляем..." : "Удалить"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
