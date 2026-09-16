import {
  CourseAnnouncement,
  CourseFeedItem,
  CourseFeedKind,
  CourseFeedMaterial,
} from "entities/Course/model/types/course";

const FEED_KINDS = new Set<CourseFeedKind>([
  "announcement",
  "material_created",
  "material_updated",
  "material_replaced",
  "material_deleted",
]);

export type FeedSortOrder = "desc" | "asc";
export type FeedFilter = "all" | "announcement" | "materials";

export function unwrapList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.results)) return record.results;
    if (Array.isArray(record.items)) return record.items;
    if (Array.isArray(record.data)) return record.data;
  }
  return [];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function parseKind(value: unknown): CourseFeedKind | null {
  const raw = asString(value).trim().toLowerCase();
  const aliases: Record<string, CourseFeedKind> = {
    announcement: "announcement",
    announcements: "announcement",
    material_created: "material_created",
    material_added: "material_created",
    material_uploaded: "material_created",
    created: "material_created",
    material_updated: "material_updated",
    material_changed: "material_updated",
    updated: "material_updated",
    material_replaced: "material_replaced",
    material_replaced_file: "material_replaced",
    replaced: "material_replaced",
    material_deleted: "material_deleted",
    material_removed: "material_deleted",
    deleted: "material_deleted",
  };
  const mapped = aliases[raw];
  if (mapped && FEED_KINDS.has(mapped)) return mapped;
  return null;
}

function parseTheme(value: unknown): CourseFeedMaterial["theme"] {
  const record = asRecord(value);
  if (!record) return null;
  const id = asString(record.id);
  const title = asString(record.title);
  if (!id && !title) return null;
  return { id, title: title || "Без темы" };
}

function parseMaterial(value: unknown): CourseFeedMaterial | null {
  const record = asRecord(value);
  if (!record) return null;
  const fileName =
    asString(record.file_name) ||
    asString(record.filename) ||
    asString(record.name);
  if (!fileName && !record.file) return null;
  return {
    id: asString(record.id) || null,
    file_name: fileName || "Без названия",
    previous_file_name:
      asString(record.previous_file_name) ||
      asString(record.old_file_name) ||
      null,
    file: asString(record.file) || asString(record.url) || null,
    theme: parseTheme(record.theme),
  };
}

export function normalizeFeedItem(raw: unknown): CourseFeedItem | null {
  const record = asRecord(raw);
  if (!record) return null;

  const kind =
    parseKind(record.kind) ||
    parseKind(record.event_type) ||
    parseKind(record.type) ||
    (record.text != null && record.is_pinned != null
      ? "announcement"
      : null);

  if (!kind) return null;

  const id = asString(record.id);
  const createdAt = asString(record.created_at) || asString(record.timestamp);
  if (!id || !createdAt) return null;

  const announcement =
    kind === "announcement"
      ? ((record.announcement as CourseAnnouncement | undefined) ??
        (raw as CourseAnnouncement))
      : null;

  return {
    id,
    kind,
    created_at: createdAt,
    updated_at: asString(record.updated_at) || announcement?.updated_at || null,
    author: (record.author as CourseFeedItem["author"]) ?? announcement?.author ?? null,
    is_pinned: Boolean(record.is_pinned ?? announcement?.is_pinned),
    can_manage: Boolean(record.can_manage ?? announcement?.can_manage),
    text: asString(record.text) || announcement?.text || null,
    material:
      parseMaterial(record.material) ||
      parseMaterial({
        id: record.material_id,
        file_name: record.file_name,
        previous_file_name: record.previous_file_name,
        file: record.file,
        theme: record.theme,
      }),
    announcement,
  };
}

export function announcementWasEdited(item: CourseFeedItem) {
  if (item.kind !== "announcement" || !item.updated_at) return false;
  const created = Date.parse(item.created_at);
  const updated = Date.parse(item.updated_at);
  if (!Number.isFinite(created) || !Number.isFinite(updated)) return false;
  return updated - created > 60_000;
}
