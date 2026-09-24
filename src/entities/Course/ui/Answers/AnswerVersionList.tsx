import { format } from "date-fns";
import { FileAnswer } from "entities/Course/model/types/course";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { getDateLocale } from "shared/config/i18n/dateLocale";
import { cn } from "shared/lib/utils";
import { Badge } from "shared/shadcn/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "shared/shadcn/ui/collapsible";
import {
  canDeleteAnswerFile,
  FileSubmissionGroup,
} from "../../lib/answerSubmissions";
import { AnswerFileAttachment } from "./AnswerFileAttachment";

function versionDateLabel(value: string | null, language: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, "d MMM yyyy", { locale: getDateLocale(language) });
}

function FileRow({
  files,
  className,
  layout,
  markAsReadOnOpen,
  onRead,
  deleteFallback,
  extra,
}: {
  files: FileAnswer[];
  className?: string;
  layout: "wrap" | "stack";
  markAsReadOnOpen?: boolean;
  onRead?: () => void;
  deleteFallback: boolean;
  extra?: ReactNode;
}) {
  return (
    <div
      className={cn(
        layout === "stack" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"
      )}
    >
      {files.map((file) => (
        <AnswerFileAttachment
          key={file.id}
          file={file}
          canDelete={canDeleteAnswerFile(file, deleteFallback)}
          markAsReadOnOpen={markAsReadOnOpen}
          onRead={onRead}
          className={className}
        />
      ))}
      {extra}
    </div>
  );
}

export function AnswerVersionList({
  groups,
  fileClassName,
  layout = "wrap",
  markAsReadOnOpen = false,
  onRead,
  deleteFallback = false,
  currentExtra,
}: {
  groups: FileSubmissionGroup[];
  fileClassName?: string;
  layout?: "wrap" | "stack";
  markAsReadOnOpen?: boolean;
  onRead?: () => void;
  deleteFallback?: boolean;
  currentExtra?: ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const hasVersionLabels = groups.some((group) => group.version != null);
  const current = groups.find((group) => group.isCurrent) ?? groups[0];
  const previous = groups.filter((group) => group !== current);

  if (!hasVersionLabels) {
    return (
      <FileRow
        files={groups.flatMap((group) => group.files)}
        className={fileClassName}
        layout={layout}
        markAsReadOnOpen={markAsReadOnOpen}
        onRead={onRead}
        deleteFallback={deleteFallback}
        extra={currentExtra}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {current ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              {current.version != null
                ? t("Версия {{version}}", { version: current.version })
                : t("Текущие файлы")}
            </p>
            <Badge variant="secondary" className="h-5 px-1.5 text-[11px]">
              {t("актуальная")}
            </Badge>
            {versionDateLabel(current.createdAt, i18n.language) ? (
              <span className="text-[11px] text-muted-foreground">
                {versionDateLabel(current.createdAt, i18n.language)}
              </span>
            ) : null}
          </div>
          <FileRow
            files={current.files}
            className={fileClassName}
            layout={layout}
            markAsReadOnOpen={markAsReadOnOpen}
            onRead={onRead}
            deleteFallback={deleteFallback}
            extra={currentExtra}
          />
        </div>
      ) : currentExtra ? (
        <FileRow
          files={[]}
          className={fileClassName}
          layout={layout}
          extra={currentExtra}
          deleteFallback={deleteFallback}
        />
      ) : null}

      {previous.length > 0 ? (
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md py-1 text-left text-xs font-medium text-muted-foreground hover:text-foreground">
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            {t("Предыдущие версии ({{count}})", { count: previous.length })}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            {previous.map((group) => {
              const dateLabel = versionDateLabel(group.createdAt, i18n.language);
              return (
              <div key={group.key} className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {group.version != null
                    ? t("Версия {{version}}", { version: group.version })
                    : t("Предыдущие файлы")}
                  {dateLabel ? ` · ${dateLabel}` : ""}
                </p>
                <FileRow
                  files={group.files}
                  className={fileClassName}
                  layout={layout}
                  markAsReadOnOpen={markAsReadOnOpen}
                  onRead={onRead}
                  deleteFallback={false}
                />
              </div>
            );
            })}
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  );
}
