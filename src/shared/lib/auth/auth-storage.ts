export const USER_STORAGE_KEY = "user";
export const ACTIVE_CONTEXT_KEY = "active_context";
export const AVAILABLE_CONTEXTS_KEY = "available_contexts";
export const CSRF_TOKEN_KEY = "csrf_token";

/** @deprecated legacy key — cleared on logout / new login */
export const LEGACY_AUTH_DATA_KEY = "auth_data";
export const LEGACY_GOOGLE_AUTH_KEY = "google_auth";

export type AuthContextType = "employee" | "student";

/** @deprecated alias */
export type AuthContext = AuthContextType;

export type ProfileContext = {
  type: AuthContextType;
  full_name?: string;
  avatar_url?: string;
  position?: string;
};

export type StoredUser = Record<string, unknown> & {
  id?: number | string;
  user?: number | string;
  first_name?: string;
  last_name?: string;
  surname?: string;
  email?: string;
  avatar?: string;
  imeag?: string;
  position?: string;
  role?: string;
  isStudent?: boolean;
  is_student?: boolean;
  access?: string;
  csrf_token?: string;
  requires_context_selection?: boolean;
  available_contexts?: Array<AuthContextType | ProfileContext>;
  active_context?: AuthContextType | ProfileContext;
  user_data?: Record<string, unknown>;
};

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function isAuthContextType(value: unknown): value is AuthContextType {
  return value === "employee" || value === "student";
}

export function parseProfileContext(value: unknown): ProfileContext | null {
  if (isAuthContextType(value)) {
    return { type: value };
  }
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  if (!isAuthContextType(obj.type)) return null;
  return {
    type: obj.type,
    full_name: typeof obj.full_name === "string" ? obj.full_name : undefined,
    avatar_url: typeof obj.avatar_url === "string" ? obj.avatar_url : undefined,
    position: typeof obj.position === "string" ? obj.position : undefined,
  };
}

export function parseProfileContexts(value: unknown): ProfileContext[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(parseProfileContext)
    .filter((item): item is ProfileContext => Boolean(item));
}

export function getStoredUser(): StoredUser | null {
  const user = readJsonStorage<StoredUser | null>(USER_STORAGE_KEY, null);
  if (!user || typeof user !== "object") return null;
  return user;
}

/** Full active profile context object (from dedicated key or nested in `user`). */
export function getActiveProfileContext(): ProfileContext | null {
  const fromKey = parseProfileContext(
    readJsonStorage<unknown>(ACTIVE_CONTEXT_KEY, null)
  );
  if (fromKey) return fromKey;

  const raw = localStorage.getItem(ACTIVE_CONTEXT_KEY);
  if (isAuthContextType(raw)) return { type: raw };

  const user = getStoredUser();
  return parseProfileContext(user?.active_context);
}

/** `"employee" | "student"` for headers / role checks */
export function getActiveContext(): AuthContextType | null {
  return getActiveProfileContext()?.type ?? null;
}

export function getAvailableProfileContexts(): ProfileContext[] {
  const fromKey = parseProfileContexts(
    readJsonStorage<unknown>(AVAILABLE_CONTEXTS_KEY, null)
  );
  if (fromKey.length) return fromKey;

  const user = getStoredUser();
  return parseProfileContexts(user?.available_contexts);
}

/** @deprecated use getAvailableProfileContexts */
export function getAvailableContexts(): AuthContextType[] {
  return getAvailableProfileContexts().map((c) => c.type);
}

export function getCsrfToken(): string | null {
  return (
    localStorage.getItem(CSRF_TOKEN_KEY) ||
    getCookie("csrf_access_token") ||
    getCookie("csrf_refresh_token") ||
    null
  );
}

export function getRefreshCsrfToken(): string | null {
  return getCookie("csrf_refresh_token") || localStorage.getItem(CSRF_TOKEN_KEY);
}

export function setCsrfToken(token?: string | null) {
  if (token) {
    localStorage.setItem(CSRF_TOKEN_KEY, token);
  }
}

export function setActiveContext(context: AuthContextType | ProfileContext) {
  const profile = parseProfileContext(context);
  if (!profile) return;
  localStorage.setItem(ACTIVE_CONTEXT_KEY, JSON.stringify(profile));
}

export function setAvailableContexts(
  contexts: Array<AuthContextType | ProfileContext>
) {
  const profiles = parseProfileContexts(contexts);
  localStorage.setItem(AVAILABLE_CONTEXTS_KEY, JSON.stringify(profiles));
}

export function setStoredUser(user: StoredUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthStorage() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_CONTEXT_KEY);
  localStorage.removeItem(AVAILABLE_CONTEXTS_KEY);
  localStorage.removeItem(CSRF_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_DATA_KEY);
  localStorage.removeItem(LEGACY_GOOGLE_AUTH_KEY);
  localStorage.removeItem("refresh_error");
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event("storage"));
}

export function resolveUserId(user: StoredUser | null): number | null {
  if (!user) return null;
  const raw =
    user.id ??
    user.user ??
    (user.user_data as { user?: number; id?: number } | undefined)?.user ??
    (user.user_data as { id?: number } | undefined)?.id;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function hasAuthSession(user: StoredUser | null = getStoredUser()): boolean {
  if (!user) return false;
  if (getActiveContext()) return true;
  if (resolveUserId(user)) return true;
  if (typeof user.isStudent === "boolean") return true;
  return parseProfileContexts(user.available_contexts).length > 0;
}

export function isStudentFromUser(
  user: StoredUser | null,
  activeContext: AuthContextType | null = getActiveContext()
): boolean {
  if (activeContext === "student") return true;
  if (activeContext === "employee") return false;
  if (!user) return false;
  if (typeof user.isStudent === "boolean") return user.isStudent;
  if (typeof user.is_student === "boolean") return user.is_student;
  return user.role === "student";
}

/** "Фамилия Имя Отчество" → parts for UI */
export function splitFullName(fullName?: string): {
  first_name: string;
  last_name: string;
  surname?: string;
} {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  if (parts.length === 2) {
    return { last_name: parts[0], first_name: parts[1] };
  }
  return {
    last_name: parts[0],
    first_name: parts[1],
    surname: parts.slice(2).join(" "),
  };
}
