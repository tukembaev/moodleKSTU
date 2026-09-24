import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getDateLocale } from "shared/config/i18n/dateLocale";
import i18n from "shared/config/i18n/i18n";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  LuFilePen,
  LuFilePlus2,
  LuFileX,
  LuHistory,
  LuPencil,
  LuPin,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import { apiErrorDetail } from "entities/Course/lib/apiErrorDetail";
import {
  announcementWasEdited,
  type FeedFilter,
  type FeedSortOrder,
} from "entities/Course/lib/courseFeed";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import {
  CourseAnnouncement,
  CourseFeedItem,
  CourseFeedKind,
  CreateAnnouncementPayload,
} from "entities/Course/model/types/course";
import { UseConfirmationDialog, UseTooltip } from "shared/components";
import { useAuth } from "shared/hooks";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { cn } from "shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";
import { FieldLabel } from "shared/components/FieldLabel";
import { toastRequiredField } from "shared/lib/onFormInvalid";
import { Label } from "shared/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { Textarea } from "shared/shadcn/ui/textarea";

function apiStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

function authorInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatFeedDate(value: string) {
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "d MMMM yyyy, HH:mm", { locale: getDateLocale(i18n.language) });
}

const KIND_UI: Record<
  CourseFeedKind,
  { label: string; className: string }
