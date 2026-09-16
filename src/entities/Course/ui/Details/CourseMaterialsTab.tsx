import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DownloadIcon, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LuFolderOpen } from "react-icons/lu";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { CourseMaterialFile } from "entities/Course/model/types/course";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { getExtension, getFileKindIcon } from "shared/lib/fileKind";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "shared/shadcn/ui/empty";

function apiStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

function formatUploadedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
}

function groupByTheme(items: CourseMaterialFile[]) {
  const map = new Map<string, { title: string; files: CourseMaterialFile[] }>();
  for (const item of items) {
    const themeId = item.theme?.id || "unknown";
    const bucket = map.get(themeId) ?? {
      title: item.theme?.title || "Без темы",
      files: [],
    };
    bucket.files.push(item);
    map.set(themeId, bucket);
  }
  return [...map.entries()].map(([themeId, value]) => ({ themeId, ...value }));
}

function MaterialsSkeleton() {
  return (
    <div className="mt-4 space-y-4">
      <Skeleton className="h-9 w-full max-w-md" />
      {Array.from({ length: 3 }).map((_, group) => (
        <div key={group} className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <div className="rounded-md border divide-y">
            {Array.from({ length: 2 }).map((__, row) => (
              <div
                key={row}
                className="flex items-center gap-3 px-3 py-3"
              >
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const CourseMaterialsTab = ({
  onOpenTheme,
}: {
  onOpenTheme: (themeId: string) => void;
}) => {
  const courseId = useCourseId();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isPending, isFetching, error, refetch } = useQuery(
    courseQueries.courseMaterials(courseId || null, debouncedSearch)
  );

  const status = apiStatus(error);
  const materials = data ?? [];
  const groups = useMemo(() => groupByTheme(materials), [materials]);
  const hasSearch = Boolean(debouncedSearch);

  const searchField = (
    <div className="relative w-full sm:max-w-[360px]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Поиск по названию файла..."
        className="pl-9 pr-9"
        aria-label="Поиск по названию файла"
      />
      {isFetching && !isPending ? (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : null}
    </div>
  );

  if (isPending) {
    return <MaterialsSkeleton />;
  }

  if (status === 403) {
    return (
      <Empty className="mt-6 border-0">
        <EmptyHeader>
          <EmptyTitle>Нет доступа к материалам курса</EmptyTitle>
          <EmptyDescription>
            Войдите в аккаунт и убедитесь, что вы записаны на этот курс.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (status === 404) {
    return (
      <Empty className="mt-6 border-0">
        <EmptyHeader>
          <EmptyTitle>Курс не найден</EmptyTitle>
          <EmptyDescription>
            Этого курса нет или он был удалён.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (error) {
    return (
      <Empty className="mt-6 border-0">
        <EmptyHeader>
          <EmptyTitle>Не удалось загрузить материалы</EmptyTitle>
          <EmptyDescription>
            Проверьте соединение и попробуйте ещё раз.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => refetch()}>
            Повторить
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {searchField}

      {materials.length === 0 && !hasSearch ? (
        <Empty className="min-h-48 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuFolderOpen />
            </EmptyMedia>
            <EmptyTitle>К курсу пока не прикреплены файлы</EmptyTitle>
            <EmptyDescription>
              Учебные материалы появятся здесь, когда преподаватель
              прикрепит их к темам курса.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : materials.length === 0 ? (
        <Empty className="min-h-48 border-0">
          <EmptyHeader>
            <EmptyTitle>Ничего не найдено</EmptyTitle>
            <EmptyDescription>
              Ничего не найдено по запросу «{debouncedSearch}»
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group.themeId} className="space-y-2">
              <button
                type="button"
                className="group flex max-w-full items-baseline gap-2 text-left"
                onClick={() => {
                  if (group.themeId !== "unknown") onOpenTheme(group.themeId);
                }}
              >
                <h2 className="truncate text-sm font-semibold group-hover:underline">
                  {group.title}
                </h2>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {group.files.length}
                </span>
              </button>
              <ul className="divide-y rounded-md border">
                {group.files.map((item) => {
                  const FileKindIcon = getFileKindIcon(
                    getExtension(item.file_name || item.file)
                  );
                  return (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
                          <FileKindIcon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <a
                            href={item.file}
                            download={item.file_name}
                            target="_blank"
                            rel="noreferrer"
                            className="block truncate font-medium hover:underline"
                          >
                            {item.file_name || "Без названия"}
                          </a>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                            <button
                              type="button"
                              className="hover:text-foreground hover:underline"
                              onClick={() => onOpenTheme(item.theme.id)}
                            >
                              {item.theme.title}
                            </button>
                            <span aria-hidden="true">·</span>
                            <time dateTime={item.uploaded_at}>
                              {formatUploadedAt(item.uploaded_at)}
                            </time>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="shrink-0">
                        <a
                          href={item.file}
                          download={item.file_name}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <DownloadIcon />
                          Скачать
                        </a>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
