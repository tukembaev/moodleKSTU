import {
  AuthContextType,
  notifyAuthChanged,
  parseProfileContext,
  parseProfileContexts,
  ProfileContext,
  setActiveContext,
  setAvailableContexts,
  setCsrfToken,
  setStoredUser,
  StoredUser,
} from "./auth-storage";

export type ParsedAuthResult = {
  user: StoredUser;
  requiresContextSelection: boolean;
  availableContexts: ProfileContext[];
  activeContext: ProfileContext | null;
};

function pickUserPayload(data: StoredUser): StoredUser {
  if (data.user_data && typeof data.user_data === "object") {
    return {
      ...data,
      ...data.user_data,
    };
  }
  return { ...data };
}

export function normalizeAuthPayload(data: StoredUser): ParsedAuthResult {
  const payload = pickUserPayload(data);
  const availableContexts = parseProfileContexts(
    data.available_contexts ?? payload.available_contexts
  );

  let activeContext = parseProfileContext(
    data.active_context ?? payload.active_context
  );

  if (!activeContext && availableContexts.length === 1) {
    activeContext = availableContexts[0];
  }

  const requiresContextSelection = Boolean(
    data.requires_context_selection ??
      payload.requires_context_selection ??
      (availableContexts.length > 1 && !activeContext)
  );

  const contextType: AuthContextType | null = activeContext?.type ?? null;
  const role =
    (payload.role as string | undefined) ||
    contextType ||
    undefined;

  const user: StoredUser = {
    ...payload,
    available_contexts: availableContexts,
    active_context: activeContext ?? payload.active_context,
    role,
    isStudent:
      contextType === "student" ||
      role === "student" ||
      Boolean(payload.is_student) ||
      Boolean(payload.isStudent),
    avatar:
      (payload.avatar as string | undefined) ||
      (payload.imeag as string | undefined) ||
      activeContext?.avatar_url,
    position:
      (payload.position as string | undefined) || activeContext?.position,
  };

  return {
    user,
    requiresContextSelection,
    availableContexts,
    activeContext,
  };
}

export function persistAuthSession(data: StoredUser): ParsedAuthResult {
  const parsed = normalizeAuthPayload(data);

  setStoredUser(parsed.user);
  setAvailableContexts(parsed.availableContexts);

  if (parsed.activeContext) {
    setActiveContext(parsed.activeContext);
  }

  const csrf =
    (data.csrf_token as string | undefined) ||
    (parsed.user.csrf_token as string | undefined);
  setCsrfToken(csrf);

  notifyAuthChanged();
  return parsed;
}
