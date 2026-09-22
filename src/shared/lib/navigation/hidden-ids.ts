import { useEffect, useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { useParams } from "react-router-dom";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type HiddenIdKey =
  | "courseId"
  | "quizId"
  | "themeId"
  | "taskId"
  | "inviteCourseId"
  | "inviteLinkId"
  | "bankId";

const STORAGE_PREFIX = "hidden:";
const FORM_PARAMS_KEY = "hidden:formParams";
const CHANGED_EVENT = "hidden-ids:changed";

export const COURSE_THEMES_PATH = "/courses/course_themes";
export const COURSE_INVITE_PATH = "/courses/invite";
export const COURSE_FEED_TAB = "feed";
export const COURSE_ANNOUNCEMENTS_TAB = "announcements";
export const COURSE_ANNOUNCEMENT_TYPE = "Объявление курса";
export const COURSE_FEED_MATERIAL_TYPES = [
  "Материал курса",
  "Добавлен материал курса",
  "Удалён материал курса",
  "Изменён материал курса",
] as const;

export function isCourseFeedTab(value: string | null | undefined) {
  return value === COURSE_FEED_TAB || value === COURSE_ANNOUNCEMENTS_TAB;
}
export const TEST_PASS_PATH = "/test/pass";
export const TEST_EDIT_PATH = "/test/edit";
export const TEST_QUIZ_PATH = "/test/quiz";
export const TEST_QUIZ_RESULT_PATH = "/test/quiz-result";
export const QUESTION_BANK_DETAIL_PATH = "/question-bank/bank";

export function isUuid(value: string | null | undefined): boolean {
  return Boolean(value && UUID_RE.test(value));
}

function storageKey(key: HiddenIdKey): string {
  return `${STORAGE_PREFIX}${key}`;
}

function emitChanged() {
  window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function setHiddenId(key: HiddenIdKey, value: string | null | undefined) {
  if (typeof window === "undefined") return;
  if (!value) {
    sessionStorage.removeItem(storageKey(key));
    emitChanged();
    return;
  }
  sessionStorage.setItem(storageKey(key), value);
  emitChanged();
}

export function getHiddenId(key: HiddenIdKey): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(storageKey(key));
}

export function clearHiddenId(key: HiddenIdKey) {
  setHiddenId(key, null);
}

export function getFormHiddenParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(FORM_PARAMS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function setFormHiddenParams(params: Record<string, string>) {
  if (typeof window === "undefined") return;
  const next = { ...getFormHiddenParams(), ...params };
  sessionStorage.setItem(FORM_PARAMS_KEY, JSON.stringify(next));
  emitChanged();
}

export function getFormHiddenParam(key: string): string | null {
  return getFormHiddenParams()[key] ?? null;
}

export function clearFormHiddenParams() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(FORM_PARAMS_KEY);
  emitChanged();
}

export function useHiddenId(key: HiddenIdKey): string {
  const [value, setValue] = useState(() => getHiddenId(key) ?? "");

  useEffect(() => {
    const sync = () => setValue(getHiddenId(key) ?? "");
    sync();
    window.addEventListener(CHANGED_EVENT, sync);
    return () => window.removeEventListener(CHANGED_EVENT, sync);
  }, [key]);

  return value;
}

export function useCourseId(): string {
  const params = useParams();
  const hidden = useHiddenId("courseId");
  const fromParam = params.id && isUuid(params.id) ? params.id : "";

  useEffect(() => {
    if (fromParam && !hidden) setHiddenId("courseId", fromParam);
  }, [fromParam, hidden]);

  return hidden || fromParam;
}

export function useQuizId(): string {
  const params = useParams();
  const hidden = useHiddenId("quizId");
  const fromParam =
    (params.id && isUuid(params.id) ? params.id : "") ||
    (params.quizId && isUuid(params.quizId) ? params.quizId : "");

  useEffect(() => {
    if (fromParam && !hidden) setHiddenId("quizId", fromParam);
  }, [fromParam, hidden]);

  return hidden || fromParam;
}

export function getPostLoginPath(): string {
  if (getHiddenId("inviteCourseId")) return COURSE_INVITE_PATH;
  return "/today";
}

export function getCourseInviteUrl(
  courseId: string,
  linkId?: string | null
): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  if (linkId) {
    return `${origin}/course/${courseId}/${linkId}/invite`;
  }
  const params = new URLSearchParams({ course_id: courseId });
  return `${origin}${COURSE_INVITE_PATH}?${params.toString()}`;
}

