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
  | "inviteCourseId";

const STORAGE_PREFIX = "hidden:";
const FORM_PARAMS_KEY = "hidden:formParams";
const CHANGED_EVENT = "hidden-ids:changed";

export const COURSE_THEMES_PATH = "/courses/course_themes";
export const COURSE_INVITE_PATH = "/courses/invite";
export const TEST_PASS_PATH = "/test/pass";
export const TEST_EDIT_PATH = "/test/edit";
export const TEST_QUIZ_PATH = "/test/quiz";
export const TEST_QUIZ_RESULT_PATH = "/test/quiz-result";

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
  return "/courses";
}

export function getCourseInviteUrl(courseId: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}${COURSE_THEMES_PATH}/${courseId}/invite`;
}

export function openCourse(
  navigate: NavigateFunction,
  courseId: string | null | undefined,
  options?: { themeId?: string; replace?: boolean }
) {
  if (!courseId) return;
  setHiddenId("courseId", courseId);
  if (options?.themeId) setHiddenId("themeId", options.themeId);
  navigate(COURSE_THEMES_PATH, { replace: options?.replace });
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

  const inviteMatch = path.match(
    /^\/courses\/course_themes\/([^/]+)\/invite\/?$/
  );
  if (inviteMatch && isUuid(inviteMatch[1])) {
    setHiddenId("inviteCourseId", inviteMatch[1]);
    setHiddenId("courseId", inviteMatch[1]);
    path = COURSE_INVITE_PATH;
    changed = true;
  }

  const courseMatch = path.match(/^\/courses\/course_themes\/([^/]+)\/?$/);
  if (courseMatch && isUuid(courseMatch[1])) {
    setHiddenId("courseId", courseMatch[1]);
    path = COURSE_THEMES_PATH;
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

  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
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