> = {
  announcement: {
    label: i18n.t("Объявление"),
    className: "border-transparent bg-primary/10 text-primary",
  },
  material_created: {
    label: i18n.t("Добавлен файл"),
    className: "border-transparent bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  },
  material_updated: {
    label: i18n.t("Изменён файл"),
    className: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  material_replaced: {
    label: i18n.t("Заменён файл"),
    className: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  material_deleted: {
    label: i18n.t("Удалён файл"),
    className: "border-transparent bg-destructive/10 text-destructive",
  },
};

function FeedSkeleton() {
  return (
    <div className="mt-4 space-y-3">
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="ml-auto h-8 w-44" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-md border px-4 py-3">
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnnouncementFormDialog({
  open,
  onOpenChange,
  title,
  description,
  initial,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initial?: Pick<CourseAnnouncement, "text" | "is_pinned">;
  isPending: boolean;
  onSubmit: (payload: CreateAnnouncementPayload) => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const [text, setText] = useState(initial?.text ?? "");
  const [isPinned, setIsPinned] = useState(initial?.is_pinned ?? false);
  const [textError, setTextError] = useState("");

  useEffect(() => {
    if (!open) return;
    setText(initial?.text ?? "");
    setIsPinned(initial?.is_pinned ?? false);
    setTextError("");
  }, [initial?.is_pinned, initial?.text, open]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextText = text.trim();
    if (!nextText) {
      setTextError(t("Введите текст объявления"));
      toastRequiredField(t("Заполните обязательное поле: Текст"));
      return;
    }
    try {
      await onSubmit({ text: nextText, is_pinned: isPinned });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setTextError(apiErrorDetail(error, t("Введите текст объявления")));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="announcement-text" required>
              {t("Текст")}
            </FieldLabel>
            <Textarea
              id="announcement-text"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                if (textError) setTextError("");
              }}
              placeholder={t("Напишите объявление для участников курса")}
              rows={5}
              aria-invalid={Boolean(textError)}
            />
            {textError ? (
              <span className="text-xs text-destructive">{textError}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="announcement-pin"
              checked={isPinned}
              onCheckedChange={(checked) => setIsPinned(checked === true)}
            />
            <Label htmlFor="announcement-pin" className="cursor-pointer font-normal">
              {t("Закрепить")}
            </Label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("Отмена")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : null}
              {isPending ? t("Сохраняем...") : t("Сохранить")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function toAnnouncement(item: CourseFeedItem): CourseAnnouncement | null {
  if (item.announcement?.id) return item.announcement;
  if (item.kind !== "announcement") return null;
  return {
    id: item.id,
    course_id: "",
    author: item.author ?? {
      id: 0,
      first_name: null,
      last_name: null,
      middle_name: null,
      avatar: null,
      full_name: i18n.t("Преподаватель"),
    },
    text: item.text ?? "",
    is_pinned: Boolean(item.is_pinned),
    can_manage: Boolean(item.can_manage),
    created_at: item.created_at,
    updated_at: item.updated_at || item.created_at,
  };
}

function AnnouncementCard({
  item,
  canManage,
  busyId,
  onEdit,
  onTogglePin,
  onDelete,
}: {
  item: CourseFeedItem;
  canManage: boolean;
  busyId: string | null;
  onEdit: (item: CourseAnnouncement) => void;
  onTogglePin: (item: CourseAnnouncement) => void;
  onDelete: (item: CourseAnnouncement) => void;
}) {
  const { t } = useTranslation();
  const announcement = toAnnouncement(item);
  const busy = busyId === item.id;
  const authorName = item.author?.full_name?.trim() || t("Преподаватель");
  const edited = announcementWasEdited(item);

  return (
    <article
      className={cn(
        "rounded-md border px-3 py-3 sm:px-4",
        item.is_pinned &&
          "border-primary/30 bg-primary/5 border-l-4 border-l-primary"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={item.author?.avatar ?? undefined} alt={authorName} />
          <AvatarFallback className="bg-muted text-xs">
            {authorInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-medium">{authorName}</p>
                <Badge variant="secondary" className={KIND_UI.announcement.className}>
                  {KIND_UI.announcement.label}
                </Badge>
                {item.is_pinned ? (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <LuPin className="size-3" />
                    {t("Закреплено")}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatFeedDate(item.created_at)}
                {edited && item.updated_at
                  ? t(" · изменено {{date}}", { date: formatFeedDate(item.updated_at) })
                  : ""}
              </p>
            </div>
            {canManage && announcement ? (
              <div className="flex shrink-0 items-center">
                <UseTooltip text={item.is_pinned ? t("Открепить") : t("Закрепить")}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={busy}
                    onClick={() => onTogglePin(announcement)}
                    aria-label={item.is_pinned ? t("Открепить") : t("Закрепить")}
                  >
                    <LuPin className={item.is_pinned ? "fill-current" : ""} />
                  </Button>
                </UseTooltip>
                <UseTooltip text={t("Редактировать")}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={busy}
                    onClick={() => onEdit(announcement)}
                    aria-label={t("Редактировать")}
                  >
                    <LuPencil />
                  </Button>
                </UseTooltip>
                <UseConfirmationDialog
                  title={t("Удалить объявление?")}
                  description={t("Объявление будет удалено без возможности восстановления.")}
                  onConfirm={() => onDelete(announcement)}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={busy}
                      aria-label={t("Удалить")}
                      className="text-destructive hover:text-destructive"
                    >
                      <LuTrash2 />
                    </Button>
                  }
                />
              </div>
            ) : null}
          </div>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm">
            {item.text}
          </p>
        </div>
      </div>
    </article>
  );
}

function MaterialEventCard({
  item,
  onOpenTheme,
}: {
  item: CourseFeedItem;
  onOpenTheme?: (themeId: string) => void;
}) {
  const { t } = useTranslation();
  const kind = item.kind;
  const ui = KIND_UI[kind];
  const authorName = item.author?.full_name?.trim();
  const fileName = item.material?.file_name || t("Без названия");
  const previousName = item.material?.previous_file_name;
  const themeTitle = item.material?.theme?.title;
  const themeId = item.material?.theme?.id;
  const fileUrl = item.material?.file;
  const Icon =
    kind === "material_deleted"
      ? LuFileX
      : kind === "material_created"
        ? LuFilePlus2
        : LuFilePen;

  const actionText =
    kind === "material_deleted"
      ? t("удалил(а) учебный материал")
      : kind === "material_replaced"
        ? t("заменил(а) учебный материал")
        : kind === "material_updated"
          ? t("изменил(а) учебный материал")
          : t("добавил(а) учебный материал");

  return (
    <article
      className={cn(
        "rounded-md border px-3 py-3 sm:px-4",
        kind === "material_deleted" && "border-destructive/20 bg-destructive/5",
        (kind === "material_updated" || kind === "material_replaced") &&
          "border-amber-500/25 bg-amber-500/5"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={ui.className}>
              {ui.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t("Системная запись · нельзя скрыть")}
            </span>
          </div>
          <p className="mt-1.5 text-sm">
            {authorName ? (
              <span className="font-medium">{authorName} </span>
            ) : null}
            {actionText}{" "}
            <span className="font-medium">«{fileName}»</span>
            {kind === "material_replaced" && previousName ? (
              <>
                {" "}
                {t("(было «{{name}}»)", { name: previousName })}
              </>
            ) : null}
            {themeTitle ? (
              <>
                {" "}
                {t("в теме")}{" "}
                {themeId && onOpenTheme ? (
                  <button
                    type="button"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                    onClick={() => onOpenTheme(themeId)}
                  >
                    {themeTitle}
                  </button>
                ) : (
                  <span className="font-medium">{themeTitle}</span>
                )}
              </>
            ) : null}
            .
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatFeedDate(item.created_at)}
          </p>
          {fileUrl && kind !== "material_deleted" ? (
            <a
              href={fileUrl}
              download={fileName}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm text-primary underline-offset-2 hover:underline"
            >
              {t("Открыть файл")}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export const CourseAnnouncementsTab = ({
  onOpenTheme,
}: {
  onOpenTheme?: (themeId: string) => void;
}) => {
  const { t } = useTranslation();
  const courseId = useCourseId();
  const { id: userId, isStudent } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<CourseAnnouncement | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [sortOrder, setSortOrder] = useState<FeedSortOrder>("desc");

  const { data, isPending, isFetching, error, refetch } = useQuery(
    courseQueries.feed(courseId || null, sortOrder, filter)
  );
  const { data: courseModules } = useQuery(
    courseQueries.courseModules(courseId || "")
  );
  const { mutateAsync: createAnnouncement, isPending: isCreating } =
    courseQueries.create_announcement();
  const { mutateAsync: updateAnnouncement, isPending: isUpdating } =
    courseQueries.edit_announcement();
  const { mutateAsync: deleteAnnouncement } = courseQueries.delete_announcement();

  const items = data ?? [];
  const status = apiStatus(error);

  const canManage = useMemo(() => {
    if (!isStudent) return true;
    if (items.some((item) => item.can_manage)) return true;
    if (!userId) return false;
    return (
      courseModules?.course_owner?.some((owner) => {
        const ids = [owner.user_id, owner.id, owner.owner];
        return ids.some((ownerId) => {
          if (ownerId == null || ownerId === "") return false;
          const left = Number(ownerId);
          const right = Number(userId);
          if (Number.isFinite(left) && Number.isFinite(right) && left > 0 && right > 0) {
            return left === right;
          }
          return String(ownerId) === String(userId);
        });
      }) ?? false
    );
  }, [courseModules?.course_owner, items, isStudent, userId]);

  if (isPending) {
    return <FeedSkeleton />;
  }

  if (status === 403) {
    return (
      <Empty className="mt-6 border-0">
        <EmptyHeader>
          <EmptyTitle>{t("Нет доступа к ленте курса")}</EmptyTitle>
          <EmptyDescription>
            {t("Ленту видят только участники курса.")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (status === 404) {
    return (
      <Empty className="mt-6 border-0">
        <EmptyHeader>
          <EmptyTitle>{t("Курс не найден")}</EmptyTitle>
          <EmptyDescription>
            {t("Этого курса нет или он был удалён.")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (error) {
    return (
      <Empty className="mt-6 border-0">
        <EmptyHeader>
          <EmptyTitle>{t("Не удалось загрузить ленту")}</EmptyTitle>
          <EmptyDescription>
            {apiErrorDetail(error, t("Проверьте соединение и попробуйте ещё раз."))}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => refetch()}>
            {t("Повторить")}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const filters: { value: FeedFilter; label: string }[] = [
    { value: "all", label: t("Все") },
    { value: "announcement", label: t("Объявления") },
    { value: "materials", label: t("Материалы") },
  ];

  return (
    <div className="mt-4 flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {t("Объявления преподавателя и журнал изменений учебных материалов. Загрузки, замены и удаления файлов сохраняются, чтобы история курса оставалась прозрачной.")}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {filters.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={filter === option.value ? "default" : "outline"}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {isFetching ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground sm:mr-1" />
          ) : null}
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as FeedSortOrder)}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder={t("Сортировка")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">{t("Сначала новые")}</SelectItem>
              <SelectItem value="asc">{t("Сначала старые")}</SelectItem>
            </SelectContent>
          </Select>
          {canManage ? (
            <Button
              type="button"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setCreateOpen(true)}
            >
              <LuPlus />
              {t("Новое объявление")}
            </Button>
          ) : null}
        </div>
      </div>

      {items.length === 0 ? (
        <Empty className="min-h-48 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuHistory />
            </EmptyMedia>
            <EmptyTitle>
              {filter === "all" ? t("Лента пока пустая") : t("Нет записей по фильтру")}
            </EmptyTitle>
            <EmptyDescription>
              {filter === "all"
                ? canManage
                  ? t("Опубликуйте объявление или добавьте материал в теме — запись появится здесь.")
                  : t("Когда преподаватель опубликует объявление или изменит материалы, это появится здесь.")
                : t("Сбросьте фильтр, чтобы увидеть все события.")}
            </EmptyDescription>
          </EmptyHeader>
          {canManage && filter !== "materials" ? (
            <EmptyContent>
              <Button type="button" onClick={() => setCreateOpen(true)}>
                <LuPlus />
                {t("Создать объявление")}
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              {item.kind === "announcement" ? (
                <AnnouncementCard
                  item={item}
                  canManage={Boolean(item.can_manage)}
                  busyId={mutatingId}
                  onEdit={setEditing}
                  onTogglePin={(announcement) => {
                    setMutatingId(announcement.id);
                    void updateAnnouncement({
                      courseId,
                      announcementId: announcement.id,
                      is_pinned: !announcement.is_pinned,
                    }).finally(() => setMutatingId(null));
                  }}
                  onDelete={(announcement) => {
                    setMutatingId(announcement.id);
                    void deleteAnnouncement({
                      courseId,
                      announcementId: announcement.id,
                    }).finally(() => setMutatingId(null));
                  }}
                />
              ) : (
                <MaterialEventCard item={item} onOpenTheme={onOpenTheme} />
              )}
            </li>
          ))}
        </ul>
      )}

      <AnnouncementFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t("Новое объявление")}
        description={t("Текст увидят все студенты и преподаватели курса.")}
        isPending={isCreating}
        onSubmit={async (payload) => {
          await createAnnouncement({ courseId, ...payload });
          setCreateOpen(false);
        }}
      />

      <AnnouncementFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        title={t("Редактировать объявление")}
        description={t("Можно изменить текст и закрепление. Автор и дата создания не меняются.")}
        initial={
          editing
            ? { text: editing.text, is_pinned: editing.is_pinned }
            : undefined
        }
        isPending={isUpdating}
        onSubmit={async (payload) => {
          if (!editing) return;
          await updateAnnouncement({
            courseId,
            announcementId: editing.id,
            ...payload,
          });
          setEditing(null);
        }}
      />
    </div>
  );
};