function firstUuid(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    if (value && isUuid(value)) return value;
  }
  return null;
}

export function isCourseInvitePath(pathname: string): boolean {
  return (
    pathname === COURSE_INVITE_PATH ||
    /^\/courses\/course_themes\/[^/]+\/invite(?:\/[^/]+)?\/?$/.test(pathname) ||
    /^\/courses\/invite\/[^/]+(?:\/[^/]+)?\/?$/.test(pathname) ||
    /^\/course\/[^/]+\/[^/]+\/invite\/?$/.test(pathname)
  );
}

export function parseCourseInviteIds(
  pathname: string,
  search: string
): { courseId: string | null; linkId: string | null } {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search
  );
  const themeInvite = pathname.match(
    /^\/courses\/course_themes\/([^/]+)\/invite(?:\/([^/]+))?\/?$/
  );
  const invitePair = pathname.match(/^\/courses\/invite\/([^/]+)\/([^/]+)\/?$/);
  const backendInvite = pathname.match(
    /^\/course\/([^/]+)\/([^/]+)\/invite\/?$/
  );

  return {
    courseId: firstUuid(
      params.get("course_id"),
      params.get("courseId"),
      themeInvite?.[1],
      invitePair?.[1],
      backendInvite?.[1]
    ),
    linkId: firstUuid(
      params.get("link_id"),
      params.get("linkId"),
      themeInvite?.[2],
      invitePair?.[2],
      backendInvite?.[2]
    ),
  };
}

export function parseCourseInviteIdsFromHref(href: string): {
  courseId: string | null;
  linkId: string | null;
} {
  const trimmed = href.trim();
  if (!trimmed) return { courseId: null, linkId: null };
  try {
    const url = new URL(trimmed, "https://local.invalid");
    return parseCourseInviteIds(url.pathname, url.search);
  } catch {
    const [path, query] = trimmed.split("?");
    return parseCourseInviteIds(path, query ? `?${query}` : "");
  }
}

export function parseCourseAnnouncementCourseId(
  href?: string | null
): string | null {
  if (!href?.trim()) return null;
  const pattern =
    /\/courses\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/(?:announcements|feed)\/?$/i;
  try {
    const url = new URL(href.trim(), "https://local.invalid");
    return url.pathname.match(pattern)?.[1] ?? null;
  } catch {
    const [path] = href.trim().split("?");
    return path.match(pattern)?.[1] ?? null;
  }
}

export type FocusCourseItem = {
  kind: "theme" | "test";
  id: string;
};

const FOCUS_COURSE_ITEM_KEY = "hidden:focusCourseItem";

export function setFocusCourseItem(item: FocusCourseItem | null) {
  if (typeof window === "undefined") return;
  if (!item?.id) {
    sessionStorage.removeItem(FOCUS_COURSE_ITEM_KEY);
    return;
  }
  sessionStorage.setItem(FOCUS_COURSE_ITEM_KEY, JSON.stringify(item));
}

export function peekFocusCourseItem(): FocusCourseItem | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FOCUS_COURSE_ITEM_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FocusCourseItem;
    if (!parsed?.id || (parsed.kind !== "theme" && parsed.kind !== "test")) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearFocusCourseItem() {
  setFocusCourseItem(null);
}

export function openCourse(
  navigate: NavigateFunction,
  courseId: string | null | undefined,
  options?: {
    themeId?: string;
    replace?: boolean;
    tab?: string;
    selectedItem?: FocusCourseItem;
  }
) {
  if (!courseId) return;
  setHiddenId("courseId", courseId);
  const selectedItem =
    options?.selectedItem ??
    (options?.themeId
      ? { kind: "theme" as const, id: options.themeId }
      : undefined);
  if (selectedItem?.kind === "theme") setHiddenId("themeId", selectedItem.id);
  else clearHiddenId("themeId");
  setFocusCourseItem(selectedItem ?? null);
  const search = options?.tab
    ? `?tab=${encodeURIComponent(options.tab)}`
    : "";
  navigate(
    { pathname: COURSE_THEMES_PATH, search },
    { replace: options?.replace }
  );
}

export function openTestPass(
  navigate: NavigateFunction,
  quizId: string,
  courseId?: string | null
) {
  setHiddenId("quizId", quizId);
  if (courseId) setHiddenId("courseId", courseId);
  navigate(TEST_PASS_PATH);
}

