import { FileAnswer, StudentsAnswers, TaskSubmission } from "../model/types/course";
import { RemarkStatus } from "entities/Remarks";
import i18n from "shared/config/i18n/i18n";

export interface FileSubmissionGroup {
  key: string;
  submissionId?: string | null;
  version: number | null;
  isCurrent: boolean;
  createdAt: string | null;
  files: FileAnswer[];
}

export function groupAnswerFiles(files: FileAnswer[]): FileSubmissionGroup[] {
  if (!files.length) return [];

  const hasVersionMeta = files.some(
    (file) => file.submission_id != null || file.version != null
  );

  if (!hasVersionMeta) {
    return [
      {
        key: "legacy",
        version: null,
        isCurrent: true,
        createdAt: files[0]?.created_at ?? null,
        files,
      },
    ];
  }

  const map = new Map<string, FileSubmissionGroup>();

  for (const file of files) {
    const key =
      file.submission_id ??
      (file.version != null ? `version-${file.version}` : `file-${file.id}`);
    const existing = map.get(key);
    if (existing) {
      existing.files.push(file);
      if (file.is_current) existing.isCurrent = true;
      if (
        file.created_at &&
        (!existing.createdAt || file.created_at < existing.createdAt)
      ) {
        existing.createdAt = file.created_at;
      }
      if (existing.version == null && file.version != null) {
        existing.version = file.version;
      }
    } else {
      map.set(key, {
        key,
        submissionId: file.submission_id ?? null,
        version: file.version ?? null,
        isCurrent: file.is_current === true,
        createdAt: file.created_at ?? null,
        files: [file],
      });
    }
  }

  const groups = [...map.values()];
  if (!groups.some((group) => group.isCurrent)) {
    const maxVersion = Math.max(...groups.map((group) => group.version ?? 0), 0);
    const current =
      groups.find((group) => group.version === maxVersion) ?? groups[0];
    if (current) current.isCurrent = true;
  }

  return sortSubmissionGroups(groups);
}

export function groupsFromStudent(student: StudentsAnswers): FileSubmissionGroup[] {
  if (student.submissions && student.submissions.length > 0) {
    return sortSubmissionGroups(student.submissions.map(submissionToGroup));
  }
  return groupAnswerFiles(student.files ?? []);
}

export function canUploadAnswerFiles(
  files: FileAnswer[],
  canResubmit?: boolean
): boolean {
  if (files.length === 0) return true;
  if (typeof canResubmit === "boolean") return canResubmit;
  const flags = files
    .map((file) => file.can_resubmit)
    .filter((value): value is boolean => typeof value === "boolean");
  if (flags.length === 0) return true;
  return flags.some(Boolean);
}

export function canDeleteAnswerFile(
  file: FileAnswer,
  fallback: boolean
): boolean {
  if (typeof file.can_delete === "boolean") return file.can_delete;
  return fallback;
}

export function currentSubmissionIdFromStudent(
  student: StudentsAnswers
): string | undefined {
  const current = student.submissions?.find((submission) => submission.is_current);
  if (current?.id) return current.id;
  const file =
    student.files.find((item) => item.is_current && item.submission_id) ??
    student.files.find((item) => item.submission_id);
  return file?.submission_id ?? undefined;
}

export function blockedUploadCaption(
  remarks: Array<{ status?: string | null }>
): string {
  const statuses = remarks.map((remark) => String(remark.status ?? "").toLowerCase());
  if (statuses.includes(RemarkStatus.REJECTED)) {
    return i18n.t("Новую версию можно загрузить после замечания преподавателя");
  }
  if (
    statuses.includes(RemarkStatus.PENDING) ||
    statuses.includes(RemarkStatus.RESPONDED)
  ) {
    return i18n.t("Ожидает проверки");
  }
  return i18n.t("Загрузка закрыта");
}

function submissionToGroup(submission: TaskSubmission): FileSubmissionGroup {
  return {
    key: submission.id,
    submissionId: submission.id,
    version: submission.version,
    isCurrent: submission.is_current,
    createdAt: submission.created_at,
    files: submission.files ?? [],
  };
}

function sortSubmissionGroups(groups: FileSubmissionGroup[]): FileSubmissionGroup[] {
  return [...groups].sort((left, right) => {
    if (left.isCurrent !== right.isCurrent) return left.isCurrent ? -1 : 1;
    return (right.version ?? 0) - (left.version ?? 0);
  });
}
