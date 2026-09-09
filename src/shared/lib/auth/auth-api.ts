import axios from "axios";
import { API_USERS_SERVICE_URL } from "shared/api/config";
import {
  AuthContextType,
  parseProfileContexts,
  ProfileContext,
  StoredUser,
} from "./auth-storage";
import {
  normalizeAuthPayload,
  persistAuthSession,
  ParsedAuthResult,
} from "./parse-auth-login";
import { attachAuthInterceptors } from "./attach-auth-interceptors";
import { refreshSession } from "./refresh-token";

export const $api_auth = axios.create({
  baseURL: API_USERS_SERVICE_URL,
  withCredentials: true,
});

attachAuthInterceptors($api_auth);

export type LoginCredentials = {
  username: string;
  password: string;
};

export async function authByPassword(
  data: LoginCredentials
): Promise<ParsedAuthResult> {
  const response = await $api_auth.post("users/auth", data);
  return persistAuthSession(response.data as StoredUser);
}

export async function authByGoogle(idToken: string): Promise<ParsedAuthResult> {
  const response = await $api_auth.post("users/auth/google", {
    id_token: idToken,
  });
  return persistAuthSession(response.data as StoredUser);
}

export async function fetchAuthContexts(): Promise<ProfileContext[]> {
  const response = await $api_auth.get("users/auth/contexts");
  const data = response.data;
  if (Array.isArray(data)) return parseProfileContexts(data);
  if (Array.isArray(data?.contexts)) return parseProfileContexts(data.contexts);
  if (Array.isArray(data?.available_contexts)) {
    return parseProfileContexts(data.available_contexts);
  }
  return [];
}

export async function selectAuthContext(
  context: AuthContextType | ProfileContext
): Promise<ParsedAuthResult> {
  const type = typeof context === "string" ? context : context.type;
  const response = await $api_auth.post("users/auth/context", {
    context: type,
  });
  return persistAuthSession({
    ...(response.data as StoredUser),
    active_context:
      typeof context === "string"
        ? response.data?.active_context || { type: context }
        : context,
  });
}

async function ensureProfileContext(
  parsed: ParsedAuthResult
): Promise<ParsedAuthResult> {
  if (parsed.activeContext) return parsed;

  const contexts = parsed.availableContexts.length
    ? parsed.availableContexts
    : await fetchAuthContexts();

  if (!contexts.length) return parsed;
  if (contexts.length === 1) {
    return selectAuthContext(contexts[0]);
  }

  return persistAuthSession({
    ...parsed.user,
    available_contexts: contexts,
    requires_context_selection: true,
  });
}

/**
 * Restore session from shared cookie (SSO across unet / lms / other apps).
 */
export async function restoreSessionFromCookie(): Promise<ParsedAuthResult | null> {
  try {
    const user = await refreshSession();
    return ensureProfileContext(normalizeAuthPayload(user));
  } catch {
    try {
      const contexts = await fetchAuthContexts();
      if (!contexts.length) return null;
      if (contexts.length === 1) {
        return selectAuthContext(contexts[0]);
      }
      return persistAuthSession({
        available_contexts: contexts,
        requires_context_selection: true,
      });
    } catch {
      return null;
    }
  }
}