export function openTestEdit(navigate: NavigateFunction, quizId: string) {
  setHiddenId("quizId", quizId);
  navigate(TEST_EDIT_PATH);
}

export function openTestResult(
  navigate: NavigateFunction,
  quizId: string,
  options?: { courseId?: string | null; state?: unknown }
) {
  setHiddenId("quizId", quizId);
  if (options?.courseId) setHiddenId("courseId", options.courseId);
  navigate(TEST_QUIZ_RESULT_PATH, { state: options?.state });
}

export function useBankId(): string {
  const params = useParams();
  const hidden = useHiddenId("bankId");
  const fromParam = params.id && isUuid(params.id) ? params.id : "";

  useEffect(() => {
    if (fromParam && !hidden) setHiddenId("bankId", fromParam);
  }, [fromParam, hidden]);

  return hidden || fromParam;
}

export function openBank(navigate: NavigateFunction, bankId: string) {
  setHiddenId("bankId", bankId);
  navigate(QUESTION_BANK_DETAIL_PATH);
}

type CaptureResult = {
  changed: boolean;
  pathname: string;
  search: string;
};

const TEST_PATH_RULES: Array<[RegExp, string]> = [
  [/^\/test\/pass\/([^/]+)\/?$/, TEST_PASS_PATH],
  [/^\/test\/edit\/([^/]+)\/?$/, TEST_EDIT_PATH],
  [/^\/test\/quiz\/([^/]+)\/?$/, TEST_QUIZ_PATH],
  [/^\/test\/quiz-result\/([^/]+)\/?$/, TEST_QUIZ_RESULT_PATH],
];

export function captureHiddenIdsFromLocation(
  pathname: string,
  search: string
): CaptureResult {
  let path = pathname;
  let changed = false;
  const formHidden: Record<string, string> = {};
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search
  );

  const inviteIds = parseCourseInviteIds(path, search);
  const isInvitePath = isCourseInvitePath(path);

  if (inviteIds.courseId && (isInvitePath || Boolean(inviteIds.linkId))) {
    setHiddenId("inviteCourseId", inviteIds.courseId);
    setHiddenId("courseId", inviteIds.courseId);
    if (inviteIds.linkId) setHiddenId("inviteLinkId", inviteIds.linkId);
    if (path !== COURSE_INVITE_PATH) {
      path = COURSE_INVITE_PATH;
      changed = true;
    }
    for (const key of ["course_id", "courseId", "link_id", "linkId"]) {
      if (params.has(key)) {
        params.delete(key);
        changed = true;
      }
    }
  }

  const courseMatch = path.match(/^\/courses\/course_themes\/([^/]+)\/?$/);
  if (courseMatch && isUuid(courseMatch[1])) {
    setHiddenId("courseId", courseMatch[1]);
    path = COURSE_THEMES_PATH;
    changed = true;
  }

  const announcementMatch = path.match(
    /^\/courses\/([^/]+)\/(?:announcements|feed)\/?$/
  );
  if (announcementMatch && isUuid(announcementMatch[1])) {
    setHiddenId("courseId", announcementMatch[1]);
    path = COURSE_THEMES_PATH;
    params.set("tab", COURSE_FEED_TAB);
    changed = true;
  }

  for (const [pattern, clean] of TEST_PATH_RULES) {
    const match = path.match(pattern);
    if (match && isUuid(match[1])) {
      setHiddenId("quizId", match[1]);
      path = clean;
      changed = true;
    }
  }

  const bankMatch = path.match(/^\/question-bank\/bank\/([^/]+)\/?$/);
  if (bankMatch && isUuid(bankMatch[1])) {
    setHiddenId("bankId", bankMatch[1]);
    path = QUESTION_BANK_DETAIL_PATH;
    changed = true;
  }

  const queryMap: Record<string, HiddenIdKey | "form"> = {
    course_id: "courseId",
    themeId: "themeId",
    id: "form",
  };

  for (const [queryKey, target] of Object.entries(queryMap)) {
    const value = params.get(queryKey);
    if (!value || !isUuid(value)) continue;
    if (target === "form") {
      formHidden[queryKey] = value;
    } else {
      setHiddenId(target, value);
    }
    params.delete(queryKey);
    changed = true;
  }

  if (Object.keys(formHidden).length) {
    setFormHiddenParams(formHidden);
  }

  const nextSearch = params.toString();
  return {
    changed,
    pathname: path,
    search: nextSearch ? `?${nextSearch}` : "",
  };
}
